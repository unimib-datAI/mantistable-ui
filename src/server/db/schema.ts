// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  pgTableCreator,
  serial,
  json,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mantistable_${name}`);

export const statusEnum = pgEnum("status", ["TODO", "DOING", "DONE"]);

export const tables = createTable("tables", {
  id: serial("id").primaryKey().notNull(),
  tableName: varchar("tableName", { length: 256 }).notNull(),
  tableDescription: varchar("tableDescription", { length: 256 }).notNull(),
  jsonTable: json("jsonTables").notNull(),
  csvTable: varchar("csvTable").notNull(),
  processableJsonTable: json("processableJsonTable").notNull(),
  processableJsonResponseTable: json("processableJsonResponseTable").notNull(),
  insertDate: varchar("insertDate").notNull(),
  lastEdit: varchar("lastEdit").notNull(),
  status: statusEnum("status").notNull(),
  exportStatus: statusEnum("exportStatus").notNull(),
});
export const InserTableSchemaZod = createInsertSchema(tables);
export type InsertTableSchema = z.infer<typeof InserTableSchemaZod>;
export const SelectTableSchemaZod = createSelectSchema(tables);
export type SelectTableSchema = z.infer<typeof SelectTableSchemaZod>;
