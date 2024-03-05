import { InternalServerError } from "../errors";
import { connect } from "mongoose";

export async function connectToMongo(): Promise<typeof import("mongoose")> {
  try {
    return await connect(process.env.LOCAL_MONGO_URI as string);
  } catch (error) {
    console.log(error);
    throw new InternalServerError({
      logging: true,
      message: "[server]: Could not connect to MongoDB",
    });
  }
}
