import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// IMPORTANT: SQLite doesn't auto-generate UUIDs!
// When inserting records, use nanoid() to generate IDs:
//   import { nanoid } from "nanoid";
//   await db.insert(users).values({ id: nanoid(), name: "John", email: "john@example.com" });

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Use nanoid() when inserting
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
