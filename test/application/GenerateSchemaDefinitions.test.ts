import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  rmdirSync,
} from "fs";
import { join } from "path";
import { generateAllTablesFile, generateDtoFile, generateEntityFile, generateEnumFile, generateSchemaDefinitions } from "../../src/core/application/GenerateSchemaDefinitions";


// Mock writeFileSync
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
}));

describe("generateEnumFile", () => {
  it("should generate a const enum file", () => {
    const tableName = "User";
    const fields = ["id", "name"];
    const useConst = true;
    const outputPath = "./generated/field-enum/prefixUserFields.ts";
    const prefix = "prefix";

    generateEnumFile(tableName, fields, useConst, outputPath, prefix);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export const prefixUserFields = {\n  id: "id",\n  name: "name",\n} as const;`
    );
  });

  it("should generate an enum file", () => {
    const tableName = "User";
    const fields = ["id", "name"];
    const useConst = false;
    const outputPath = "./generated/field-enum/prefixUserFields.ts";
    const prefix = "prefix";

    generateEnumFile(tableName, fields, useConst, outputPath, prefix);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export enum prefixUserFields {\n  id = "id",\n  name = "name",\n}`
    );
  });
});

describe("generateAllTablesFile", () => {
  it("should generate a const all tables file", () => {
    const tables = ["User", "Post"];
    const useConst = true;
    const outputPath = "./generated/field-enum/prefixTables.ts";
    const prefix = "prefix";

    generateAllTablesFile(tables, useConst, outputPath, prefix);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export const prefixTables = {\n  USER: "User",\n  POST: "Post",\n} as const;\n\nexport type prefixTables = keyof typeof prefixTables;`
    );
  });

  it("should generate an enum all tables file", () => {
    const tables = ["User", "Post"];
    const useConst = false;
    const outputPath = "./generated/field-enum/prefixTables.ts";
    const prefix = "prefix";

    generateAllTablesFile(tables, useConst, outputPath, prefix);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export enum prefixTables {\n  USER = "User",\n  POST = "Post",\n}`
    );
  });
});

describe("generateDtoFile", () => {
  it("should generate a DTO class file", () => {
    const tableName = "User";
    const fields = [
      { name: "id", type: "number" },
      { name: "name", type: "string" },
    ];
    const outputPath = "./generated/dto/prefixUserDto.ts";
    const prefix = "prefix";
    const suffix = "Dto";
    const asClass = true;

    generateDtoFile(tableName, fields, outputPath, prefix, suffix, asClass);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export class prefixUserDto {\n  id!: number;\n  name!: string;\n}`
    );
  });

  it("should generate a DTO const file", () => {
    const tableName = "User";
    const fields = [
      { name: "id", type: "number" },
      { name: "name", type: "string" },
    ];
    const outputPath = "./generated/dto/prefixUserDto.ts";
    const prefix = "prefix";
    const suffix = "Dto";
    const asClass = false;

    generateDtoFile(tableName, fields, outputPath, prefix, suffix, asClass);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export const prefixUserDto = {\n  id: undefined as number,\n  name: undefined as string,\n} as const;`
    );
  });
});

describe("generateEntityFile", () => {
  it("should generate an entity class file", () => {
    const tableName = "User";
    const fields = [
      { name: "id", type: "number" },
      { name: "name", type: "string" },
    ];
    const outputPath = "./generated/entity/prefixUserEntity.ts";
    const prefix = "prefix";
    const suffix = "Entity";
    const asClass = true;

    generateEntityFile(tableName, fields, outputPath, prefix, suffix, asClass);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export class prefixUserEntity {\n  id!: number;\n  name!: string;\n}`
    );
  });

  it("should generate an entity const file", () => {
    const tableName = "User";
    const fields = [
      { name: "id", type: "number" },
      { name: "name", type: "string" },
    ];
    const outputPath = "./generated/entity/prefixUserEntity.ts";
    const prefix = "prefix";
    const suffix = "Entity";
    const asClass = false;

    generateEntityFile(tableName, fields, outputPath, prefix, suffix, asClass);

    expect(writeFileSync).toHaveBeenCalledWith(
      outputPath,
      `export const prefixUserEntity = {\n  id: undefined as number,\n  name: undefined as string,\n} as const;`
    );
  });
});

describe("generateSchemaDefinitions", () => {
  const schema = `
    model User {
      id Int @id
      name String
    }
    model Post {
      id Int @id
      title String
      content String
      userId Int
      user User @relation(fields: [userId], references: [id])
    }
  `;

  const outputDir = "./generated";
  const useConst = true;
  const useMapping = false;
  const fileNaming = "camelCase";
  const prefixes = { dto: "prefix", entity: "prefix", fieldEnum: "prefix" };
  const suffixes = { dto: "Dto", entity: "Entity", fieldEnum: "Fields" };
  const outputDirs = {
    dto: undefined,
    entity: undefined,
    fieldEnum: undefined,
  };
  const dtoAsClass = true;
  const entityAsClass = true;

  beforeEach(() => {
    jest.clearAllMocks();
    if (existsSync(outputDir)) {
      rmdirSync(outputDir, { recursive: true });
    }
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(join(outputDir, "dto"), { recursive: true });
    mkdirSync(join(outputDir, "entity"), { recursive: true });
    mkdirSync(join(outputDir, "field-enum"), { recursive: true });
  });

  afterAll(() => {
    if (existsSync(outputDir)) {
      rmdirSync(outputDir, { recursive: true });
    }
  });

  it("should generate schema definitions", () => {
    generateSchemaDefinitions(
      schema,
      outputDir,
      useConst,
      useMapping,
      fileNaming,
      prefixes,
      suffixes,
      outputDirs,
      dtoAsClass,
      entityAsClass
    );

    const enumFilePath = join(outputDir, "field-enum", "prefixUserFields.ts");
    const dtoFilePath = join(outputDir, "dto", "prefixUserDto.ts");
    const entityFilePath = join(outputDir, "entity", "prefixUserEntity.ts");
    const allTablesFilePath = join(outputDir, "field-enum", "prefixTables.ts");

    expect(existsSync(enumFilePath)).toBe(true);
    expect(existsSync(dtoFilePath)).toBe(true);
    expect(existsSync(entityFilePath)).toBe(true);
    expect(existsSync(allTablesFilePath)).toBe(true);

    const enumFileContent = readFileSync(enumFilePath, "utf-8");
    const dtoFileContent = readFileSync(dtoFilePath, "utf-8");
    const entityFileContent = readFileSync(entityFilePath, "utf-8");
    const allTablesFileContent = readFileSync(allTablesFilePath, "utf-8");

    expect(enumFileContent).toContain("export const prefixUserFields");
    expect(enumFileContent).toContain('id: "id"');
    expect(enumFileContent).toContain('name: "name"');

    expect(dtoFileContent).toContain("export class prefixUserDto");
    expect(dtoFileContent).toContain("id!: number;");
    expect(dtoFileContent).toContain("name!: string;");

    expect(entityFileContent).toContain("export class prefixUserEntity");
    expect(entityFileContent).toContain("id!: number;");
    expect(entityFileContent).toContain("name!: string;");

    expect(allTablesFileContent).toContain("export const prefixTables");
    expect(allTablesFileContent).toContain('USER: "User"');
    expect(allTablesFileContent).toContain('POST: "Post"');
  });
});
