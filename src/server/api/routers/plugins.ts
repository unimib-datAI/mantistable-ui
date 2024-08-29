import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Plugins, Transform } from "~/utils/types/export";
import { env } from "~/env";

export const pluginsRouter = createTRPCRouter({
  // get endpoints
  getPlugins: publicProcedure
    .input(z.enum(["ALL", "ADDONS", "EXPORTS", "TRANSFORM"]))
    .query(async ({ input }) => {
      // use try catch to handle exception if something goes wrong with DB
      const service =
        input == "ALL"
          ? `${env.PLUGINS_HOST}/plugins`
          : input == "ADDONS"
            ? `${env.PLUGINS_HOST}/plugin_addon`
            : input == "EXPORTS"
              ? `${env.PLUGINS_HOST}/plugin_exports`
              : `${env.PLUGINS_HOST}/plugin_transform`;
      try {
        const response = await fetch(service, {
          method: "GET",
        });
        const plugins = (await response.json()) as Plugins;
        return plugins;
      } catch (e) {
        // return Error
        throw new Error("Error on Retrieving Plugins");
      }
    }),
  deletePlugins: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await fetch(
          `${env.PLUGINS_HOST}/delete_plugin?plugin=${input}`,
          {
            method: "DELETE",
          },
        );
      } catch (e) {
        // return Error
        throw new Error("Error on Retrieving Plugins");
      }
    }),
  runTransform: publicProcedure
    .input(
      z.object({
        transformPlugin: z.string(),
        tableId: z.number(),
        columnID: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const plugin = input.transformPlugin;
      const tableId = input.tableId;
      const columnTitle = input.columnID;
      const response = await fetch(
        `${env.PLUGINS_HOST}/transform/${plugin}/${tableId}/${columnTitle}`,
        { method: "GET" },
      );
      const columns = (await response.json()) as Transform;
      return columns;
    }),
});
