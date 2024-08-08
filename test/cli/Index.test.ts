import { Command } from "commander";
import { readFileSync } from "fs";
import { generateSchemaDefinitions } from "../../src/core/application/GenerateSchemaDefinitions";

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

jest.mock("../../src/core/application/GenerateSchemaDefinitions", () => ({
  generateSchemaDefinitions: jest.fn(),
}));

describe("CLI", () => {
  const program = new Command();

  program
    .option("-s, --schema <path>", "Path to Prisma schema file")
    .option("-o, --output <path>", "Output directory", "./generated")
    .option("-c, --const", "Use const for field definitions", false)
    .option(
      "-m, --use-mapping",
      "Use @map and @@map annotations for field names",
      false
    )
    .option(
      "-f, --file-naming <style>",
      "File naming style: camelCase, kebab-case",
      "camelCase"
    )
    .option("--dto-output <path>", "Output directory for DTO files")
    .option("--entity-output <path>", "Output directory for entity files")
    .option(
      "--field-enum-output <path>",
      "Output directory for field enum files"
    )
    .option("--dto-prefix <prefix>", "Prefix for DTO class names", "")
    .option("--entity-prefix <prefix>", "Prefix for entity class names", "")
    .option("--field-enum-prefix <prefix>", "Prefix for field enum names", "")
    .option("--dto-suffix <suffix>", "Suffix for DTO class names", "Dto")
    .option(
      "--entity-suffix <suffix>",
      "Suffix for entity class names",
      "Entity"
    )
    .option(
      "--field-enum-suffix <suffix>",
      "Suffix for field enum names",
      "Fields"
    )
    .option("--dto-as-class", "Generate DTOs as classes", true)
    .option("--entity-as-class", "Generate entities as classes", true)
    .action((options) => {
      const {
        schema,
        output,
        const: useConst,
        useMapping,
        fileNaming,
        dtoOutput,
        entityOutput,
        fieldEnumOutput,
        dtoPrefix,
        entityPrefix,
        fieldEnumPrefix,
        dtoSuffix,
        entitySuffix,
        fieldEnumSuffix,
        dtoAsClass,
        entityAsClass,
      } = options;

      if (!schema) {
        console.error("Please provide the path to the Prisma schema file.");
        process.exit(1);
      }

      if (!["camelCase", "kebab-case"].includes(fileNaming)) {
        console.error(
          "Invalid file naming style. Choose either 'camelCase' or 'kebab-case'."
        );
        process.exit(1);
      }

      const schemaContent = readFileSync(schema, "utf-8");
      generateSchemaDefinitions(
        schemaContent,
        output,
        useConst,
        useMapping,
        fileNaming,
        { dto: dtoPrefix, entity: entityPrefix, fieldEnum: fieldEnumPrefix },
        { dto: dtoSuffix, entity: entitySuffix, fieldEnum: fieldEnumSuffix },
        { dto: dtoOutput, entity: entityOutput, fieldEnum: fieldEnumOutput },
        dtoAsClass,
        entityAsClass
      );
    });

  // Add tests for missing required options
  it("should handle missing schema option", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    process.exit = jest.fn() as any;

    program.parse(["node", "test"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Please provide the path to the Prisma schema file."
    );
    expect(process.exit).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
  });

  // Add tests for invalid option values
  it("should handle invalid file naming style", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    process.exit = jest.fn() as any;

    program.parse([
      "node",
      "test",
      "-s",
      "./schema.prisma",
      "-f",
      "invalidCase",
    ]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Invalid file naming style. Choose either 'camelCase' or 'kebab-case'."
    );
    expect(process.exit).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
  });
});
  it("should call generateSchemaDefinitions with correct arguments", () => {
    const mockSchemaPath = "./schema.prisma";
    const mockSchemaContent = "mock schema content";
    const mockOptions = {
      schema: mockSchemaPath,
      output: "./generated",
      const: false,
      useMapping: false,
      fileNaming: "camelCase",
      dtoOutput: "./generated/dto",
      entityOutput: "./generated/entity",
      fieldEnumOutput: "./generated/field-enum",
      dtoPrefix: "",
      entityPrefix: "",
      fieldEnumPrefix: "",
      dtoSuffix: "Dto",
      entitySuffix: "Entity",
      fieldEnumSuffix: "Fields",
      dtoAsClass: true,
      entityAsClass: true,
    };

    (readFileSync as jest.Mock).mockReturnValue(mockSchemaContent);

    program.parse([
      "node",
      "test",
      "-s",
      mockOptions.schema,
      "-o",
      mockOptions.output,
      "-c",
      String(mockOptions.const),
      "-m",
      String(mockOptions.useMapping),
      "-f",
      mockOptions.fileNaming,
      "--dto-output",
      mockOptions.dtoOutput,
      "--entity-output",
      mockOptions.entityOutput,
      "--field-enum-output",
      mockOptions.fieldEnumOutput,
      "--dto-prefix",
      mockOptions.dtoPrefix,
      "--entity-prefix",
      mockOptions.entityPrefix,
      "--field-enum-prefix",
      mockOptions.fieldEnumPrefix,
      "--dto-suffix",
      mockOptions.dtoSuffix,
      "--entity-suffix",
      mockOptions.entitySuffix,
      "--field-enum-suffix",
      mockOptions.fieldEnumSuffix,
      "--dto-as-class",
      String(mockOptions.dtoAsClass),
      "--entity-as-class",
      String(mockOptions.entityAsClass),
    ]);

    expect(readFileSync).toHaveBeenCalledWith(mockSchemaPath, "utf-8");
    expect(generateSchemaDefinitions).toHaveBeenCalledWith(
      mockSchemaContent,
      mockOptions.output,
      mockOptions.const,
      mockOptions.useMapping,
      mockOptions.fileNaming,
      {
        dto: mockOptions.dtoPrefix,
        entity: mockOptions.entityPrefix,
        fieldEnum: mockOptions.fieldEnumPrefix,
      },
      {
        dto: mockOptions.dtoSuffix,
        entity: mockOptions.entitySuffix,
        fieldEnum: mockOptions.fieldEnumSuffix,
      },
      {
        dto: mockOptions.dtoOutput,
        entity: mockOptions.entityOutput,
        fieldEnum: mockOptions.fieldEnumOutput,
      },
      mockOptions.dtoAsClass,
      mockOptions.entityAsClass
    );
  });

  it("should handle missing schema option", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    process.exit = jest.fn() as any;

    program.parse(["node", "test"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Please provide the path to the Prisma schema file."
    );
    expect(process.exit).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
  });

  it("should handle invalid file naming style", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    process.exit = jest.fn() as any;

    program.parse([
      "node",
      "test",
      "-s",
      "./schema.prisma",
      "-f",
      "invalidCase",
    ]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Invalid file naming style. Choose either 'camelCase' or 'kebab-case'."
    );
    expect(process.exit).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
  });
});
