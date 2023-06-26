import { QueryOptions, Tags } from "../../types/enum";

export const getUserByIdSwaggerOptions = (tags: Tags[] = []) => ({
  schema: {
    tags,
    summary: "Get user by ID",
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
    response: {
      200: {
        description: "Successful response",
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
      400: {
        description: "Invalid ID",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      404: {
        description: "User not found",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      500: {
        description: "Error retrieving user",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
});

export const getUsersSwaggerOptions = (tags: Tags[] = []) => ({
  schema: {
    tags,
    summary: "Get all users",
    querystring: {
      type: "object",
      properties: {
        page: { type: "integer", minimum: 1, default: 1 },
        offset: { type: "integer", minimum: 0 },
        limit: {
          type: "integer",
          minimum: QueryOptions.MINIMUM_LIMIT_OF_LIST,
          default: 10,
          maximum: QueryOptions.MAXIMUM_LIMIT_OF_LIST,
        },
      },
    },
    response: {
      200: {
        description: "Successful response",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
      500: {
        description: "Error retrieving users",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
});

export const createUserSwaggerOptions = (tags: Tags[] = []) => ({
  schema: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" },
      },
      required: ["name", "email", "password"],
    },
    tags,
    summary: "Create a new user",
    response: {
      201: {
        description: "User created successfully",
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      400: {
        description: "Invalid request body",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      500: {
        description: "Error creating user",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
});

export const updateUserSwaggerOptions = (tags: Tags[] = []) => ({
  schema: {
    tags,
    summary: "Update an existing user",
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
      },
    },
    response: {
      200: {
        description: "User updated successfully",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      400: {
        description: "Invalid request body or ID",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      500: {
        description: "Error updating user",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
});

export const deleteUserSwaggerOptions = (tags: Tags[] = []) => ({
  schema: {
    tags,
    summary: "Delete an existing user",
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
    response: {
      200: {
        description: "User deleted successfully",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      400: {
        description: "Invalid ID",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      500: {
        description: "Error deleting user",
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
});
