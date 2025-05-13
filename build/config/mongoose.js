"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const ENV_SCHEMA = zod_1.z.object({
    MONGODB_DATABASE_NAME: zod_1.z.string(),
    MONGODB_PASSWORD: zod_1.z.string(),
    MONGODB_URL: zod_1.z.string(),
});
const { MONGODB_DATABASE_NAME, MONGODB_PASSWORD, MONGODB_URL } = ENV_SCHEMA.parse(process.env);
// replace values in mongodb_url
const MONGODB_URL_CONVERTED = MONGODB_URL.replace("<PASSWORD>", MONGODB_PASSWORD).replace("<DATABASE>", MONGODB_DATABASE_NAME);
const connect = async () => {
    return mongoose_1.default.connect(MONGODB_URL_CONVERTED);
};
connect()
    .then(() => {
    console.log("successfully connected to the database!");
})
    .catch((error) => console.log(error.message));
