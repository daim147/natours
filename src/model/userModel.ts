import mongoose, { Model } from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { createHash, getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';
import { UserInstanceMethods, UserInterface, userRole } from '../interfaces';
//schema validation is just for inputting data
const userSchema = new mongoose.Schema<UserInterface, Model<UserInterface, {}, UserInstanceMethods>>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: 8,
		select: false, //does not run for save, create
	},
	passwordConfirmation: {
		type: String,
		// required: [true, 'Confirm Password is required'],
		validate: {
			validator: function (this: UserInterface, value: string) {
				return this.password === value;
			},
			message: '{PATH} should match the password',
		},
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		trim: true,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Should be a valid email'],
	},
	photo: {
		type: String,
	},
	passwordChangeAt: {
		type: Date,
	},
	passwordResetToken: {
		type: String,
	},
	passwordResetTokenExpire: {
		type: Date,
	},
	role: {
		type: String,
		enum: {
			values: userRole,
			message: '{VALUE} is not supported for {PATH}. it should be should be ' + userRole,
		},
		default: 'user',
	},
	active: {
		type: Boolean,
		select: false,
	},
});
//it will run when ever the document is save or updated and we check if password is modified
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirmation = undefined; //ether it is required in schema but just for input data no to persist it in the database by setting undefined it will be removed
	if (!this.isNew) {
		//it check if the document is not new
		this.passwordChangeAt = new Date(Date.now() - 10000); //sub 10000 milliseconds because some time jwt issue before the passwordChange has Set
	}
});

userSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any>, next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.correctPassword = async (password: string, hashPassword: string) => {
	return await bcrypt.compare(password, hashPassword);
};
userSchema.methods.changePasswordAfter = function (this: UserInterface, JWTTimestamp: number) {
	if (this.passwordChangeAt) {
		console.log(this.passwordChangeAt, new Date(JWTTimestamp * 1000));
		const changeTimeStamp = this.passwordChangeAt.getTime() / 1000;
		return JWTTimestamp < changeTimeStamp;
	}
	return false;
};
userSchema.methods.createPasswordResetToken = function (this: UserInterface) {
	const token = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = createHash(token);
	this.passwordResetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
	return token;
};
export const User = mongoose.model<UserInterface, Model<UserInterface, {}, UserInstanceMethods>>('User', userSchema);
export const userRequired: string[] = getRequiredFromSchemas(userSchema);
export const userFields: string[] = getFieldsFromSchemas(userSchema);
