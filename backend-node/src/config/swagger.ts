import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Security AI Platform API",
      version: "1.0.0",
      description: "API for authentication, audit logs, suspicious event analysis, alerts and dashboard metrics."
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with brute-force protection",
          responses: { "200": { description: "Authenticated" }, "401": { description: "Invalid credentials" }, "423": { description: "Temporarily locked" } }
        }
      },
      "/auth/forgot-password": {
        post: {
          tags: ["Auth"],
          summary: "Create a temporary reset token",
          responses: { "200": { description: "Reset token generated" } }
        }
      },
      "/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Reset password using a temporary token",
          responses: { "200": { description: "Password updated" }, "400": { description: "Invalid token" } }
        }
      },
      "/users": {
        get: { tags: ["Users"], security: [{ bearerAuth: [] }], summary: "List users", responses: { "200": { description: "Users" } } },
        post: { tags: ["Users"], security: [{ bearerAuth: [] }], summary: "Create user", responses: { "201": { description: "Created" } } }
      },
      "/users/{id}": {
        delete: { tags: ["Users"], security: [{ bearerAuth: [] }], summary: "Soft delete user", responses: { "200": { description: "Disabled" } } }
      },
      "/events": {
        get: { tags: ["Events"], security: [{ bearerAuth: [] }], summary: "List security events", responses: { "200": { description: "Events" } } },
        post: { tags: ["Events"], security: [{ bearerAuth: [] }], summary: "Create event and calculate risk", responses: { "201": { description: "Created" } } }
      },
      "/alerts": {
        get: { tags: ["Alerts"], security: [{ bearerAuth: [] }], summary: "List alerts", responses: { "200": { description: "Alerts" } } }
      },
      "/audit": {
        get: { tags: ["Audit"], security: [{ bearerAuth: [] }], summary: "List audit logs", responses: { "200": { description: "Audit logs" } } }
      },
      "/dashboard": {
        get: { tags: ["Dashboard"], security: [{ bearerAuth: [] }], summary: "Get security dashboard metrics", responses: { "200": { description: "Dashboard" } } }
      }
    }
  },
  apis: []
});
