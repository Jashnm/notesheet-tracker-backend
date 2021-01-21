import cookie from "cookie";
import generateToken from "./generateToken";

const generateCookie = (uuid: string, method: number): any => {
  let token = "";

  if (method === 0) {
    return cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/"
    });
  }

  token = generateToken(uuid);

  return cookie.serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 36000,
    path: "/"
  });
};

export default generateCookie;
