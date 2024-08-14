import { writeFileSync } from "fs";
import { errorHandler } from "../domain/services/ErrorHandler";
import { SchemaParser } from "../domain/services/SchemaParser";

export const generateEnumFile = (
  tableName: string,
  fields: string[],
  useConst: boolean,
  outputPath: string,
  prefix: string
): void => {
  const enumName = `${prefix}${tableName[0].toUpperCase()}${tableName.slice(
    1
  )}Fields`;
  const enumContent = useConst
    ? `export const ${enumName} = {\n  ${fields
        .map((field) => `${field}: "${field}",`)
        .join("\n  ")}\n} as const;`
    : `export enum ${enumName} {\n  ${fields
        .map((field) => `${field} = "${field}",`)
        .join("\n  ")}\n}`;

  try {
    writeFileSync(outputPath, enumContent);
  } catch (error) {
    errorHandler(error, "Failed to write enum file");
  }
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

  try {
    writeFileSync(outputPath, tablesContent);
  } catch (error) {
    errorHandler(error, "Failed to write all tables file");
  }
};

export const formatFileName = (name: string, style: string): string => {
  switch (style) {
    case "kebab-case":
      return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    default:
      return name;
  }
};

export const generateDtoFile = (
  tableName: string,
  fields: { name: string; type: string }[],
  outputPath: string,
  prefix: string,
  suffix: string,
  asClass: boolean
): void => {
  const className = `${prefix}${tableName[0].toUpperCase()}${tableName
    .slice(1)
    .toLowerCase()}${suffix}`;
  const dtoContent = asClass
    ? `export class ${className} {\n  ${fields
        .map((field) => `${field.name}!: ${field.type};`)
        .join("\n  ")}\n}`
    : `export const ${className[0].toLowerCase()}${className.slice(
        1
      )} = {\n  ${fields
        .map((field) => `${field.name}: undefined as ${field.type},`)
        .join("\n  ")}\n} as const;`;

  try {
    writeFileSync(outputPath, dtoContent);
  } catch (error) {
    errorHandler(error, "Failed to write DTO file");
  }
};

export const generateEntityFile = (
  tableName: string,
  fields: { name: string; type: string }[],
  outputPath: string,
  prefix: string,
  suffix: string,
  asClass: boolean
): void => {
  const className = `${prefix}${tableName[0].toUpperCase()}${tableName
    .slice(1)
    .toLowerCase()}${suffix}`;
  const entityContent = asClass
    ? `export class ${className} {\n  ${fields
        .map((field) => `${field.name}!: ${field.type};`)
        .join("\n  ")}\n}`
    : `export const ${className[0].toLowerCase()}${className.slice(
        1
      )} = {\n  ${fields
        .map((field) => `${field.name}: undefined as ${field.type},`)
        .join("\n  ")}\n} as const;`;

  try {
    writeFileSync(outputPath, entityContent);
  } catch (error) {
    errorHandler(error, "Failed to write entity file");
  }
};

export const generateSchemaDefinitions = (
  schema: string,
  outputDir: string,
  useConst: boolean,
  useMapping: boolean,
  fileNaming: string,
  prefixes: { dto: string; entity: string; fieldEnum: string },
  suffixes: { dto: string; entity: string; fieldEnum: string },
  outputDirs: { dto?: string; entity?: string; fieldEnum?: string },
  dtoAsClass: boolean,
  entityAsClass: boolean
): void => {
  try {
    const parser = new SchemaParser();
    const { tables, mappings } = parser.parse(schema, useMapping);

    tables.forEach((table) => {
      const fields = mappings[table] || [];
      const fieldNames = fields.map((field) => field.name);
      const fileName = formatFileName(
        `${prefixes.fieldEnum}${table}${suffixes.fieldEnum}`,
        fileNaming
      );
      const dtoFileName = formatFileName(
        `${prefixes.dto}${table}${suffixes.dto}`,
        fileNaming
      );
      const entityFileName = formatFileName(
        `${prefixes.entity}${table}${suffixes.entity}`,
        fileNaming
      );

      generateEnumFile(
        table,
        fieldNames,
        useConst,
        `${outputDirs.fieldEnum ?? `${outputDir}/field-enum`}/${fileName}.ts`,
        prefixes.fieldEnum
      );

      generateDtoFile(
        table,
        fields,
        `${outputDirs.dto ?? `${outputDir}/dto`}/${dtoFileName}.ts`,
        prefixes.dto,
        suffixes.dto,
        dtoAsClass
      );

      generateEntityFile(
        table,
        fields,
        `${outputDirs.entity ?? `${outputDir}/entity`}/${entityFileName}.ts`,
        prefixes.entity,
        suffixes.entity,
        entityAsClass
      );
    });

    const allTablesFileName = formatFileName(
      `${prefixes.fieldEnum}Tables`,
      fileNaming
    );
    generateAllTablesFile(
      tables,
      useConst,
      `${
        outputDirs.fieldEnum ?? `${outputDir}/field-enum`
      }/${allTablesFileName}.ts`,
      prefixes.fieldEnum
    );
  } catch (error) {
    errorHandler(error, "Error generating schema definitions");
  }
};
