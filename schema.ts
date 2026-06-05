import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Facebook session storage for authenticated users.
 * Stores encrypted cookies/tokens to enable server-side automation.
 */
export const facebookSessions = mysqlTable("facebook_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Encrypted cookies/session token (stored as JSON string) */
  encryptedCredentials: text("encryptedCredentials").notNull(),
  /** Facebook account name/identifier for display */
  accountName: varchar("accountName", { length: 255 }),
  /** Whether this session is currently active */
  isActive: int("isActive").default(1).notNull(),
  lastVerified: timestamp("lastVerified").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FacebookSession = typeof facebookSessions.$inferSelect;
export type InsertFacebookSession = typeof facebookSessions.$inferInsert;

/**
 * Sharing tasks created by users.
 * Tracks content source, target groups, and distribution settings.
 */
export const sharingTasks = mysqlTable("sharing_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  facebookSessionId: int("facebookSessionId").notNull().references(() => facebookSessions.id, { onDelete: "cascade" }),
  /** URL of the Facebook page or content source */
  sourcePageUrl: varchar("sourcePageUrl", { length: 2048 }).notNull(),
  /** JSON array of target group URLs */
  targetGroupUrls: text("targetGroupUrls").notNull(),
  /** Number of times to distribute the content */
  distributionCount: int("distributionCount").default(1).notNull(),
  /** Task status: pending, running, success, failed */
  status: mysqlEnum("status", ["pending", "running", "success", "failed"]).default("pending").notNull(),
  /** Error message if task failed */
  errorMessage: text("errorMessage"),
  /** Number of successful distributions */
  successCount: int("successCount").default(0).notNull(),
  /** Number of failed distributions */
  failureCount: int("failureCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SharingTask = typeof sharingTasks.$inferSelect;
export type InsertSharingTask = typeof sharingTasks.$inferInsert;

/**
 * Scheduled task execution times.
 * Supports multiple time slots per day for recurring automation.
 */
export const schedules = mysqlTable("schedules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sharingTaskId: int("sharingTaskId").notNull().references(() => sharingTasks.id, { onDelete: "cascade" }),
  /** Time in HH:MM format (24-hour) */
  executionTime: varchar("executionTime", { length: 5 }).notNull(),
  /** Days of week: 0=Sunday, 1=Monday, ..., 6=Saturday (JSON array) */
  daysOfWeek: varchar("daysOfWeek", { length: 50 }).default("[0,1,2,3,4,5,6]").notNull(),
  /** Whether this schedule is enabled */
  isEnabled: int("isEnabled").default(1).notNull(),
  /** Last execution timestamp */
  lastExecuted: timestamp("lastExecuted"),
  /** Next scheduled execution timestamp */
  nextExecution: timestamp("nextExecution"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;

/**
 * Activity log for tracking all task executions and system events.
 */
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sharingTaskId: int("sharingTaskId").references(() => sharingTasks.id, { onDelete: "set null" }),
  /** Log type: task_created, task_executed, task_failed, schedule_triggered, etc. */
  logType: varchar("logType", { length: 50 }).notNull(),
  /** Human-readable message */
  message: text("message").notNull(),
  /** Status: pending, running, success, failed */
  status: mysqlEnum("status", ["pending", "running", "success", "failed"]).notNull(),
  /** Additional metadata as JSON */
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
