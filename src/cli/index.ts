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
  .option(
    "-p, --prefix <prefix>",
    "Prefix for the overall table enum file name",
    ""
  )
  .action((options) => {
    const {
      schema,
      output,
      const: useConst,
      useMapping,
      fileNaming,
      prefix,
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
      prefix
    );
  });

program.parse(process.argv);
