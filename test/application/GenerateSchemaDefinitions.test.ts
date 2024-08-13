import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import {
  generateAllTablesFile,
  generateDtoFile,
  generateEntityFile,
  generateEnumFile,
  generateSchemaDefinitions,
} from "../../src/core/application/GenerateSchemaDefinitions";

// Mock writeFileSync
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
}));

const OUTPUT_DIR = "./generated";
const PREFIX = "prefix";
const TABLES = ["User", "Post"];
const FIELDS = ["id", "name"];
const FIELD_DETAILS = [
  { name: "id", type: "number" },
  { name: "name", type: "string" },
];

describe("Schema Generation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (existsSync(OUTPUT_DIR)) {
      rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    mkdirSync(OUTPUT_DIR, { recursive: true });
    mkdirSync(join(OUTPUT_DIR, "dto"), { recursive: true });
    mkdirSync(join(OUTPUT_DIR, "entity"), { recursive: true });
    mkdirSync(join(OUTPUT_DIR, "field-enum"), { recursive: true });
  });

  afterAll(() => {
    if (existsSync(OUTPUT_DIR)) {
      rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  describe("generateEnumFile", () => {
    it("should generate a const enum file", () => {
      const outputPath = join(OUTPUT_DIR, "field-enum", "prefixUserFields.ts");

      generateEnumFile("User", FIELDS, true, outputPath, PREFIX);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export const prefixUserFields = {\n  id: "id",\n  name: "name",\n} as const;`
      );
    });

    it("should generate an enum file", () => {
      const outputPath = join(OUTPUT_DIR, "field-enum", "prefixUserFields.ts");

      generateEnumFile("User", FIELDS, false, outputPath, PREFIX);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export enum prefixUserFields {\n  id = "id",\n  name = "name",\n}`
      );
    });

    it("should handle empty fields array", () => {
      const outputPath = join(OUTPUT_DIR, "field-enum", "prefixEmptyFields.ts");

      generateEnumFile("Empty", [], false, outputPath, PREFIX);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export enum prefixEmptyFields {}`
      );
    });
  });

  describe("generateAllTablesFile", () => {
    it("should generate a const all tables file", () => {
      const outputPath = join(OUTPUT_DIR, "field-enum", "prefixTables.ts");

      generateAllTablesFile(TABLES, true, outputPath, PREFIX);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export const prefixTables = {\n  USER: "User",\n  POST: "Post",\n} as const;\n\nexport type prefixTables = keyof typeof prefixTables;`
      );
    });

    it("should generate an enum all tables file", () => {
      const outputPath = join(OUTPUT_DIR, "field-enum", "prefixTables.ts");

      generateAllTablesFile(TABLES, false, outputPath, PREFIX);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export enum prefixTables {\n  USER = "User",\n  POST = "Post",\n}`
      );
    });

    it("should handle empty tables array", () => {
      const outputPath = join(OUTPUT_DIR, "field-enum", "prefixEmptyTables.ts");

      generateAllTablesFile([], false, outputPath, PREFIX);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export enum prefixEmptyTables {}`
      );
    });
  });

  describe("generateDtoFile", () => {
    it("should generate a DTO class file", () => {
      const outputPath = join(OUTPUT_DIR, "dto", "prefixUserDto.ts");

      generateDtoFile("User", FIELD_DETAILS, outputPath, PREFIX, "Dto", true);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export class prefixUserDto {\n  id!: number;\n  name!: string;\n}`
      );
    });

    it("should generate a DTO const file", () => {
      const outputPath = join(OUTPUT_DIR, "dto", "prefixUserDto.ts");

      generateDtoFile("User", FIELD_DETAILS, outputPath, PREFIX, "Dto", false);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export const prefixUserDto = {\n  id: undefined as number,\n  name: undefined as string,\n} as const;`
      );
    });

    it("should handle empty fields array", () => {
      const outputPath = join(OUTPUT_DIR, "dto", "prefixEmptyDto.ts");

      generateDtoFile("Empty", [], outputPath, PREFIX, "Dto", true);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export class prefixEmptyDto {}`
      );
    });
  });

  describe("generateEntityFile", () => {
    it("should generate an entity class file", () => {
      const outputPath = join(OUTPUT_DIR, "entity", "prefixUserEntity.ts");

      generateEntityFile(
        "User",
        FIELD_DETAILS,
        outputPath,
        PREFIX,
        "Entity",
        true
      );

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export class prefixUserEntity {\n  id!: number;\n  name!: string;\n}`
      );
    });

    it("should generate an entity const file", () => {
      const outputPath = join(OUTPUT_DIR, "entity", "prefixUserEntity.ts");

      generateEntityFile(
        "User",
        FIELD_DETAILS,
        outputPath,
        PREFIX,
        "Entity",
        false
      );

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export const prefixUserEntity = {\n  id: undefined as number,\n  name: undefined as string,\n} as const;`
      );
    });

    it("should handle empty fields array", () => {
      const outputPath = join(OUTPUT_DIR, "entity", "prefixEmptyEntity.ts");

      generateEntityFile("Empty", [], outputPath, PREFIX, "Entity", true);

      expect(writeFileSync).toHaveBeenCalledWith(
        outputPath,
        `export class prefixEmptyEntity {}`
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

    it("should generate schema definitions correctly", () => {
      generateSchemaDefinitions(
        schema,
        OUTPUT_DIR,
        true,
        false,
        "camelCase",
        { dto: PREFIX, entity: PREFIX, fieldEnum: PREFIX },
        { dto: "Dto", entity: "Entity", fieldEnum: "Fields" },
        { dto: undefined, entity: undefined, fieldEnum: undefined },
        true,
        true
      );

      const enumFilePath = join(
        OUTPUT_DIR,
        "field-enum",
        "prefixUserFields.ts"
      );
      const dtoFilePath = join(OUTPUT_DIR, "dto", "prefixUserDto.ts");
      const entityFilePath = join(OUTPUT_DIR, "entity", "prefixUserEntity.ts");
      const allTablesFilePath = join(
        OUTPUT_DIR,
        "field-enum",
        "prefixTables.ts"
      );

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

    it("should throw an error for invalid schema", () => {
      const invalidSchema = `invalid schema`;

      expect(() =>
        generateSchemaDefinitions(
          invalidSchema,
          OUTPUT_DIR,
          true,
          false,
          "camelCase",
          { dto: PREFIX, entity: PREFIX, fieldEnum: PREFIX },
          { dto: "Dto", entity: "Entity", fieldEnum: "Fields" },
          { dto: undefined, entity: undefined, fieldEnum: undefined },
          true,
          true
        )
      ).toThrow();
    });

    it("should handle an empty schema", () => {
      const emptySchema = ``;

      generateSchemaDefinitions(
        emptySchema,
        OUTPUT_DIR,
        true,
        false,
        "camelCase",
        { dto: PREFIX, entity: PREFIX, fieldEnum: PREFIX },
        { dto: "Dto", entity: "Entity", fieldEnum: "Fields" },
        { dto: undefined, entity: undefined, fieldEnum: undefined },
        true,
        true
      );

      const allTablesFilePath = join(
        OUTPUT_DIR,
        "field-enum",
        "prefixTables.ts"
      );
      const allTablesFileContent = readFileSync(allTablesFilePath, "utf-8");

      expect(allTablesFileContent).toContain("export const prefixTables = {}");
    });
  });
});
