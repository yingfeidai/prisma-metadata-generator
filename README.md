# Prisma Schema Enum Generator

This tool generates TypeScript enum or const definitions for Prisma models based on a given Prisma schema file.

## Installation

```bash
npm install prisma-schema-enum-generator
```

## Usage

### CLI Options

- `-s, --schema <path>`: Path to your Prisma schema file.
- `-o, --output <path>`: Output directory for generated files. Default is `./generated`.
- `-c, --const`: Use const for enum definitions.
- `--use-mapping`: Use @map and @@map annotations for field names.
- `--db-name`: Include database table name in enum generation.
- `--file-case <case>`: File name case style: `kebab-case` | `PascalCase`. Default is `kebab-case`.

#### Examples

##### Generate enum files from a Prisma schema:

```bash
prisma-schema-enum-generator -s path/to/schema.prisma -o path/to/output
```

##### Generate enums with database table names and using const:

```bash
prisma-schema-enum-generator -s path/to/schema.prisma -o path/to/output --db-name --const
```

### Prisma Generator Options

Add the generator to your schema.prisma file:

```prisma
generator fieldsEnums {
  provider = "prisma-fields-enums-generator"
  output   = "./generated"
  useConst = true
  useMapping = true
  fileNaming = "camelCase"
  prefix = "Prefix"
}
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

Contributions are welcome! Please open issues and pull requests on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
