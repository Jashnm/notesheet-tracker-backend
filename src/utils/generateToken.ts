import jwt from "jsonwebtoken";

const generateToken = (uuid: string): string => {
  return jwt.sign({ uuid }, process.env.JWT_SECRET!, { expiresIn: "10d" });
};

export default generateToken;
