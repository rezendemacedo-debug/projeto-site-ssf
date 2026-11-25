import "server-only";
import { db } from "./db/client";
import { CatalogRepository } from "./repositories/catalog-repository";
import { MessageRepository } from "./repositories/message-repository";
import { SavedLessonRepository } from "./repositories/saved-lesson-repository";
import { SefariaClient } from "./repositories/sefaria-client";
import { SessionRepository } from "./repositories/session-repository";
import { TranslationRepository } from "./repositories/translation-repository";
import { UserRepository } from "./repositories/user-repository";
import { AuthService } from "./services/auth-service";
import { HebrewCalendarService } from "./services/hebrew-calendar-service";
import { LessonService } from "./services/lesson-service";
import { LibraryService } from "./services/library-service";
import { PasswordHasher } from "./services/password-hasher";
import { RateLimiter } from "./services/rate-limiter";

/** Ponto único de composição das dependências do servidor. */
export const userRepository = new UserRepository(db);
export const messageRepository = new MessageRepository(db);
export const savedLessonRepository = new SavedLessonRepository(db);
export const authService = new AuthService(userRepository, new SessionRepository(db), new PasswordHasher());
export const lessonService = new LessonService(new CatalogRepository());
export const calendarService = new HebrewCalendarService();
export const rateLimiter = new RateLimiter(db);
export const libraryService = new LibraryService(new SefariaClient(), new TranslationRepository());
