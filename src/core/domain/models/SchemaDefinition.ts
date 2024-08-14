export type SchemaDefinition = {
  tables: string[];
  mappings: Record<string, { name: string; type: string }[]>;
};
