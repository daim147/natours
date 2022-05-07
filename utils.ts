import { SchemaType } from 'mongoose';

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

export const handleNonFilterProperty = <T>(value: T) => {
	if (Array.isArray(value)) {
		const stringArray = value.every((val) => typeof val === 'string');
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
