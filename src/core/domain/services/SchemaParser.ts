import { SchemaDefinition } from "../models/SchemaDefinition";

export class SchemaParser {
  private tablePattern = /model\s+(\w+)\s+{([^}]+)}/g;
  private mapPattern = /@map\("([^"]+)"\)/;

  parse(schema: string, useMapping: boolean): SchemaDefinition {
    const tables: string[] = [];
    const mappings: Record<string, { name: string; type: string }[]> = {};
    let match: RegExpExecArray | null;

    while ((match = this.tablePattern.exec(schema)) !== null) {
      const tableName = match[1];
      const fields = match[2]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("//"))
        .map((line) => this.parseField(line, useMapping))
        .filter(Boolean) as { name: string; type: string }[];

      tables.push(tableName);
      mappings[tableName] = fields;
    }

    if (tables.length === 0 || Object.keys(mappings).length === 0) {
      throw new Error("Invalid schema: No tables or mappings found.");
    }

    return { tables, mappings };
  }

  private parseField(line: string, useMapping: boolean) {
    const fieldMatch = line.match(/^(\w+)\s+(\w+)/);
    const mapMatch = line.match(this.mapPattern);
    if (fieldMatch) {
      return {
        name: useMapping && mapMatch ? mapMatch[1] : fieldMatch[1],
        type: fieldMatch[2],
      };
    } else {
      console.error(`Failed to parse field: ${line}`);
      return null;
    }
  }
}
