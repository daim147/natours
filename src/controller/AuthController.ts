import { NextFunction, Request, Response } from 'express';

import { createHash, generateTokenAndSend, sendEmail } from '../../utils';
import { API } from '../enums';
import { CustomError } from '../interfaces';
import { User, userRequired } from '../model/userModel';
import { controller, error, patch, post, use } from './decorators';
import { bodyValidator, catchAsync, jwtVerification, paramsValidator } from './middlewares';

@controller(`${API.start}auth`)
class AuthController {
	@post('/signup')
	@use(bodyValidator({ required: true, values: userRequired }, { required: false, values: [] }))
	@error(catchAsync)
	async signup(req: Request, res: Response) {
		const newUser = await User.create(req.body);
		//generating token
		generateTokenAndSend(newUser, 201, res);
	}

	@post('/login')
	@error(catchAsync)
	@use(bodyValidator({ required: true, values: ['email', 'password'] }))
	async login(req: Request, res: Response, next: NextFunction) {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');
		//check if user exists and also given password match the hashPassword store in db
		if (!user || !(await user?.correctPassword(password, user.password))) {
			return next(new CustomError('Invalid email or password', 401));
		}
		//generate new jwt token and send back to the user
		generateTokenAndSend(user, 200, res);
	}

	@post('/forgotPassword')
	@error(catchAsync)
	@use(bodyValidator({ required: true, values: ['email'] }))
	async forgetPassword(req: Request, res: Response, next: NextFunction) {
		const { email } = req.body;
		//1) get user based on email
		const user = await User.findOne({ email });
		if (!user) {
			return next(new CustomError('No user belongs to this email', 404));
		}
		//2) generate password reset token
		const resetToken = user.createPasswordResetToken();
		// saving passwordResetToken to the database alongside tokenExpire time
		await user.save({ validateBeforeSave: false }); //it will run all the validator we specify since we remove passwordConfirmation in pre save middleware so it is not present in document right now so I disable it
		//3) Send it to user email
		const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
		const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

		try {
			await sendEmail({
				to: user.email,
				subject: 'Your password reset token valid for 10 minutes',
				text,
			});
			res.status(200).jsend.success('Token Send to email!');
		} catch (error) {
			//reset token if there is any error
			user.passwordResetToken = undefined;
			user.passwordResetTokenExpire = undefined;
			//and save back to db
			await user.save({ validateBeforeSave: false }); //it will disable all the validator we have specify
			return next(new CustomError('There was an error sending the email. Try again later!', 500));
		}
	}

	@patch('/resetPassword/:token')
	@use(paramsValidator('token'), bodyValidator({ required: true, values: ['password', 'passwordConfirmation'] }))
	@error(catchAsync)
	async resetPassword(req: Request, res: Response, next: NextFunction) {
		//1) Get user based on the resetToken
		const hashToken = createHash(req.params.token);
		const user = await User.findOne({ passwordResetToken: hashToken, passwordResetTokenExpire: { $gt: Date.now() } });
		//2) if token has not expired and there is user, set new Password
		const { password, passwordConfirmation } = req.body;
		if (!user) {
			return next(new CustomError('Invalid or Expire Token', 400));
		}
		user.password = password;
		user.passwordConfirmation = passwordConfirmation;
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpire = undefined;
		await user.save(); //here i want to run all the validator
		//3) update changePasswordAt fields for the user

		//4) Log the user in and send JWT
		generateTokenAndSend(user, 201, res);
	}

	@patch('/updatePassword')
	@error(catchAsync)
	@use(
		jwtVerification,
		bodyValidator({ required: true, values: ['currentPassword', 'password', 'passwordConfirmation'] })
	)
	async updatePassWord(req: Request, res: Response, next: NextFunction) {
		//1) Get user from collection
		const user = await User.findById(req.user._id).select('+password');
		//2) Check posted password is correct
		const { currentPassword, password, passwordConfirmation } = req.body;
		if (!user || !(await user?.correctPassword(currentPassword, user.password))) {
			return next(new CustomError('Wrong Current Password or something went wrong', 401));
		}
		//3) if so update	password
		user.password = password;
		user.passwordConfirmation = passwordConfirmation;
		await user.save();
		//4) Log user in and send JWT
		generateTokenAndSend(user, 200, res);
	}
}
