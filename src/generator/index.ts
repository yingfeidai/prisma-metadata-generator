import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { generateSchemaDefinitions } from "../core/application/GenerateSchemaDefinitions";

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./generated",
      prettyName: "Prisma Fields, Enums, DTOs, and Entities Generator",
    };
  },
  async onGenerate(options: GeneratorOptions) {
    if (!options.generator.output) {
      throw new Error("Output directory is not specified.");
    }

    const outputDir = options.generator.output?.value ?? "./generated";
    const useConst = options.generator.config.useConst === "true";
    const useMapping = options.generator.config.useMapping === "true";
    const fileNaming = Array.isArray(options.generator.config.fileNaming)
      ? options.generator.config.fileNaming[0]
      : options.generator.config.fileNaming || "camelCase";
    if (!["camelCase", "kebab-case"].includes(fileNaming)) {
      throw new Error("Invalid file naming style. Choose either 'camelCase' or 'kebab-case'.");
    }

    const prefixes = {
      dto: Array.isArray(options.generator.config.dtoPrefix)
        ? options.generator.config.dtoPrefix[0]
        : options.generator.config.dtoPrefix || "",
      entity: Array.isArray(options.generator.config.entityPrefix)
        ? options.generator.config.entityPrefix[0]
        : options.generator.config.entityPrefix || "",
      fieldEnum: Array.isArray(options.generator.config.fieldEnumPrefix)
        ? options.generator.config.fieldEnumPrefix[0]
        : options.generator.config.fieldEnumPrefix || "",
    };
    const suffixes = {
      dto: Array.isArray(options.generator.config.dtoSuffix)
        ? options.generator.config.dtoSuffix[0]
        : options.generator.config.dtoSuffix || "Dto",
      entity: Array.isArray(options.generator.config.entitySuffix)
        ? options.generator.config.entitySuffix[0]
        : options.generator.config.entitySuffix || "Entity",
      fieldEnum: Array.isArray(options.generator.config.fieldEnumSuffix)
        ? options.generator.config.fieldEnumSuffix[0]
        : options.generator.config.fieldEnumSuffix || "Fields",
    };
    const outputDirs = {
      dto: Array.isArray(options.generator.config.dtoOutput)
        ? options.generator.config.dtoOutput[0]
        : options.generator.config.dtoOutput,
      entity: Array.isArray(options.generator.config.entityOutput)
        ? options.generator.config.entityOutput[0]
        : options.generator.config.entityOutput,
      fieldEnum: Array.isArray(options.generator.config.fieldEnumOutput)
        ? options.generator.config.fieldEnumOutput[0]
        : options.generator.config.fieldEnumOutput,
    };
    const dtoAsClass = options.generator.config.dtoAsClass !== "false";
    const entityAsClass = options.generator.config.entityAsClass !== "false";

    const schema = options.datamodel;
    if (typeof schema !== "string") {
      throw new Error("Expected schema to be a string");
    }

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
  },
});
