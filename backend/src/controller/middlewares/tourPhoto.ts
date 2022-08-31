import { NextFunction, Request, Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import sharp from 'sharp';
import { CustomError } from '../../interfaces';
import { catchAsync } from './errorMiddlewares';

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

export const resizeTourImages = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
	//@ts-ignore
	if (!req.files?.imageCover || !req.files?.images) return next();
	req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
	//@ts-ignore
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/tours/${req.body.imageCover}`);
	req.body.images = [];
	await Promise.all(
		//@ts-ignore
		req.files.images.map(async (file: any, i: number) => {
			const image = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
			await sharp(file.buffer)
				.resize(2000, 1333)
				.toFormat('jpeg')
				.jpeg({ quality: 90 })
				.toFile(`public/img/tours/${image}`);

			req.body.images.push(image);
		})
	);
	console.log(req.body.image);
	next();
});

export const uploadTourImages = upload.fields([
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 3 },
]);
