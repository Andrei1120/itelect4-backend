/**
 * Backend route test: GET /api/submissions
 *
 * Tests the route that sits behind requireAuth:
 *  - 401 with no token
 *  - 200 (past requireAuth) with a valid JWT
 *
 * connectDB is mocked so no real MongoDB connection is needed.
 * The Submission model is also mocked so no data is needed.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// ── Mock connectDB BEFORE importing app ──────────────────────────────────────
// app.ts calls connectDB() in a global middleware. Mocking it here replaces
// the real function with a no-op so no MongoDB connection is attempted.
vi.mock("../src/config/db.js", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

// Mock the Submission model so .find() never touches a real DB
vi.mock("../src/models/Submission.js", () => ({
  Submission: {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockResolvedValue([]),
    }),
  },
}));

// ── Import app AFTER mocks are in place ──────────────────────────────────────
import { app } from "../src/app.js";

// A JWT signed with the same secret the middleware uses
const JWT_SECRET = "test_secret_for_vitest";

function makeToken(userId = "abc123def456abc123def456"): string {
  return jwt.sign({ userId }, JWT_SECRET);
}

describe("GET /api/submissions — requireAuth guard", () => {
  beforeAll(() => {
    // Make sure the middleware's jwt.verify sees the same secret
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.CORS_ORIGIN = "http://localhost:5173";
  });

  it("returns 401 when no Authorization header is sent", async () => {
    const res = await request(app).get("/api/submissions");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 401 when the token is invalid", async () => {
    const res = await request(app)
      .get("/api/submissions")
      .set("Authorization", "Bearer this.is.not.valid");
    expect(res.status).toBe(401);
  });

  it("returns 200 and an array when a valid token is provided", async () => {
    const token = makeToken();
    const res = await request(app)
      .get("/api/submissions")
      .set("Authorization", `Bearer ${token}`);
    // The mock model returns [] so this is 200 with an empty array
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
