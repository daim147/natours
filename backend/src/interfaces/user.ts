export interface UserInterface {
	_id: string;
	name: string;
	password: string;
	email: string;
	photo?: string;
	role: string;
	passwordConfirmation?: string;
	passwordChangeAt?: Date;
	passwordResetToken?: string;
	passwordResetTokenExpire?: Date;
	active: boolean;
}

export interface UserInstanceMethods {
	correctPassword: (password: string, hash: string) => Promise<boolean>;
	changePasswordAfter: (timeStamp: number) => boolean;
	createPasswordResetToken: () => string;
}
