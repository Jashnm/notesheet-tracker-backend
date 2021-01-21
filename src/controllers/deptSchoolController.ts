import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
import asyncHandler from "express-async-handler";

export const createSchool = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, dean } = req.body;

    //If dean exists
    const findDean: any = await prisma.user.findUnique({
      where: { id: +dean }
    });

    const newSchool = await prisma.school.create({
      data: {
        name,
        dean: {
          connect: { uuid: findDean.uuid }
        }
      }
    });

    //If dean doesn't exists

    //   const newSchool = await prisma.school.create({
    //     data: {
    //       name,
    //       dean: {
    //         create: { name: dean, role: "DEAN" }
    //       }
    //     }
    //   });

    res.json(newSchool);
  }
);

export const createDept = asyncHandler(async (req: Request, res: Response) => {
  const { name, school } = req.body;

  const schoolUuid: any = await prisma.school.findUnique({
    where: { id: +school }
  });
  const newDept = await prisma.dept.create({
    data: {
      name,
      school: { connect: { uuid: schoolUuid.uuid } }
    }
  });

  res.json(newDept);
});
