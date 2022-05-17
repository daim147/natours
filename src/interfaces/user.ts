export interface UserInterface {
	_id: string;
	name: string;
	password: string;
	email: string;
	photo?: string;
	passwordConfirmation?: string;
	passwordChangeAt?: Date;
	correctPassword: (password: string, hash: string) => Promise<boolean>;
	changePasswordAfter: (timeStamp: number) => boolean;
}
