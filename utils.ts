import mongoose from 'mongoose';
export const getRequiredFromSchemas = <
	T extends { paths: { [key: string]: mongoose.SchemaType<any> } }
>(
	schema: T
) => {
	let requiredFields: string[] = [];
	Object.keys(schema.paths).forEach((key: any) => {
		const required = schema.paths[key as keyof typeof schema.paths]?.isRequired;
		if (required) {
			requiredFields.push(key);
		}
	});
	return requiredFields;
};
