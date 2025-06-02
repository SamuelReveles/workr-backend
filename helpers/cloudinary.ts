import { v2 as cloudinary } from 'cloudinary';

export const createImage = async (file: any): Promise<string> => {
    const baseLog = '[createImage()]';

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        console.log(`${baseLog} file.tempFilePath: ${JSON.stringify(file.tempFilePath)}`);
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        const { secure_url } = result;
        console.log(`${baseLog} result: ${JSON.stringify(result)}`);
        console.log(`${baseLog} secure_url: ${JSON.stringify(secure_url)}`);
        return secure_url;
    } catch (error) {
        console.log(`${baseLog} error: ${JSON.stringify(error)}`);
    }
}

export const replaceImage = async (prevUrl: string, file: any): Promise<string> => {
    const baseLog = '[replaceImage()]';

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log(`${baseLog} file: ${JSON.stringify(file)}`);
    console.log(`${baseLog} prevUrl: ${JSON.stringify(prevUrl)}`);

    const nombreArr = prevUrl.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id, extension] = nombre.split('.');

    await cloudinary.uploader.destroy(public_id);

    return await createImage(file);
}