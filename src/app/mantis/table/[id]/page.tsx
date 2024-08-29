"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Error } from "~/app/components/error/error";
import { TablePanel } from "~/app/components/headers/tablePanel";
import { TableAnnotated } from "~/app/components/tables/annotatedTable/annotatedTable";
import HeaderCell from "~/app/components/tables/cells/annotatedTable/headerCell";
import CustomTableCell from "~/app/components/tables/cells/annotatedTable/tableCell";
import Loader from "~/app/components/ui/loader";
import { api } from "~/trpc/react";
import { Cell, Table, Annotations } from "~/utils/types/tables";
import { AnnotationCPA } from "~/utils/types/tables";

export default function AnnotatedTable({ params }: { params: { id: string } }) {
  const getTable = api.tables.getTable.useQuery(Number(params.id));

  if (getTable.isSuccess && getTable.data != undefined) {
    const data = getTable.data.jsonTable as Table;
    let cpa: AnnotationCPA[] = [];
    if (getTable.data.status == "DONE") {
      cpa = (getTable.data.processableJsonResponseTable as Annotations).data
        .semanticAnnotations.cpa;
    }
    const colsDef = data.header;
    const columns: ColumnDef<{ [id: string]: Cell }>[] = Object.keys(
      colsDef,
    ).map((key, index) => {
      return {
        accessorKey: key,
        header: () => (
          <HeaderCell
            tableID={getTable.data.id}
            tableColumnID={index}
            title={colsDef[key]?.text.toUpperCase() ?? "Undefined Col"}
            annotation={colsDef[key]?.annotation}
            transform={colsDef[key]?.transform}
            hasTransformed={colsDef[key]?.hasTransformed}
            columnType={colsDef[key]?.type}
          />
        ),
        cell: (info) => {
          const data = info.getValue() as Cell;
          return (
            <CustomTableCell
              text={data.text}
              annotation={data.annotation}
              transform={data.transform}
            />
          );
        },
      };
    });

    return (
      <div className="flex h-full flex-col bg-mantis-white-300">
        <TablePanel tableID={Number(params.id)} status={getTable.data.status} />
        <TableAnnotated
          cpa={cpa}
          status={getTable.data.status}
          columns={columns}
          data={data.rows}
          tableName={getTable.data.tableName}
        />
      </div>
    );
  }

  if (getTable.isError) {
    return (
      <Error
        errorTitle="Error Message"
        errorDescription="An error occured. Try to refresh the page!."
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-mantis-white-300 p-8">
      <Loader />
    </div>
  );
}
