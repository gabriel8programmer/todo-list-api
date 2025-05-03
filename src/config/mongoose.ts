import mongoose from "mongoose";
import { z } from "zod";

const ENV_SCHEMA = z.object({
  MONGODB_DATABASE_NAME: z.string(),
  MONGODB_PASSWORD: z.string(),
  MONGODB_URL: z.string(),
});

const { MONGODB_DATABASE_NAME, MONGODB_PASSWORD, MONGODB_URL } = ENV_SCHEMA.parse(process.env);

// replace values in mongodb_url
const MONGODB_URL_CONVERTED = MONGODB_URL.replace("<PASSWORD>", MONGODB_PASSWORD).replace(
  "<DATABASE>",
  MONGODB_DATABASE_NAME
);

const connect = async () => {
  return mongoose.connect(MONGODB_URL_CONVERTED);
};

connect()
  .then(() => {
    console.log("successfully connected to the database!");
  })
  .catch((error) => console.log(error.message));
