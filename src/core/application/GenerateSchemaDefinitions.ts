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

  writeFileSync(outputPath, dtoContent);
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

  writeFileSync(outputPath, entityContent);
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
        join(
          outputDirs.fieldEnum ?? join(outputDir, "field-enum"),
          `${fileName}.ts`
        ),
        prefixes.fieldEnum
      );

      generateDtoFile(
        table,
        fields,
        join(outputDirs.dto ?? join(outputDir, "dto"), `${dtoFileName}.ts`),
        prefixes.dto,
        suffixes.dto,
        dtoAsClass
      );

      generateEntityFile(
        table,
        fields,
        join(
          outputDirs.entity ?? join(outputDir, "entity"),
          `${entityFileName}.ts`
        ),
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
      join(
        outputDirs.fieldEnum ?? join(outputDir, "field-enum"),
        `${allTablesFileName}.ts`
      ),
      prefixes.fieldEnum
    );
  } catch (error) {
    console.error("Error generating schema definitions:", error);
  }
};
