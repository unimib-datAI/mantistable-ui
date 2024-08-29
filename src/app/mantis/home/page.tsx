"use client";

import Statistics from "~/app/components/statistics/statistics";
import { columns } from "~/app/components/tables/homeTable/columns";
import { HomeTable } from "~/app/components/tables/homeTable/homeTable";
import { api } from "~/trpc/react";
import Loader from "~/app/components/ui/loader";
import { Error } from "~/app/components/error/error";
import { Title } from "~/app/components/title";

export default function Home() {
  const getTables = api.tables.getTables.useQuery();

  return (
    <div className="flex h-full flex-col gap-4 bg-mantis-white-300 p-8">
      {/* Title */}
      <Title title="All Tables" />
      {/* Loader for data fetching */}
      {getTables.isLoading && (
        <div className="flex flex-col items-center justify-center">
          <Loader />
        </div>
      )}
      {/* Main Block:
        - Statistics of tables
        - Table with tables loaded and processed
       */}
      {getTables.isSuccess && (
        <>
          {/* Statistics of tables */}
          <div className="flex">
            <Statistics
              stats={[{ text: "Total Tables", value: getTables.data.length }]}
            />
          </div>
          {/* Table with tables loaded and processed */}
          <div>
            <HomeTable columns={columns} data={getTables.data} />
          </div>
        </>
      )}
      {/* Rendering Error */}
      {getTables.isError && (
        <Error
          errorTitle="Error Message"
          errorDescription="An error occured. Try to refresh the page!."
        />
      )}
    </div>
  );
}
