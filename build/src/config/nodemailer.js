"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransporter = void 0;
const nodemailer_1 = require("nodemailer");
const zod_1 = require("zod");
const ENV_SCHEMA = zod_1.z.object({
    EMAIL_HOST: zod_1.z.string(),
    EMAIL_PORT: zod_1.z.coerce.number(),
    EMAIL_USER: zod_1.z.string(),
    EMAIL_PASS: zod_1.z.string(),
});
const EmailEnv = ENV_SCHEMA.parse(process.env);
exports.emailTransporter = (0, nodemailer_1.createTransport)({
    host: EmailEnv.EMAIL_HOST,
    port: EmailEnv.EMAIL_PORT,
    auth: {
        user: EmailEnv.EMAIL_USER,
        pass: EmailEnv.EMAIL_PASS,
    },
});
