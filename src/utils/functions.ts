import * as CSV from "csv-string";
import {
  Table,
  Cell,
  ProcessableRow,
  ProcessableTable,
} from "~/utils/types/tables";

export const parseCSVTable = async (table: string) => {
  const arr = CSV.parse(table);
  // assume that header is the first row
  const [header, ...data] = arr;
  if (header == undefined) throw new Error("Header is undefined");

  const convertedRows: { [id: string]: Cell }[] = data.map((row) => {
    var currentRow: { [id: string]: Cell } = {};
    row.map((cell, index) => {
      const currentCol = header[index];
      if (currentCol == undefined) throw new Error("Undefined Column");
      currentRow[currentCol] = { text: cell };
    });
    return currentRow;
  });

  var currentHeader: { [id: string]: Cell } = {};
  header.map((headerCell) => {
    currentHeader[headerCell] = { text: headerCell };
    return currentHeader;
  });

  const finalTable: Table = {
    header: currentHeader,
    rows: convertedRows,
  };

  return finalTable;
};

export const processableJSONTable = async (table: string) => {
  const arr = CSV.parse(table);
  const [header, ...data] = arr;
  if (header == undefined) throw new Error("Header is undefined");

  const rows: ProcessableRow[] = data.map((row, index) => {
    return {
      idRow: index + 1,
      data: row.map((cell) => cell),
    };
  });

  const processableTable: ProcessableTable = {
    datasetName: "mantisTables",
    tableName: "",
    header: header.map((headerCell) => headerCell),
    rows: rows,
    kgReference: "wikidata",
  };

  return processableTable;
};
