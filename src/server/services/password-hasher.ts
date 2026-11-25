import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const PARAMS = { N: 2 ** 15, r: 8, p: 3, maxmem: 128 * 1024 * 1024 };
const KEY_LENGTH = 32;

export class PasswordHasher {
  async hash(password: string) {
    const salt = randomBytes(16);
    return `${salt.toString("base64")}:${(await derive(password, salt)).toString("base64")}`;
  }

  async verify(password: string, stored: string) {
    const [salt, key] = stored.split(":").map((p) => Buffer.from(p, "base64"));
    if (!salt || !key || key.length !== KEY_LENGTH) return false;
    return timingSafeEqual(await derive(password, salt), key);
  }
}

function derive(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, PARAMS, (err, key) => (err ? reject(err) : resolve(key))),
  );
}
