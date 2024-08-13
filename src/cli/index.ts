import { Command } from "commander";
import { readFileSync } from "fs";
import { generateSchemaDefinitions } from "../core/application/GenerateSchemaDefinitions";

const program = new Command();

program
  .option("-s, --schema <path>", "Path to Prisma schema file")
  .option("-o, --output <path>", "Output directory", "./generated")
  .option("-c, --const", "Use const enums instead of regular enums", false)
  .option("-m, --mapping", "Use field mapping annotations", false)
  .option(
    "--file-naming <style>",
    "File naming style (camelCase|kebab-case)",
    "camelCase"
  )
  .option("--prefix-dto <prefix>", "Prefix for DTO files", "")
  .option("--suffix-dto <suffix>", "Suffix for DTO files", "")
  .option("--prefix-entity <prefix>", "Prefix for Entity files", "")
  .option("--suffix-entity <suffix>", "Suffix for Entity files", "")
  .option("--prefix-field-enum <prefix>", "Prefix for Field Enum files", "")
  .option("--suffix-field-enum <suffix>", "Suffix for Field Enum files", "")
  .option("--dto-dir <path>", "Output directory for DTO files")
  .option("--entity-dir <path>", "Output directory for Entity files")
  .option("--field-enum-dir <path>", "Output directory for Field Enum files")
  .option(
    "--dto-as-class",
    "Generate DTOs as classes instead of objects",
    false
  )
  .option(
    "--entity-as-class",
    "Generate Entities as classes instead of objects",
    false
  )
  .parse(process.argv);

const options = program.opts();

if (!options.schema) {
  console.error("Schema file path is required.");
  process.exit(1);
}

const schemaContent = readFileSync(options.schema, "utf-8");

generateSchemaDefinitions(
  schemaContent,
  options.output,
  options.const,
  options.mapping,
  options.fileNaming,
  {
    dto: options.prefixDto,
    entity: options.prefixEntity,
    fieldEnum: options.prefixFieldEnum,
  },
  {
    dto: options.suffixDto,
    entity: options.suffixEntity,
    fieldEnum: options.suffixFieldEnum,
  },
  {
    dto: options.dtoDir,
    entity: options.entityDir,
    fieldEnum: options.fieldEnumDir,
  },
  options.dtoAsClass,
  options.entityAsClass
);
