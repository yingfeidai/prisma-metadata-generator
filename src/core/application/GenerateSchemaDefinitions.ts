import { writeFileSync } from "fs";
import { join } from "path";
import { SchemaParser } from "../domain/services/SchemaParser";

export const generateEnumFile = (
  tableName: string,
  fields: string[],
  useConst: boolean,
  outputPath: string,
  prefix: string
): void => {
  const fieldDefinitions = fields
    .map((field) => `${field.toUpperCase()}: "${field}"`)
    .join(",\n  ");
  const constName = `${prefix}${tableName[0].toUpperCase()}${tableName
    .slice(1)
    .toLowerCase()}Fields`;
  const typeName = `${prefix}${tableName[0].toUpperCase()}${tableName.slice(
    1
  )}Fields`;
  const enumContent = useConst
    ? `export const ${constName[0].toLowerCase()}${constName.slice(
        1
      )} = {\n  ${fieldDefinitions}\n} as const;\n\nexport type ${typeName} = keyof typeof ${constName[0].toLowerCase()}${constName.slice(
        1
      )};`
    : `export enum ${typeName} {\n  ${fieldDefinitions
        .replace(/: "/g, ' = "')
        .replace(/"/g, '",')}\n}`;

  writeFileSync(outputPath, enumContent);
};

export const generateAllTablesFile = (
  tables: string[],
  useConst: boolean,
  outputPath: string,
  prefix: string
): void => {
  const tableDefinitions = tables
    .map((table) => `${table.toUpperCase()}: "${table}"`)
    .join(",\n  ");
  const constName = `${prefix.toLowerCase()}Tables`;
  const typeName = `${prefix}Tables`;
  const tablesContent = useConst
    ? `export const ${constName} = {\n  ${tableDefinitions}\n} as const;\n\nexport type ${typeName} = keyof typeof ${constName};`
    : `export enum ${typeName} {\n  ${tableDefinitions
        .replace(/: "/g, ' = "')
        .replace(/"/g, '",')}\n}`;

  writeFileSync(outputPath, tablesContent);
};

const formatFileName = (name: string, style: string): string => {
  switch (style) {
    case "kebab-case":
      return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    case "camelCase":
    default:
      return name;
  }
};

export const generateSchemaDefinitions = (
  schema: string,
  outputDir: string,
  useConst: boolean,
  useMapping: boolean,
  fileNaming: string,
  prefix: string
): void => {
  const parser = new SchemaParser();
  const { tables, mappings } = parser.parse(schema, useMapping);

  tables.forEach((table) => {
    const fields = mappings[table] || [];
    const fileName = formatFileName(`${prefix}${table}`, fileNaming);
    generateEnumFile(
      table,
      fields,
      useConst,
      join(outputDir, `${fileName}.ts`),
      prefix
    );
  });

  const allTablesFileName = formatFileName(`${prefix}Tables`, fileNaming);
  generateAllTablesFile(
    tables,
    useConst,
    join(outputDir, `${allTablesFileName}.ts`),
    prefix
  );
};
