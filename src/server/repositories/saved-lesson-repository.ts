import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { type SavedKind, savedLessons } from "../db/schema";

export class SavedLessonRepository {
  constructor(private readonly db: Database) {}

  listByUser(userId: string) {
    return this.db
      .select({ lessonId: savedLessons.lessonId, kind: savedLessons.kind })
      .from(savedLessons)
      .where(eq(savedLessons.userId, userId))
      .orderBy(desc(savedLessons.createdAt));
  }

  /** Alterna a marcação da aula. */
  async toggle(userId: string, lessonId: string, kind: SavedKind) {
    const removed = await this.db
      .delete(savedLessons)
      .where(and(eq(savedLessons.userId, userId), eq(savedLessons.lessonId, lessonId), eq(savedLessons.kind, kind)))
      .returning();
    if (removed.length === 0) {
      await this.db.insert(savedLessons).values({ userId, lessonId, kind, createdAt: new Date() }).onConflictDoNothing();
    }
  }
}
