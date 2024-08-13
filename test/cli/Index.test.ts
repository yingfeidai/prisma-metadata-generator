import { execSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { tmpdir } from "os";

const CLI_PATH = join(__dirname, "../../dist/cli.js");

describe("CLI Integration Tests", () => {
  const outputDir = join(tmpdir(), "generated");

  const runCLI = (args: string) => execSync(`node ${CLI_PATH} ${args}`);

  const verifyFileExists = (filePath: string) => {
    expect(existsSync(filePath)).toBe(true);
    return readFileSync(filePath, "utf-8");
  };

  beforeEach(() => {
    if (existsSync(outputDir)) {
      rmdirSync(outputDir, { recursive: true });
    }
    mkdirSync(outputDir, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(outputDir)) {
      rmdirSync(outputDir, { recursive: true });
    }
  });

  it("should generate schema definitions using the CLI", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");

    runCLI(`--schema ${schemaPath} --output ${outputDir}`);

    const enumFileContent = verifyFileExists(
      join(outputDir, "field-enum", "prefixUserFields.ts")
    );
    const dtoFileContent = verifyFileExists(
      join(outputDir, "dto", "prefixUserDto.ts")
    );
    const entityFileContent = verifyFileExists(
      join(outputDir, "entity", "prefixUserEntity.ts")
    );
    const allTablesFileContent = verifyFileExists(
      join(outputDir, "field-enum", "prefixTables.ts")
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
    expect(() => runCLI(`--output ${outputDir}`)).toThrowError(
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
      runCLI(`--schema ${schemaPath} --output ${outputDir}`)
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
    const unwritableOutputDir = "/root/generated";
    expect(() =>
      runCLI(`--schema ${schemaPath} --output ${unwritableOutputDir}`)
    ).toThrowError(/Permission denied/);
  });

  it("should fail if an invalid option value is provided", () => {
    const schemaPath = join(__dirname, "./mockSchema.prisma");
    expect(() =>
      runCLI(`--schema ${schemaPath} --output ${outputDir} --invalidOption`)
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

    runCLI(`--schema ${schemaWithCommentsPath} --output ${outputDir}`);

    const enumFileContent = verifyFileExists(
      join(outputDir, "field-enum", "prefixUserFields.ts")
    );
    const dtoFileContent = verifyFileExists(
      join(outputDir, "dto", "prefixUserDto.ts")
    );
    const entityFileContent = verifyFileExists(
      join(outputDir, "entity", "prefixUserEntity.ts")
    );
    const allTablesFileContent = verifyFileExists(
      join(outputDir, "field-enum", "prefixTables.ts")
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
