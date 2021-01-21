import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import argon2 from "argon2";
import asyncHandler from "express-async-handler";
import generateCookie from "../utils/generateCookie";

const prisma = new PrismaClient();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, role, email } = req.body;
  let { pwd } = req.body;
  const userExists = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  pwd = await argon2.hash(pwd);

  //   if (!dept) {
  const user = await prisma.user.create({
    data: {
      name,
      role,
      email,
      password: pwd
    }
  });

  if (user) {
    const { password, ...userNoPwd } = user;

    res.set("SET-Cookie", generateCookie(user.uuid, 1));

    res.status(201).json({
      ...userNoPwd
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

  //   } else {
  //     deptId = +req.body.dept;
  //     deptUuid = await prisma.dept.findUnique({
  //       where: { id: deptId }
  //     });
  //     const user = await prisma.user.create({
  //       data: {
  //         name,
  //         role,
  //         dept: {
  //           connect: {
  //             uuid: deptUuid.uuid
  //           }
  //         },
  //         email,
  //         password
  //       },
  //       select: {
  //         name: true,
  //         role,
  //         email,
  //         uuid,
  //         id,
  //         dept,
  //         deptId
  //       }
  //     });

  //     if (user) {
  //       res.status(201).json({
  //         ...user,
  //         token: generateToken(user.uuid)
  //       });
  //     } else {
  //       res.status(400);
  //       throw new Error("Invalid user data");
  //     }
  //   }
});
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, pwd } = req.body;

  const user: any = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const correctPassword = await argon2.verify(user.password, pwd);

  // if (!correctPassword) {
  //   throw new Error("Wrong credentials");
  // }

  const { password, ...noPasswordUser } = user;
  if (user && correctPassword) {
    res.set("SET-Cookie", generateCookie(user.uuid, 1));
    res.json({
      ...noPasswordUser
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const getUserProfile = asyncHandler(
  async (_: Request, res: Response) => {
    const { uuid } = res.locals.user;
    let user: any = await prisma.user.findFirst({
      where: { uuid },
      include: { dept: { include: { school: true } } }
    });

    if (user.role === "DEAN") {
      user = await prisma.user.findFirst({
        where: { uuid },

        include: { school: true }
      });
    }

    const { password, ...noPasswordUser } = user;
    if (user) {
      res.json({
        ...noPasswordUser
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const data = req.body;
  const dept: any = await prisma.dept.findFirst({
    where: {
      name: data.dept
    }
  });

  const result = await prisma.user.update({
    where: { uuid },
    data: {
      dept: {
        connect: {
          uuid: dept.uuid
        }
      }
    }
  });

  res.json(result);
});

//@access Private
//Get Notesheets started by the user

export const getUserCurrentNotesheets = asyncHandler(
  async (_: Request, res: Response) => {
    const { uuid } = res.locals.user;

    const allUserNotesheets = await prisma.notesheet.findMany({
      where: {
        AND: [
          {
            currentUser: {
              some: { uuid }
            }
          },
          {
            status: { equals: "LIVE" }
          }
        ]
      },
      orderBy: { updatedAt: "desc" },
      include: {
        startedBy: {
          select: {
            id: true,
            uuid: true,
            name: true,
            email: true,
            password: false
          }
        }
      }
    });

    res.json(allUserNotesheets);
  }
);

//Logout

export const logout = (_: Request, res: Response) => {
  res.set("Set-Cookie", generateCookie("", 0));

  return res.status(200).json({ success: true });
};
