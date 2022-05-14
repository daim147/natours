import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { getFieldsFromSchemas, getRequiredFromSchemas } from '../../utils';
import { UserInterface } from '../interfaces';

const userSchema = new mongoose.Schema<UserInterface>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: 8,
		select: false,
	},
	passwordConfirmation: {
		type: String,
		required: [true, 'Password is required'],
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
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirmation = undefined; //ether it is required in schema but just for input data no to persist it in the database by setting undefined it will be removed
});

export const User = mongoose.model('User', userSchema);
export const userRequired: string[] = getRequiredFromSchemas(userSchema);
export const userFields: string[] = getFieldsFromSchemas(userSchema);
