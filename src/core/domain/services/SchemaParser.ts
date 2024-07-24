import { SchemaDefinition } from "../models/SchemaDefinition";

export class SchemaParser {
  parse(schema: string, useMapping: boolean): SchemaDefinition {
    const tablePattern = /model\s+(\w+)\s+{([^}]+)}/g;
    const mapPattern = /@map\("([^"]+)"\)/;
    const tables: string[] = [];
    const mappings: Record<string, { name: string; type: string }[]> = {};

    let match;
    match = tablePattern.exec(schema);
    while (match !== null) {
      // existing code
      match = tablePattern.exec(schema);
      const tableName = match[1];
      const fields = match[2]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("//"))
        .map((line) => {
          const fieldMatch = line.match(/^(\w+)\s+(\w+)/);
          const mapMatch = line.match(mapPattern);
          if (fieldMatch) {
            return {
              name: useMapping && mapMatch ? mapMatch[1] : fieldMatch[1],
              type: fieldMatch[2],
            };
          } else {
            console.error(`Failed to parse field: ${line}`);
            return null;
          }
        })
        .filter(Boolean) as { name: string; type: string }[];

      tables.push(tableName);
      mappings[tableName] = fields;
    }

    return { tables, mappings };
  };
}
