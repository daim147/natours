import { NextFunction, Request, Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import sharp from 'sharp';
import { CustomError } from '../../interfaces';
import { catchAsync } from './errorMiddlewares';

// const storage = multer.diskStorage({
// 	destination: function (_, __, cb) {
// 		cb(null, 'public/img/users');
// 	},
// 	filename: function (req, file, cb) {
// 		const ext = file.mimetype.split('/')[1];
// 		cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
// 	},
// });

const storage = multer.memoryStorage();

const multerFilter = (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new CustomError('Not an image! Please upload only images.', 400));
	}
};

const upload = multer({
	storage,
	fileFilter: multerFilter,
});

export const resizeUserPhoto = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
	if (!req.file) return next();
	req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${req.file.filename}`);

	next();
});

export const uploadUserPhoto = upload.single('photo');
