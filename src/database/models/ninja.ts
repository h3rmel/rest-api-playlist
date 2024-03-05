import { Schema, model } from "mongoose";
import { GeoSchema, IGeo } from "./geo";

interface INinja {
  name: string;
  rank: string;
  available: boolean;
  geometry: IGeo;
}

const NinjaSchema = new Schema<INinja>({
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  rank: {
    type: String,
    required: [true, "Rank field is required"],
  },
  available: {
    type: Boolean,
    default: false,
  },
  geometry: GeoSchema
});

export const NinjaModel = model<INinja>("ninja", NinjaSchema);
