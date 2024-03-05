import { InternalServerError } from "../utils/errors";
import { connect } from "mongoose";

export async function connectToMongo(): Promise<typeof import("mongoose")> {
  try {
    return await connect(process.env.LOCAL_MONGO_URI as string);
  } catch (error) {
    console.log(error);
    throw new InternalServerError("[server]: Could not connect to MongoDB");
  }
}
