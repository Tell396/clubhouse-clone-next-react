import jwt from "jsonwebtoken";
import { reduce } from "lodash";
import { UserData } from "../../client/pages";

export const createJWT = (user: UserData): string => {
  const token = jwt.sign(
    {
      data: reduce(
        user,
        (result: any, value: string, key: string) => {
          if (key !== "password") {
            result[key] = value;
          }
          return result;
        },
        {}
      ),
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: process.env.JWT_MAX_AGE,
      algorithm: "HS256",
    }
  );

  return token;
};
