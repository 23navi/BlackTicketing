import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const hash = (await promisify(scrypt)(password, salt, 64)) as Buffer;
    return `${hash.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await promisify(scrypt)(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  }
}
