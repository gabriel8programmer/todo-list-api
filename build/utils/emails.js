"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.verifyEmailTemplateString = void 0;
const nodemailer_1 = require("../config/nodemailer");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const verifyEmailTemplateString = (data, redirectLink) => {
    const template = node_fs_1.default.readFileSync(node_path_1.default.resolve("src/templates/emails/verify-email-template/index.html"), "utf-8");
    return template.replace("{{name}}", data.name).replace("{{redirect_link}}", redirectLink);
};
exports.verifyEmailTemplateString = verifyEmailTemplateString;
const sendMail = async (email, subject, html) => {
    await nodemailer_1.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
