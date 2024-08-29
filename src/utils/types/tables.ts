// Home page table type for managing tables
export type HomePageTable = {
  tableID: number;
  tableName: string;
  tableDescription: string;
  insertDate: string;
  status: "TODO" | "DOING" | "DONE";
  lastEdit: string;
};

// ----------------------------------------

// cell type for csv tables
export type Cell = {
  text: string;
  type?: string;
  annotation?: string;
  transform?: string;
  hasTransformed?: boolean;
};

// row type for csv tables
export type Row = { [id: string]: Cell };

// table type for csv tables
export type Table = {
  header: Row;
  rows: Row[];
};

// --------------------------------------

// column annotation
export type ColumnAnnotation = {
  column: string;
  category: string;
}[];

// ----------------------------------------
// Type for processable table template
export type ProcessableRow = {
  idRow: number;
  data: string[];
};

export type ProcessableTable = {
  datasetName: string;
  tableName: string;
  header: string[];
  rows: ProcessableRow[];
  kgReference: string;
};

// ---------------------------------------

// Type for annotations
export type AnnotationCEA = {
  idColumn: number;
  idRow: number;
  entities: {
    id: string;
    name: string;
    description: string;
    match: boolean;
    score: number;
    features: {
      id: string;
      value: number;
    }[];
    types: {
      id: string;
      name: string;
    }[];
  }[];
};

export type AnnotationCTA = {
  idColumn: number;
  types: {
    id: string;
    name: string;
    score: number;
  }[];
};

export type AnnotationCPA = {
  idSourceColumn: string;
  idTargetColumn: string;
  predicates: {
    id: string;
    name: string;
    score: number;
  }[];
};

export type ColumnMetadata = {
  idColumn: number;
  tag: string;
};

export type Annotations = {
  data: {
    datasetName: string;
    tableName: string;
    header: string[];
    rows: ProcessableRow[];
    semanticAnnotations: {
      cea: AnnotationCEA[];
      cta: AnnotationCTA[];
      cpa: AnnotationCPA[];
    };
    metadata: {
      column: ColumnMetadata[];
    };
    status: "TODO" | "DOING" | "DONE";
    nrows: number;
  };
};
