import { Command } from "commander";
import { readFileSync } from "fs";
import { generateSchemaDefinitions } from "../core/application/GenerateSchemaDefinitions";

export interface CLIOptions {
  schema: string;
  output: string;
  const: boolean;
  mapping: boolean;
  fileNaming: string;
  prefixDto: string;
  suffixDto: string;
  prefixEntity: string;
  suffixEntity: string;
  prefixFieldEnum: string;
  suffixFieldEnum: string;
  dtoDir?: string;
  entityDir?: string;
  fieldEnumDir?: string;
  dtoAsClass: boolean;
  entityAsClass: boolean;
}

const program = new Command();

program
  .requiredOption("-s, --schema <path>", "Path to Prisma schema file")
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

const options: CLIOptions = program.opts<CLIOptions>();

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
