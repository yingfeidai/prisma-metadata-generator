import { SchemaParser } from "../../../src/core/domain/services/SchemaParser";

const mockSchema = `
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}

model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
  author  User    @relation(fields: [authorId], references: [id])
  authorId Int
}
`;

const mockSchemaWithMappings = `
model User {
  id    Int     @id @default(autoincrement())
  name  String  @map("user_name")
  email String  @unique
  @@map("users")
}

model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
  author  User    @relation(fields: [authorId], references: [id])
  authorId Int
  @@map("posts")
}
`;

const mockInvalidSchema = `
model User {
  id Int @id @default(autoincrement())
  name String
  email String @unique
  // missing closing bracket here
`;

const mockSchemaWithComplexTypes = `
model Profile {
  id      Int      @id @default(autoincrement())
  bio     String?
  isActive Boolean @default(true)
  birthDate DateTime
  ratings Float[]
}
`;

const mockSchemaWithoutFields = `
model EmptyModel {
  id Int @id @default(autoincrement())
}
`;

describe("SchemaParser", () => {
  const parser = new SchemaParser();

  it("should parse schema correctly without mappings", () => {
    const result = parser.parse(mockSchema, false);

    expect(result).toEqual({
      tables: ["User", "Post"],
      mappings: {
        User: [
          { name: "id", type: "Int" },
          { name: "name", type: "String" },
          { name: "email", type: "String" },
        ],
        Post: [
          { name: "id", type: "Int" },
          { name: "title", type: "String" },
          { name: "content", type: "String?" },
          { name: "authorId", type: "Int" },
        ],
      },
    });
  });

  it("should parse schema correctly with mappings", () => {
    const result = parser.parse(mockSchemaWithMappings, true);

    expect(result).toEqual({
      tables: ["users", "posts"],
      mappings: {
        users: [
          { name: "id", type: "Int" },
          { name: "user_name", type: "String" },
          { name: "email", type: "String" },
        ],
        posts: [
          { name: "id", type: "Int" },
          { name: "title", type: "String" },
          { name: "content", type: "String?" },
          { name: "authorId", type: "Int" },
        ],
      },
    });
  });

  it("should parse schema correctly with mappings disabled", () => {
    const result = parser.parse(mockSchemaWithMappings, false);

    expect(result).toEqual({
      tables: ["User", "Post"],
      mappings: {
        User: [
          { name: "id", type: "Int" },
          { name: "name", type: "String" },
          { name: "email", type: "String" },
        ],
        Post: [
          { name: "id", type: "Int" },
          { name: "title", type: "String" },
          { name: "content", type: "String?" },
          { name: "authorId", type: "Int" },
        ],
      },
    });
  });

  it("should handle complex field types", () => {
    const result = parser.parse(mockSchemaWithComplexTypes, false);

    expect(result).toEqual({
      tables: ["Profile"],
      mappings: {
        Profile: [
          { name: "id", type: "Int" },
          { name: "bio", type: "String?" },
          { name: "isActive", type: "Boolean" },
          { name: "birthDate", type: "DateTime" },
          { name: "ratings", type: "Float[]" },
        ],
      },
    });
  });

  it("should handle a model without fields", () => {
    const result = parser.parse(mockSchemaWithoutFields, false);

    expect(result).toEqual({
      tables: ["EmptyModel"],
      mappings: {
        EmptyModel: [{ name: "id", type: "Int" }],
      },
    });
  });

  it("should throw an error for invalid schema", () => {
    expect(() => parser.parse(mockInvalidSchema, false)).toThrow();
  });

  it("should return empty result for empty schema", () => {
    const result = parser.parse("", false);

    expect(result).toEqual({
      tables: [],
      mappings: {},
    });
  });
});
