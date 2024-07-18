import { SchemaDefinition } from "../models/SchemaDefinition";

export class SchemaParser {
  parse = (schema: string, useMapping: boolean): SchemaDefinition => {
    const tablePattern = /model\s+(\w+)\s+{([^}]+)}/g;
    const mapPattern = /@map\("([^"]+)"\)/;
    const tables: string[] = [];
    const mappings: Record<string, string[]> = {};

    let match;
    while ((match = tablePattern.exec(schema)) !== null) {
      const tableName = match[1];
      const fields = match[2]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("//"))
        .map((line) => {
          const fieldMatch = line.match(/^(\w+)\s+\w+/);
          const mapMatch = line.match(mapPattern);
          return useMapping && mapMatch
            ? mapMatch[1]
            : fieldMatch
            ? fieldMatch[1]
            : null;
        })
        .filter(Boolean) as string[];

      tables.push(tableName);
      mappings[tableName] = fields;
    }

    return { tables, mappings };
  };
}
