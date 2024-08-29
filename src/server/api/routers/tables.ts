import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  InserTableSchemaZod,
  SelectTableSchema,
  tables,
} from "~/server/db/schema";
import {
  updateAnnotations,
  transformAddTable,
  transformJSONTableAdd,
  transformReplaceTable,
  transformJSONTableReplace,
  getColumns,
  updateColumns,
} from "~/server/utils";
import {
  Annotations,
  HomePageTable,
  ProcessableTable,
} from "~/utils/types/tables";
import { Table } from "~/utils/types/tables";
import { env } from "~/env";

export const tablesRouter = createTRPCRouter({
  // insert table in DB
  create: publicProcedure
    .input(InserTableSchemaZod)
    .mutation(async ({ ctx, input }) => {
      const columns = await getColumns(input.csvTable);
      const response = await fetch(`${env.PLUGINS_HOST}/column_analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columns: columns,
        }),
      });
      const annotatedColumns = await response.json();
      const jsonTable = input.jsonTable as Table;
      const finalJsonTable = await updateColumns(jsonTable, annotatedColumns);
      // use try catch to handle exception if something goes wrong with DB
      try {
        await ctx.db.insert(tables).values({
          tableName: input.tableName,
          tableDescription: input.tableDescription,
          insertDate: input.insertDate,
          lastEdit: input.lastEdit,
          csvTable: input.csvTable,
          jsonTable: finalJsonTable,
          processableJsonResponseTable: input.processableJsonResponseTable,
          processableJsonTable: input.processableJsonTable,
          status: input.status,
          exportStatus: input.exportStatus,
        });
      } catch (e) {
        // return Error
        throw new Error("Error on Inserting Data");
      }
    }),
  // get all tables from DB
  getTables: publicProcedure.query(
    async ({ ctx }): Promise<HomePageTable[]> => {
      try {
        const allTables = await ctx.db
          .select({
            tableID: tables.id,
            tableName: tables.tableName,
            tableDescription: tables.tableDescription,
            insertDate: tables.insertDate,
            status: tables.status,
            lastEdit: tables.insertDate,
          })
          .from(tables);
        // return Tables from DB
        return allTables;
      } catch (e) {
        // return Error
        throw new Error("Error on Retrieving Data");
      }
    },
  ),
  getTable: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }): Promise<SelectTableSchema> => {
      var table;
      try {
        table = await ctx.db.query.tables.findFirst({
          where: eq(tables.id, input),
        });
      } catch (e) {
        throw new Error("DB is Unreachable");
      }

      if (table == undefined) {
        throw new Error("Multiple Tables found");
      }

      if (table.status == "DOING") {
        const annotatedTable = await fetch(
          `${process.env.STI_HOST}/dataset/mantisTables/table/${input}?token=selBat_demo_2023`,
          {
            method: "GET",
          },
        );
        if (!annotatedTable.ok) {
          throw new Error("Error from backend");
        }

        const responseAnnotatedTable =
          (await annotatedTable.json()) as Annotations;

        if (responseAnnotatedTable.data.status != "DONE")
          return table as SelectTableSchema;

        let tableUpdated;
        try {
          tableUpdated = await updateAnnotations(
            responseAnnotatedTable,
            table.jsonTable as Table,
          );
        } catch (e) {
          throw new Error("Error on parsing response");
        }

        try {
          await ctx.db
            .update(tables)
            .set({
              jsonTable: tableUpdated,
              processableJsonResponseTable: responseAnnotatedTable,
              status: "DONE",
            })
            .where(eq(tables.id, input))
            .returning({
              id: tables.id,
              tableName: tables.tableName,
              tableDescription: tables.tableDescription,
              jsonTable: tables.jsonTable,
              csvTable: tables.csvTable,
              processableJsonTable: tables.processableJsonTable,
              insertDate: tables.insertDate,
              lastEdit: tables.lastEdit,
              exportStatus: tables.exportStatus,
            });
        } catch (e) {
          throw new Error("DB is Unreachable");
        }
      }

      return table as SelectTableSchema;
    }),

  annotate: publicProcedure
    .input(z.number())
    .mutation(
      async ({ ctx, input }): Promise<{ error: boolean } | undefined> => {
        const tablesList = await ctx.db
          .select({
            processableTable: tables.processableJsonTable,
          })
          .from(tables)
          .where(eq(tables.id, input));

        if (tablesList.length != 1) return { error: true };

        const [table, ...other] = tablesList;
        if (table == undefined) return { error: true };
        const tableToSend = table.processableTable as ProcessableTable;
        tableToSend.tableName = String(input);
        const response = await fetch(
          `${process.env.STI_HOST_UPLOAD_AND_PROCESS}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([tableToSend]),
          },
        );
        if (!response.ok) return { error: true };
        await ctx.db
          .update(tables)
          .set({ status: "DOING" })
          .where(eq(tables.id, input));

        return { error: false };
      },
    ),
  transformAddColumn: publicProcedure
    .input(
      z.object({
        transform: z.string(),
        tableID: z.number(),
        columnID: z.number(),
        newColumn: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      var currentTable;
      try {
        currentTable = await ctx.db
          .select({
            jsonTable: tables.jsonTable,
            processableTable: tables.processableJsonTable,
            status: tables.status,
          })
          .from(tables)
          .where(eq(tables.id, input.tableID));
      } catch (e) {
        // return Error
        throw new Error("Error on Handling Table for Transform");
      }
      // return Tables from DB
      const [table, ...other] = currentTable;
      if (table == undefined) throw new Error("Table not found");
      const tableToSend = table.processableTable as ProcessableTable;
      const column = tableToSend.header[input.columnID] ?? "undefined";
      const updatedProcessableTable = transformAddTable(
        tableToSend,
        input.columnID,
        input.newColumn,
      );
      const currentTableToShow = table.jsonTable as Table;
      const updatedTable = transformJSONTableAdd(
        currentTableToShow,
        column,
        input.newColumn,
        input.transform,
      );
      try {
        await ctx.db
          .update(tables)
          .set({
            jsonTable: updatedTable,
            processableJsonTable: updatedProcessableTable,
          })
          .where(eq(tables.id, input.tableID))
          .returning({
            id: tables.id,
            tableName: tables.tableName,
            tableDescription: tables.tableDescription,
            jsonTable: tables.jsonTable,
            csvTable: tables.csvTable,
            processableJsonTable: tables.processableJsonTable,
            insertDate: tables.insertDate,
            lastEdit: tables.lastEdit,
            exportStatus: tables.exportStatus,
          });
      } catch (e) {
        throw new Error("DB is Unreachable");
      }
    }),
  transformReplaceColumn: publicProcedure
    .input(
      z.object({
        transform: z.string(),
        tableID: z.number(),
        columnID: z.number(),
        newColumn: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      var currentTable;
      try {
        currentTable = await ctx.db
          .select({
            jsonTable: tables.jsonTable,
            processableTable: tables.processableJsonTable,
            status: tables.status,
          })
          .from(tables)
          .where(eq(tables.id, input.tableID));
      } catch (e) {
        // return Error
        throw new Error("Error on Handling Table for Transform");
      }
      // return Tables from DB
      const [table, ...other] = currentTable;
      if (table == undefined) return { error: true };
      const tableToSend = table.processableTable as ProcessableTable;
      const column = tableToSend.header[input.columnID] ?? "undefined";

      const updatedProcessableTable = transformReplaceTable(
        tableToSend,
        input.columnID,
        input.newColumn,
      );
      const currentTableToShow = table.jsonTable as Table;
      const updatedTable = transformJSONTableReplace(
        currentTableToShow,
        column,
        input.newColumn,
        input.transform,
      );
      try {
        await ctx.db
          .update(tables)
          .set({
            jsonTable: updatedTable,
            processableJsonTable: updatedProcessableTable,
          })
          .where(eq(tables.id, input.tableID))
          .returning({
            id: tables.id,
            tableName: tables.tableName,
            tableDescription: tables.tableDescription,
            jsonTable: tables.jsonTable,
            csvTable: tables.csvTable,
            processableJsonTable: tables.processableJsonTable,
            insertDate: tables.insertDate,
            lastEdit: tables.lastEdit,
            exportStatus: tables.exportStatus,
          });
      } catch (e) {
        throw new Error("DB is Unreachable");
      }
    }),
});
