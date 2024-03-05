import { Schema, model } from "mongoose";

export interface IGeo {
  type: string;
  coordinates: number[];
}

export const GeoSchema = new Schema<IGeo>({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  },
});

export const GeoModel = model<IGeo>("geo", GeoSchema);
