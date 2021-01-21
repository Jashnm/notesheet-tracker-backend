import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const User = new PrismaClient().user;

const protect: any = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;

      if (!token) throw new Error("Unauthenticated - no token");

      const decodedUser: any = await jwt.verify(token, process.env.JWT_SECRET!);

      const user = await User.findUnique({
        where: { uuid: decodedUser.uuid }
      });

      if (!user) throw new Error("Unauthenticated");

      res.locals.user = user;

      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

export default protect;
