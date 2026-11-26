import { createHash, randomBytes } from "node:crypto";
import type { User } from "../db/schema";
import type { SessionRepository } from "../repositories/session-repository";
import type { UserRepository } from "../repositories/user-repository";
import type { PasswordHasher } from "./password-hasher";

export const SESSION_DAYS = 30;

export type LoginResult = { ok: true; token: string; expiresAt: Date } | { ok: false; reason: "invalid" | "pending" | "blocked" };
export type SessionUser = Omit<User, "passwordHash">;

export class AuthService {
  /** Comparado quando o e-mail não existe, para o tempo de resposta não revelar contas. */
  private dummyHash?: Promise<string>;

  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  /** Cadastros novos ficam pendentes até aprovação da administração. */
  async register(data: { name: string; email: string; password: string; city: string; motivation: string }, overrides: Partial<Pick<User, "role" | "status" | "emailVerifiedAt">> = {}) {
    const { password, ...rest } = data;
    return this.users.create({
      ...rest,
      id: crypto.randomUUID(),
      passwordHash: await this.hasher.hash(password),
      role: "member",
      status: "pending",
      createdAt: new Date(),
      ...overrides,
    });
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.users.findByEmail(email);
    this.dummyHash ??= this.hasher.hash("conta inexistente");
    const valid = await this.hasher.verify(password, user?.passwordHash ?? (await this.dummyHash));
    if (!user || !valid) return { ok: false, reason: "invalid" };
    if (user.status !== "active") return { ok: false, reason: user.status };

    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
    await this.sessions.create(digest(token), user.id, expiresAt);
    return { ok: true, token, expiresAt };
  }

  async authenticate(token: string): Promise<SessionUser | null> {
    const found = await this.sessions.find(digest(token));
    if (!found || found.expiresAt <= new Date() || found.user.status !== "active") return null;
    const { passwordHash: _hash, ...user } = found.user;
    return user;
  }

  logout(token: string) {
    return this.sessions.delete(digest(token));
  }
}

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
