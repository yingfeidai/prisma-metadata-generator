# Prisma Metadata Generator

This generator creates TypeScript files for field enums, DTOs, and entities from your Prisma schema. You can customize the output format and structure with various options.

## Installation

```bash
npm install prisma-metadata-generator
```

## Usage

### Prisma Generator

Add the generator to your schema.prisma file:

```prisma
generator prismaMetadataGenerator {
  provider = "prisma-metadata-generator"
  output   = "./generated"

  // Optional configurations
  useConst       = "true"
  useMapping     = "true"
  fileNaming     = "camelCase"
  dtoPrefix      = "My"
  entityPrefix   = "My"
  fieldEnumPrefix = "My"
  dtoSuffix      = "CustomDto"
  entitySuffix   = "CustomEntity"
  fieldEnumSuffix = "CustomFields"
  dtoOutput      = "./output/dtos"
  entityOutput   = "./output/entities"
  fieldEnumOutput = "./output/enums"
  dtoAsClass     = "true"
  entityAsClass  = "true"
}
```

### Configuration and CLI Options

You can configure the generator both through your schema.prisma file and via the command line interface. Here are the options available:

- output: The base output directory for generated files.
- useConst: Use const for enum definitions (true or false).
- useMapping: Use @map and @@map annotations for field names (true or false).
- fileNaming: The file naming convention (camelCase or snake_case). Default is camelCase.
- dtoPrefix: Prefix for DTO files.
- entityPrefix: Prefix for Entity files.
- fieldEnumPrefix: Prefix for Field Enum files.
- dtoSuffix: Suffix for DTO files.
- entitySuffix: Suffix for Entity files.
- fieldEnumSuffix: Suffix for Field Enum files.
- dtoOutput: Output directory for DTO files.
- entityOutput: Output directory for Entity files.
- fieldEnumOutput: Output directory for Field Enum files.
- dtoAsClass: Generate DTOs as classes or const objects (true or false). Default is true.
- entityAsClass: Generate Entities as classes or const objects (true or false). Default is true.

### CLI Options

- `-s, --schema <path>`: Path to your Prisma schema file.
- `-o, --output <path>`: Output directory for generated files. Default is ./generated.
- `-c, --const`: Use const for enum definitions.
- `--use-mapping`: Use @map and @@map annotations for field names.
- `-dto-prefix <prefix>`: Prefix for DTO files.
- `--entity-prefix <prefix>`: Prefix for Entity files.
- `--field-enum-prefix <prefix>`: Prefix for Field Enum files.
- `--dto-suffix <suffix>`: Suffix for DTO files.
- `--entity-suffix <suffix>`: Suffix for Entity files.
- `--field-enum-suffix <suffix>`: Suffix for Field Enum files.
- `--dto-output <path>`: Output directory for DTO files.
- `--entity-output <path>`: Output directory for Entity files.
- `--field-enum-output <path>`: Output directory for Field Enum files.
- `--dto-as-class <true|false>`饿: Generate DTOs as classes or const objects. Default is true.
- `--entity-as-class <true|false>`: Generate Entities as classes or const objects. Default is true.

#### Examples

##### Generate enum files from a Prisma schema:

```bash
prisma-schema-enum-generator -s path/to/schema.prisma -o path/to/output
```

##### Generate enums with database table names and using const:

```bash
prisma-schema-enum-generator -s path/to/schema.prisma -o path/to/output --db-name --const
```

### Generated Files

- Each table in the schema will have its own enum definition file.
- A `tables.ts` file will contain enum definitions for all tables.

## Development

### Setting Up

1. Clone the repository:

```bash
 git clone https://github.com/your/repo.git
 cd prisma-schema-enum-generator
```

2. Install dependencies:

```bash
 npm install
```

### Running Tests

```bash
npm test
```

### Contributing

Feel free to submit issues or pull requests if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
