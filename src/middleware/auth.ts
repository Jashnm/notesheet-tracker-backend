// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import { PrismaClient } from "@prisma/client";
// import { NextFunction, Request, Response } from "express";

// const User = new PrismaClient().user;

// const protect: any = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       try {
//         token = req.headers.authorization.split(" ")[1];

//         const decoded: any = await jwt.verify(token, process.env.JWT_SECRET!);

//         res.locals.user = await User.findUnique({
//           where: { uuid: decoded.uuid }
//         });
//         next();
//       } catch (err) {
//         res.status(401);
//         console.log(err);
//         throw new Error("Not authorized, token failed");
//       }
//     }

//     if (!token) {
//       res.status(401);
//       throw new Error("Not authorized");
//     }
//   }
// );

// export default protect;

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const User = new PrismaClient().user;

const protect: any = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.myToken;

    if (!token) throw new Error("Unauthenticated - no token");

    const decodedUser: any = await jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findUnique({
      where: { uuid: decodedUser.uuid }
    });

    if (!user) throw new Error("Unauthenticated");

    res.locals.user = user;

    next();
  }
);

export default protect;
