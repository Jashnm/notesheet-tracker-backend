import { PrismaClient } from "@prisma/client";
import { NextFunction, request, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import { Parser } from "json2csv";
import path from "path";

const prisma = new PrismaClient();

const directory = process.cwd() + "/resources/";

export const isUserAdmin = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    const checkUser = await prisma.user.findFirst({
      where: {
        AND: [
          {
            isAdmin: true
          },
          {
            uuid: user.uuid
          }
        ]
      }
    });

    if (!checkUser) {
      throw new Error("Permission denied");
    }
    next();
  }
);

export const deleteCompleted60 = asyncHandler(
  async (_: Request, res: Response) => {
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() - 45);

    const findCompletedNotesheets = await prisma.notesheet.deleteMany({
      where: {
        AND: [
          {
            updatedAt: {
              lte: dateToday
            }
          },
          {
            status: "COMPLETED"
          }
        ]
      }
    });

    res.json(findCompletedNotesheets);
  }
);

export const getDatainCSV = asyncHandler(async (_: Request, res: Response) => {
  const dateToLocal = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  };

  const allNotesheets: [] | any = await prisma.notesheet.findMany({
    include: {
      startedBy: { select: { name: true } },
      currentUser: { select: { name: true } }
    }
  });

  allNotesheets.map((n: any) => {
    n.createdAt = dateToLocal(n.createdAt);
    n.updatedAt = dateToLocal(n.updatedAt);
  });

  const csvParser = new Parser({ header: true });
  const csv = csvParser.parse(allNotesheets);

  fs.writeFile(path.join(directory + "all_notesheets.csv"), csv, (err) => {
    if (err) {
      console.log(err);
      throw new Error("Cannot parse");
    }
  });
  res.json("done");
});

export const downloadFile = asyncHandler(async (_: Request, res: Response) => {
  const file = fs.readdirSync(directory)[0];

  res.download(directory + file, (err) => {
    if (err) {
      throw new Error("Internal server error.");
    }
  });
});

export const getAllUsers = asyncHandler(async (_: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const uuid = req.params.uuid;

  const deletedUser = await prisma.user.delete({ where: { uuid } });

  res.json(deletedUser);
});
