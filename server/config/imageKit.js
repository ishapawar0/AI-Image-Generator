import ImageKit from "imagekit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env inside imageKit config
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKI_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKI_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKI_URL_ENDPOINT
});

export default imagekit;