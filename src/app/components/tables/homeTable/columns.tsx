"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/app/components/ui/button";
import { HomePageTable } from "~/utils/types/tables";
import { Badge } from "~/app/components/ui/badge";
import { HomeTableHeaderCell } from "~/app/components/tables/cells/homeTable/homeTableHeaderCell";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "~/app/components/ui/select";

export const columns: ColumnDef<HomePageTable>[] = [
  {
    accessorKey: "tableID",
    header: () => <HomeTableHeaderCell text="Table ID" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "tableName",
    header: () => <HomeTableHeaderCell text="Name" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "tableDescription",
    header: () => <HomeTableHeaderCell text="Description" />,
    cell: (info) => {
      const data = info.getValue() as string;
      return <span className="text-mantis-gray-200">{data}</span>;
    },
  },
  {
    accessorKey: "insertDate",
    header: () => <HomeTableHeaderCell text="Insert Date" />,
    cell: (info) => {
      const data = info.getValue() as string;
      return <span className="text-mantis-gray-200">{data}</span>;
    },
  },
  {
    accessorKey: "lastEdit",
    header: () => <HomeTableHeaderCell text="Last Edit" />,
    cell: (info) => {
      const data = info.getValue() as string;
      return <span className="text-mantis-gray-200">{data}</span>;
    },
  },
  {
    accessorKey: "status",
    header: () => <HomeTableHeaderCell text="Status" />,
    cell: (info) => {
      const data = info.getValue() as "TODO" | "DOING" | "DONE";
      var badgeVariant: "todo" | "doing" | "done" = "todo";
      if (data == "DOING") badgeVariant = "doing";
      if (data == "DONE") badgeVariant = "done";
      return <Badge variant={badgeVariant}>{data}</Badge>;
    },
  },
  {
    id: "action",
    header: () => (
      <HomeTableHeaderCell
        className="flex items-center justify-center"
        text="Actions"
      />
    ),
    cell: (props) => {
      const { row } = props;
      return (
        <div className="flex items-center justify-center">
          <Link href={`/mantis/table/${row.original.tableID}`}>
            <Button className="bg-mantis-gray-300 text-mantis-black-200 hover:bg-mantis-gray-200">
              View & Process
            </Button>
          </Link>
        </div>
      );
    },
  },
];
