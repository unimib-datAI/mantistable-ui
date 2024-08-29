import {
  Annotations,
  Table,
  Cell,
  ProcessableTable,
  ColumnAnnotation,
} from "~/utils/types/tables";
import * as CSV from "csv-string";

export const updateAnnotations = async (
  annotations: Annotations,
  prevTable: Table,
): Promise<Table> => {
  // build header hashmap
  let headerHashMap = new Map<string, string>();
  annotations.data.semanticAnnotations.cta.map((ctaAnnotation) => {
    const [ctaType] = ctaAnnotation.types;
    if (ctaType == undefined) throw new Error("Error on header dict build");
    headerHashMap.set(String(ctaAnnotation.idColumn), ctaType.id);
  });

  let headersTexts: string[] = [];
  const headers = new Map<string, Cell>();
  for (let i = 0; i < annotations.data.header.length; i++) {
    const headerText = annotations.data.header[i];
    if (headerText == undefined) throw new Error("Error on header parsing");
    const key = String(i);
    const prevCol = prevTable.header[headerText];
    if (prevCol == undefined) throw new Error("Previous column does not exist");
    if (headerHashMap.has(key)) {
      headers.set(headerText, {
        text: headerText,
        annotation: headerHashMap.get(key),
        type: prevCol.type,
      });
    } else {
      headers.set(headerText, {
        text: headerText,
        type: prevCol.type,
      });
    }
    headersTexts.push(headerText);
  }

  // build rows hashmap
  let rowsHashMap = new Map<string, string>();
  annotations.data.semanticAnnotations.cea.map((ceaAnnotation) => {
    if (ceaAnnotation.entities.length > 0) {
      const [ceaEntity] = ceaAnnotation.entities;
      if (ceaEntity == undefined) throw new Error("Error on rows dict build");
      rowsHashMap.set(
        `${ceaAnnotation.idRow - 1}_${ceaAnnotation.idColumn}`,
        ceaEntity.id,
      );
    }
  });

  var rows: { [id: string]: Cell }[] = [];
  for (let rowIndex = 0; rowIndex < annotations.data.rows.length; rowIndex++) {
    const currentRow = annotations.data.rows[rowIndex];
    if (currentRow == undefined) throw new Error("Error on rows parsing");
    var currentRowDict: { [id: string]: Cell } = {};
    for (let colIndex = 0; colIndex < currentRow.data.length; colIndex++) {
      const currentCell = currentRow.data[colIndex];
      if (currentCell == undefined)
        throw new Error("Error on rows when unpacking cells");
      const currentHeaderCol = headersTexts[colIndex];
      if (currentHeaderCol == undefined)
        throw new Error("Error on rows when unpacking cell headers");
      if (rowsHashMap.has(`${rowIndex}_${colIndex}`)) {
        currentRowDict[currentHeaderCol] = {
          text: currentCell,
          annotation: rowsHashMap.get(`${rowIndex}_${colIndex}`),
        };
      } else {
        currentRowDict[currentHeaderCol] = { text: currentCell };
      }
    }
    rows.push(currentRowDict);
  }

  const finalTable: Table = {
    header: Object.fromEntries(headers.entries()),
    rows: rows,
  };

  return finalTable;
};

export const transformAddTable = (
  annotatedTable: ProcessableTable,
  columnID: number,
  newColumn: string[],
) => {
  const columnName = annotatedTable.header[columnID] ?? "transformed column";
  annotatedTable.header.push(`${columnName}*`);
  annotatedTable.rows.map((row, index) => {
    const currentNewValue = newColumn[index] ?? "UNDEFINED";
    row.data.push(currentNewValue);
  });

  return annotatedTable;
};

export const transformReplaceTable = (
  annotatedTable: ProcessableTable,
  columnID: number,
  newColumn: string[],
) => {
  annotatedTable.rows.map((row, index) => {
    const currentNewValue = newColumn[index] ?? "UNDEFINED";
    row.data[columnID] = currentNewValue;
  });

  return annotatedTable;
};

export const transformJSONTableAdd = (
  table: Table,
  columnName: string,
  newColumn: string[],
  transform: string,
) => {
  const updatePreviousColumn = table.header[columnName];
  if (updatePreviousColumn == undefined) return;

  table.header[`${columnName}*`] = {
    text: columnName,
    transform: transform,
    type: updatePreviousColumn.type,
  };

  updatePreviousColumn.hasTransformed = true;
  table.rows.map((row, index) => {
    const newValue = newColumn[index] ?? "UNDEFINED";
    row[`${columnName}*`] = {
      text: newValue,
      transform: transform,
      type: updatePreviousColumn.type,
    };
  });

  return table;
};

export const transformJSONTableReplace = (
  table: Table,
  columnName: string,
  newColumn: string[],
  transform: string,
) => {
  const currentColumn = table.header[columnName];
  if (currentColumn == undefined) return;
  currentColumn.transform = transform;
  table.rows.map((row, index) => {
    const newValue = newColumn[index] ?? "UNDEFINED";
    const currentCell = row[columnName];
    if (currentCell == undefined) return;
    currentCell.text = newValue;
    currentCell.transform = transform;
  });

  return table;
};

export const getColumns = async (table: string) => {
  const arr = CSV.parse(table);
  let colsHashMap = new Map<string, string[]>();

  const [header, ...data] = arr;
  if (header == undefined) throw new Error("Header is undefined");

  data.map((row) => {
    row.map((cell, index) => {
      const currentCol = header[index];
      if (currentCol == undefined)
        throw new Error("Current column does not exist");
      if (colsHashMap.has(currentCol)) {
        let arr = colsHashMap.get(currentCol);
        if (arr == undefined) throw new Error("Current column does not exist");
        arr.push(cell);
        colsHashMap.set(currentCol, arr);
      } else {
        colsHashMap.set(currentCol, [cell]);
      }
    });
  });
  return Object.fromEntries(colsHashMap.entries());
};

export const updateColumns = async (
  table: Table,
  columnAnnotation: ColumnAnnotation,
) => {
  columnAnnotation.map((column) => {
    const currentCol = table.header[column.column];
    if (currentCol == undefined)
      throw new Error("Current column does not exist");
    currentCol.type = column.category;
  });
  return table;
};
