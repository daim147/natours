export const AutoBindThis = (_: any, __: string, property: PropertyDescriptor) => {
	let { value, writable, ...object } = property;
	return {
		get() {
			return value.bind(this);
		},
		set: undefined,
		...object,
	};
};
