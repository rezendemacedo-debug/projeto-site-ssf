import "server-only";
import { db } from "./db/client";
import { CatalogRepository } from "./repositories/catalog-repository";
import { EmailCodeRepository } from "./repositories/email-code-repository";
import { MessageRepository } from "./repositories/message-repository";
import { SavedLessonRepository } from "./repositories/saved-lesson-repository";
import { SefariaClient } from "./repositories/sefaria-client";
import { SessionRepository } from "./repositories/session-repository";
import { TranslationRepository } from "./repositories/translation-repository";
import { UserRepository } from "./repositories/user-repository";
import { AuthService } from "./services/auth-service";
import { LessonService } from "./services/lesson-service";
import { LibraryService } from "./services/library-service";
import { ConsoleMailer, type Mailer, ResendMailer, UnconfiguredMailer } from "./services/mailer";
import { MemberSignupService } from "./services/member-signup-service";
import { PasswordHasher } from "./services/password-hasher";
import { RateLimiter } from "./services/rate-limiter";

function createMailer(): Mailer {
  const { RESEND_API_KEY: key, MAIL_FROM: from } = process.env;
  if (key && from) return new ResendMailer(key, from);
  return process.env.NODE_ENV === "production" ? new UnconfiguredMailer() : new ConsoleMailer();
}

/** Ponto único de composição das dependências do servidor. */
export const userRepository = new UserRepository(db);
const passwordHasher = new PasswordHasher();
export const messageRepository = new MessageRepository(db);
export const savedLessonRepository = new SavedLessonRepository(db);
export const authService = new AuthService(userRepository, new SessionRepository(db), passwordHasher);
export const memberSignupService = new MemberSignupService(userRepository, new EmailCodeRepository(db), passwordHasher, createMailer(), process.env.SITE_URL ?? "http://localhost:3000");
export const lessonService = new LessonService(new CatalogRepository());
export const rateLimiter = new RateLimiter(db);
export const libraryService = new LibraryService(new SefariaClient(), new TranslationRepository());
export { calendarService } from "./services/hebrew-calendar-service";
