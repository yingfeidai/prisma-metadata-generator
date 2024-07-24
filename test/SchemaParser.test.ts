import { SchemaParser } from "../src/core/domain/services/SchemaParser";

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
});
