import path from 'path';
import fsPromise from 'fs/promises';
import fs from 'fs';
interface filesData {
	[key: string]: { name: string; content: string; path: string };
}
export const fileLoadData: filesData = {};
export const initialFileLoad = (...fileNames: string[]) => {
	fileNames = [...new Set(fileNames)];
	const files = fileNames.filter((fileName) => {
		const name = path.basename(fileName, path.extname(fileName));
		return !(name in fileLoadData);
	});
	files.forEach((fileName) => {
		const content = fs.readFileSync(fileName, 'utf8');
		updateFileLoadData(fileName, false, content);
	});
	return fileLoadData;
};

const updateFileLoadData = async (fileName: string, loadFromFile: boolean, content: string) => {
	const name = path.basename(fileName, path.extname(fileName));
	if (loadFromFile) {
		content = await fsPromise.readFile(fileName, 'utf8');
	}
	const data = { name, content, path: fileName };
	fileLoadData[name] = data;
	return data;
};

export const writeFile = async (fileName: string, data: string) => {
	await fsPromise.writeFile(fileName, data);
	const read = await updateFileLoadData(fileName, true, '');
	return read;
};
export const getFileLoadData = (key: string) => () => fileLoadData[key];
