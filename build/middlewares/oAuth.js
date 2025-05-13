"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = void 0;
const HttpError_1 = require("../errors/HttpError");
const google_auth_library_1 = require("google-auth-library");
// create google client
const googleClient = new google_auth_library_1.OAuth2Client();
// enviroments
const GOOGLE_CLIENT_ID = process.env.GOOGLE_AUDIENCE;
const google = async (req, res, next) => {
    try {
        const completedToken = req.headers.authorization;
        if (!completedToken?.startsWith("Bearer"))
            throw new HttpError_1.HttpError(400, "Invalid bearer token!");
        // extract token
        const token = completedToken.split(" ")[1];
        if (!token)
            throw new HttpError_1.HttpError(401, "Invalid token!");
        // validate token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email } = payload;
        req.user = { name, email, isWithGoogle: true };
        next();
    }
    catch (error) {
        if (error.message.startsWith("Token used too late")) {
            return next(new HttpError_1.HttpError(401, "Expired token!"));
        }
        next(error);
    }
};
exports.google = google;
