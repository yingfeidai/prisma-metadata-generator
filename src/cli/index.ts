import { Command } from "commander";
import { readFileSync } from "fs";
import { generateSchemaDefinitions } from "../core/application/GenerateSchemaDefinitions";

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
  .option("--field-enum-output <path>", "Output directory for field enum files")
  .option("--dto-prefix <prefix>", "Prefix for DTO class names", "")
  .option("--entity-prefix <prefix>", "Prefix for entity class names", "")
  .option("--field-enum-prefix <prefix>", "Prefix for field enum names", "")
  .option("--dto-suffix <suffix>", "Suffix for DTO class names", "Dto")
  .option("--entity-suffix <suffix>", "Suffix for entity class names", "Entity")
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

program.parse(process.argv);
