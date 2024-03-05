import express, { Router, Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

import { connectToMongo } from "../database/connect";
import { NinjaModel } from "../database/models/ninja";
import { BadRequestError, NotFoundError } from "../utils/errors";

const router: Router = express.Router();

/**
 * List all ninjas
 */
router.get(
  "/ninjas",
  async (req: Request, res: Response, next: NextFunction) => {
    const mongoConnection = await connectToMongo();

    try {
      const ninjasList = await NinjaModel.find({});

      res.status(200).send({
        message: "Ninjas listed successfully",
        ninjas: ninjasList,
      });
    } catch (error) {
      next(error);
    } finally {
      mongoConnection.disconnect();
    }
  }
);

/**
 * Find nearby ninjas
 */
router.get(
  "/ninjas/nearby",
  async (req: Request, res: Response, next: NextFunction) => {
    const mongoConnection = await connectToMongo();

    if (!req.query.lat || !req.query.lng)
      throw new BadRequestError("Coordinates are required!");

    try {
      const ninjasNearby = await NinjaModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(req.query.lng), Number(req.query.lat)],
            },
            distanceField: "dist.calculated",
            maxDistance: 100000,
            spherical: true,
          },
        },
      ]);

      console.log(ninjasNearby);

      res.status(200).send({
        message: "Nearby ninjas listed successfully",
        ninjas: ninjasNearby,
      });
    } catch (error) {
      next(error);
    } finally {
      mongoConnection.disconnect();
    }
  }
);

/**
 * Find a Ninja
 */
router.get(
  "/ninjas/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const mongoConnection = await connectToMongo();

    try {
      const ninja = await NinjaModel.findById(req.params.id);

      if (!ninja?.$isValid) throw new NotFoundError("Ninja not found");

      res.status(200).send({
        message: "Ninja finded successfully",
        ninja: ninja,
      });
    } catch (error) {
      next(error);
    } finally {
      mongoConnection.disconnect();
    }
  }
);

/**
 * Add a new ninja
 */
router.post(
  "/ninjas",
  async (req: Request, res: Response, next: NextFunction) => {
    const mongoConnection = await connectToMongo();

    if (!req.body.name) throw new BadRequestError("Name is required!");

    if (!req.body.rank) throw new BadRequestError("Rank is required!");

    if (!req.body.geometry.coordinates)
      throw new BadRequestError("Coordinates are required!");

    try {
      const newNinja = await NinjaModel.create({
        name: req.body.name,
        rank: req.body.rank,
        available: req.body.available,
        geometry: {
          type: req.body.geometry.type,
          coordinates: req.body.geometry.coordinates,
        },
      });

      res.status(201).send({
        message: "Ninja added successfully",
        ninja: newNinja,
      });
    } catch (error) {
      next(error);
    } finally {
      mongoConnection.disconnect();
    }
  }
);

/**
 * Update a ninja
 */
router.put(
  "/ninjas/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const mongoConnection = await connectToMongo();

    if (!isValidObjectId(req.params.id))
      throw new BadRequestError("Invalid ID format!");

    if (!req.body.name) {
      throw new BadRequestError("Name is required!");
    }

    if (!req.body.rank) {
      throw new BadRequestError("Rank is required!");
    }

    try {
      const existingNinja = await NinjaModel.findById(req.params.id);

      if (!existingNinja?.$isValid) throw new NotFoundError("Ninja not found");

      await NinjaModel.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        req.body
      );

      const updatedNinja = await NinjaModel.findById(req.params.id);

      res.status(200).send({
        message: "Ninja updated successfully",
        ninja: updatedNinja,
      });
    } catch (error) {
      next(error);
    } finally {
      mongoConnection.disconnect();
    }
  }
);

/**
 * Delete a ninja
 */
router.delete(
  "/ninjas/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const mongoConnection = await connectToMongo();

    if (!isValidObjectId(req.params.id))
      throw new BadRequestError("Invalid ID format!");

    try {
      const existingNinja = await NinjaModel.findById(req.params.id);

      if (!existingNinja?.$isValid) throw new NotFoundError("Ninja not found");

      const deletedNinja = await NinjaModel.findByIdAndDelete(req.params.id);

      res.status(200).send({
        message: "Ninja deleted successfully",
        ninja: deletedNinja,
      });
    } catch (error) {
      next(error);
    } finally {
      mongoConnection.disconnect();
    }
  }
);

export { router };
