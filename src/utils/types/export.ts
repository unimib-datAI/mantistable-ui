export type Plugin = {
  name: string;
  configurations: {
    type: string;
    output: string;
    entry_file: string;
    name: string;
    description: string;
    column_type?: string;
  };
  paths: {
    base_path: string;
    mainfile: string;
    outputfile: string;
  };
};

export type Plugins = {
  plugins: Plugin[];
};

export type Transform = {
  original_column: string[];
  new_column: string[];
};
