import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { generateSchemaDefinitions } from "../core/application/GenerateSchemaDefinitions";

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./generated",
      prettyName: "Prisma Fields and Enums Generator",
    };
  },
  async onGenerate(options: GeneratorOptions) {
    const outputDir = options.generator.output?.value ?? "./generated";
    const useConst = options.generator.config.useConst === "true";
    const useMapping = options.generator.config.useMapping === "true";
    const fileNaming = Array.isArray(options.generator.config.fileNaming)
      ? options.generator.config.fileNaming[0]
      : options.generator.config.fileNaming || "camelCase";
    const prefix = Array.isArray(options.generator.config.prefix)
      ? options.generator.config.prefix[0]
      : options.generator.config.prefix || "";

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
      prefix
    );
  },
});
