import { SchemaType, Query as MongooseQuery } from 'mongoose';
import { Query } from 'express-serve-static-core';
import jwt, { Secret } from 'jsonwebtoken';

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
				reject(err);
			}
		});
	});
};
