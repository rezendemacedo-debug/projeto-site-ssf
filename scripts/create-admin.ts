import { db } from "../src/server/db/client";
import { SessionRepository } from "../src/server/repositories/session-repository";
import { UserRepository } from "../src/server/repositories/user-repository";
import { AuthService } from "../src/server/services/auth-service";
import { PasswordHasher } from "../src/server/services/password-hasher";

const { ADMIN_NAME: name, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
if (!name || !email || !password || password.length < 10) {
  console.error("Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD (10+ caracteres).");
  process.exit(1);
}
const auth = new AuthService(new UserRepository(db), new SessionRepository(db), new PasswordHasher());
const created = await auth.register({ name, email: email.trim().toLowerCase(), password, city: "", motivation: "" }, { role: "admin", status: "active" });
console.log(created ? "Administrador criado." : "Já existe uma conta com esse e-mail.");
