import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();
const sendRoleAccording = async (role: any, deptId: any) => {
  let nextHead: any;
  // try {
  switch (role) {
    case "Lecturer":
      const allFaculty = await prisma.dept
        .findUnique({
          where: {
            id: deptId
          }
        })
        .faculty();

      nextHead = await allFaculty.find((a: any) => a.role === "HOD");
      break;
    case "HOD":
      const schoolId: any = await prisma.dept
        .findUnique({
          where: {
            id: deptId
          }
        })
        .school();

      nextHead = await prisma.school
        .findUnique({
          where: {
            id: schoolId.id
          }
        })
        .dean();
      break;

    case "DEAN":
      nextHead = await prisma.user.findFirst({
        where: {
          role: "REGISTRAR"
        }
      });
      break;

    // case "REGISTRAR":
    //   nextHead = await prisma.user.findFirst({
    //     where: { role: "PRESIDENT" }
    //   });

    //   break;
    default:
      console.log("ERROR");
      break;
  }
  // } catch (err) {
  //   console.log("Error");
  // }

  return nextHead;
};

export const createNotesheet = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, body, financial } = req.body;

    const { uuid, deptId, role } = res.locals.user;

    const nextHead = await sendRoleAccording(role, deptId);

    const newNotesheet = await prisma.notesheet.create({
      data: {
        title,
        body,
        financial,

        startedBy: {
          connect: {
            uuid
          }
        },
        currentUser: {
          connect: [{ uuid: nextHead.uuid }, { uuid }]
        },
        status: "LIVE"
      },
      include: {
        startedBy: {
          select: {
            id: true,
            uuid: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(newNotesheet);
  }
);

export const nextUpdateNotesheet = asyncHandler(
  async (req: Request, res: Response) => {
    const { uuid } = req.params;

    const { status } = req.body;
    const whichUser: any = await prisma.user.findUnique({
      where: { uuid: res.locals.user.uuid }
    });
    const deptId = whichUser.deptId;
    const role = whichUser.role;

    const nextHead = await sendRoleAccording(role, deptId);

    //Confirm if the user updating exists on notesheet
    const userExists = await prisma.notesheet.findFirst({
      where: {
        AND: [
          {
            uuid
          },
          {
            currentUser: {
              some: { uuid: whichUser.uuid }
            }
          }
        ]
      }
    });

    if (userExists === null) {
      res.status(404);
      throw new Error("User not allowed");
    }

    let updatedNotesheet;
    if (status === "COMPLETED") {
      updatedNotesheet = await prisma.notesheet.update({
        where: { uuid },
        data: {
          status
        }
      });
    } else {
      updatedNotesheet = await prisma.notesheet.update({
        where: { uuid },
        data: {
          status,
          currentUser: {
            connect: { id: nextHead.id }
          }
        }
      });
    }

    res.json(updatedNotesheet);
  }
);

export const getAssociatedUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const { uuid } = req.params;

    const result = await prisma.notesheet.findUnique({
      where: { uuid },
      select: {
        currentUser: true,
        updatedAt: true
      }
    });

    res.json(result);
  }
);

export const getUserAllNotesheets = asyncHandler(
  async (_: Request, res: Response) => {
    const { uuid } = res.locals.user;

    console.log(uuid);
    const notesheets = await prisma.notesheet.findMany({
      where: { startedBy: { uuid: uuid } },
      include: {
        startedBy: {
          select: { uuid: true, name: true, role: true }
        },
        currentUser: {
          select: { uuid: true, name: true, role: true }
        }
      }
    });

    res.json(notesheets);
  }
);

export const deleteNotesheet = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    const { uuid } = req.params;

    const find = await prisma.user.findFirst({
      where: { AND: [{ uuid: user.uuid }, { notesheet: { some: { uuid } } }] }
    });

    if (!find) {
      res.status(403);
      throw new Error("Permission denied");
    }

    await prisma.notesheet.delete({
      where: { uuid }
    });

    res.json("Notesheet deleted");
  }
);

export const getAllNotesheets = asyncHandler(
  async (_: Request, res: Response) => {
    console.log("hey");

    const result = await prisma.notesheet.findMany();
    res.json(result);
  }
);
