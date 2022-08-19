import type { SchemaType, Query as MongooseQuery } from 'mongoose';
import type { Query } from 'express-serve-static-core';
import jwt, { type Secret } from 'jsonwebtoken';
import nodemailer, { type SendMailOptions } from 'nodemailer';
import type { Response } from 'express';
import crypto from 'crypto';

import { CustomError, UserInterface } from './interfaces';

export const getRequiredFromSchemas = <T extends { paths: { [key: string]: SchemaType<any> } }>(
	schema: T
): string[] => {
	let requiredFields: string[] = [];
	Object.keys(schema.paths).forEach((key: any) => {
		const required = schema.paths[key as keyof typeof schema.paths]?.isRequired;
		if (required) {
			requiredFields.push(key);
		}
	});
	return requiredFields;
};

export const getFieldsFromSchemas = <T extends { paths: { [key: string]: SchemaType<any> } }>(schema: T): string[] => {
	return Object.keys(schema.paths);
};
type type = 'string' | 'object' | 'array' | 'number' | 'boolean' | 'undefined';
export const checkTypeFromStringify = (value: string): type => {
	if (!value) return 'undefined';
	try {
		const parsedValue = JSON.parse(value);
		const type = typeof parsedValue;
		if (Array.isArray(parsedValue)) {
			return 'array';
		} else if (type === 'number') {
			return 'number';
		} else if (type === 'boolean') {
			return 'boolean';
		}
		return 'object';
	} catch (error) {
		return 'string';
	}
};

export const isStringArray = (array: any[]) => array.every((val) => typeof val === 'string');

export const handleNonFilterProperty = <T>(value: T) => {
	if (Array.isArray(value)) {
		const stringArray = isStringArray(value);
		if (stringArray) {
			return value.join(' ');
		} else {
			return value;
		}
	} else if (typeof value === 'string') {
		return value.split(',').join(' ');
	}
	return value;
};

export const objectToUrlParamString = <T extends { [key: string]: any }>(obj: T): string =>
	new URLSearchParams(obj).toString();

export const deepClone = (obj: Object): Object => JSON.parse(JSON.stringify(obj));

export const queryWithNonFilter = <T extends MongooseQuery<any, {}, {}, {}>>(query: T, nonFilterQuery: Query) => {
	for (let key in nonFilterQuery) {
		if (key === 'sort') {
			query = query[key](nonFilterQuery[key]);
		} else if (key === 'limit') {
			query = query[key](Number(nonFilterQuery[key]));
		} else if (key === 'select') {
			query = query[key](nonFilterQuery[key]);
		} else if (key === 'page') {
			const skip = (Number(nonFilterQuery[key]) - 1) * (Number(nonFilterQuery['limit']) || 1);
			query = query.skip(skip);
		}
	}
	return query;
};
export const secret: Secret = process.env.JWT_SECRET || 'there_is_no_secret';
export const signToken = <T>(id: T) =>
	jwt.sign({ id }, secret, {
		expiresIn: process.env.JWT_EXPIRATION,
	});
export const verifyToken = <T>(token: string, secret: Secret): Promise<T> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decode) => {
			if (!err) {
				resolve(decode as T);
			} else {
				reject(new CustomError('Invalid Token! Please Login again', 401));
			}
		});
	});
};

export const sendEmail = async (options: SendMailOptions) => {
	//1) Create Transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: Number(process.env.EMAIL_port),
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	//2) Define Email Options
	const mailOptions = {
		...options,
		from: 'Husnain Syed <daimshah784@gmail.com>',
	};
	//3) Send email
	await transporter.sendMail(mailOptions);
};

export const generateTokenAndSend = (user: UserInterface, statusCode: number, res: Response) => {
	const token = signToken(user._id);
	const expirationDay = Number(process.env.JWT_COOKIES_EXPIRATION) || 90;
	res.cookie('jwt', token, {
		expires: new Date(Date.now() + expirationDay * 24 * 60 * 60 * 1000),
		...(process.env.NODE_ENV === 'production' && { secure: true }), //only for HTTPS connections and in production
		httpOnly: false, // cookie can not be access and change by browser
	});
	user.password = undefined!; //remove password from user object when creating it schema Select false does not work on creating new document and also we are explicitly selecting password in login and updatePassword
	res.status(statusCode).jsend.success({ token, result: user });
};

//grepper create hash typescript
export const createHash = (payload: string) => crypto.createHash('sha256').update(payload).digest('hex');
//end grepper
