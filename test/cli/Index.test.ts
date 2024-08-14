import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const CLI_PATH = join(__dirname, "../../dist/cli.js");

describe("CLI Integration Tests", () => {
  const OUTPUT_DIR = join(tmpdir(), "generated");

  const runCLI = (args: string) => execSync(`node ${CLI_PATH} ${args}`);

  const verifyFileExists = (filePath: string) => {
    expect(existsSync(filePath)).toBe(true);
    return readFileSync(filePath, "utf-8");
  };

  beforeEach(() => {
    rmSync(OUTPUT_DIR, { recursive: true, force: true });
    mkdirSync(OUTPUT_DIR, { recursive: true });
  });

  afterAll(() => {
    rmSync(OUTPUT_DIR, { recursive: true, force: true });
  });

  it("should generate schema definitions using the CLI", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");

    runCLI(`--schema ${schemaPath} --output ${OUTPUT_DIR}`);

    const enumFileContent = verifyFileExists(
      join(OUTPUT_DIR, "field-enum", "prefixUserFields.ts")
    );
    const dtoFileContent = verifyFileExists(
      join(OUTPUT_DIR, "dto", "prefixUserDto.ts")
    );
    const entityFileContent = verifyFileExists(
      join(OUTPUT_DIR, "entity", "prefixUserEntity.ts")
    );
    const allTablesFileContent = verifyFileExists(
      join(OUTPUT_DIR, "field-enum", "prefixTables.ts")
    );

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

  it("should fail if the schema option is missing", () => {
    expect(() => runCLI(`--output ${OUTPUT_DIR}`)).toThrowError(
      /Schema option is required/
    );
  });

  it("should fail if the output option is missing", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");
    expect(() => runCLI(`--schema ${schemaPath}`)).toThrowError(
      /Output option is required/
    );
  });

  it("should fail if the schema path is invalid", () => {
    const schemaPath = join(__dirname, "./invalidSchema.prisma");
    expect(() =>
      runCLI(`--schema ${schemaPath} --output ${OUTPUT_DIR}`)
    ).toThrowError(/Schema file not found/);
  });

  it("should fail if the output path is invalid", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");
    expect(() =>
      runCLI(`--schema ${schemaPath} --output ./invalid/output/path`)
    ).toThrowError(/Output path is invalid/);
  });

  it("should fail if the output directory is not writable", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");
    const unwritableOUTPUT_DIR = "/root/generated";
    expect(() =>
      runCLI(`--schema ${schemaPath} --output ${unwritableOUTPUT_DIR}`)
    ).toThrowError(/Permission denied/);
  });

  it("should fail if an invalid option value is provided", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");
    expect(() =>
      runCLI(`--schema ${schemaPath} --output ${OUTPUT_DIR} --invalidOption`)
    ).toThrowError(/Unknown option/);
  });

  it("should handle a valid schema path with comments and whitespace correctly", () => {
    const schemaWithCommentsPath = join(
      __dirname,
      "./mockSchemaWithComments.prisma"
    );
    const schemaContent = `
      /// This is a model with comments and whitespace
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
    writeFileSync(schemaWithCommentsPath, schemaContent);

    runCLI(`--schema ${schemaWithCommentsPath} --output ${OUTPUT_DIR}`);

    const enumFileContent = verifyFileExists(
      join(OUTPUT_DIR, "field-enum", "prefixUserFields.ts")
    );
    const dtoFileContent = verifyFileExists(
      join(OUTPUT_DIR, "dto", "prefixUserDto.ts")
    );
    const entityFileContent = verifyFileExists(
      join(OUTPUT_DIR, "entity", "prefixUserEntity.ts")
    );
    const allTablesFileContent = verifyFileExists(
      join(OUTPUT_DIR, "field-enum", "prefixTables.ts")
    );

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
