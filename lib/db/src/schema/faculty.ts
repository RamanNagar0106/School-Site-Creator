import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const facultyTable = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  qualification: text("qualification").notNull(),
  experience: text("experience").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  designation: text("designation").notNull().default("Teacher"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFacultySchema = createInsertSchema(facultyTable).omit({ id: true, createdAt: true });
export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type Faculty = typeof facultyTable.$inferSelect;
