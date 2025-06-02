"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceImage = exports.createImage = void 0;
const cloudinary_1 = require("cloudinary");
const createImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const baseLog = '[createImage()]';
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        console.log(`${baseLog} file.tempFilePath: ${JSON.stringify(file.tempFilePath)}`);
        const result = yield cloudinary_1.v2.uploader.upload(file.tempFilePath);
        const { secure_url } = result;
        console.log(`${baseLog} result: ${JSON.stringify(result)}`);
        console.log(`${baseLog} secure_url: ${JSON.stringify(secure_url)}`);
        return secure_url;
    }
    catch (error) {
        console.log(`${baseLog} error: ${JSON.stringify(error)}`);
    }
});
exports.createImage = createImage;
const replaceImage = (prevUrl, file) => __awaiter(void 0, void 0, void 0, function* () {
    const baseLog = '[replaceImage()]';
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log(`${baseLog} file: ${JSON.stringify(file)}`);
    console.log(`${baseLog} prevUrl: ${JSON.stringify(prevUrl)}`);
    const nombreArr = prevUrl.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id, extension] = nombre.split('.');
    yield cloudinary_1.v2.uploader.destroy(public_id);
    return yield (0, exports.createImage)(file);
});
exports.replaceImage = replaceImage;
//# sourceMappingURL=cloudinary.js.map