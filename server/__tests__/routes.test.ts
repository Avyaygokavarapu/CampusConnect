import express from "express";
import session from "express-session";
import supertest from "supertest";
import { registerRoutes } from "../routes";
import { storage } from "../storage";
import { createServer } from "http";

// Mock the storage module
jest.mock("../storage", () => {
  const session = require("express-session");
  const MemoryStore = require("memorystore")(session);
  
  return {
    storage: {
      getUser: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      getPosts: jest.fn(),
      getPost: jest.fn(),
      createPost: jest.fn(),
      likePost: jest.fn(),
      getComments: jest.fn(),
      createComment: jest.fn(),
      getPolls: jest.fn(),
      getPoll: jest.fn(),
      createPoll: jest.fn(),
      createPollOption: jest.fn(),
      votePollOption: jest.fn(),
      sessionStore: new MemoryStore({ checkPeriod: 86400000 }),
    },
  };
});

describe("API Routes", () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    server = httpServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Auth Routes", () => {
    it("should register a new user", async () => {
      (storage.getUserByUsername as jest.Mock).mockResolvedValue(undefined);
      (storage.getUserByEmail as jest.Mock).mockResolvedValue(undefined);
      (storage.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword", // Mocked implementation handles hashing but we mock the result
        createdAt: new Date(),
      });
      // Mock getUser for deserializeUser
      (storage.getUser as jest.Mock).mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
      });

      const res = await supertest(app)
        .post("/api/register")
        .send({
          username: "testuser",
          password: "password123",
          email: "test@example.com",
          fullName: "Test User",
          avatar: "avatar.png",
          bio: "Hello",
          role: "student"
        });

      expect(res.status).toBe(201);
      expect(res.body.username).toBe("testuser");
      expect(storage.createUser).toHaveBeenCalled();
    });

    it("should fail to register if username exists", async () => {
      (storage.getUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });
      
      const res = await supertest(app)
        .post("/api/register")
        .send({
          username: "existinguser",
          password: "password123",
          email: "test@example.com",
          fullName: "Test User",
          role: "student"
        });

      expect(res.status).toBe(400);
      expect(res.text).toBe("Username already exists");
    });
  });

  describe("Post Routes", () => {
    it("should get all posts", async () => {
      const mockPosts = [
        { id: 1, title: "Post 1", author: "user1", commentCount: 0 },
        { id: 2, title: "Post 2", author: "user2", commentCount: 2 },
      ];
      (storage.getPosts as jest.Mock).mockResolvedValue(mockPosts);

      const res = await supertest(app).get("/api/posts");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockPosts);
      expect(storage.getPosts).toHaveBeenCalled();
    });

    it("should create a post when authenticated", async () => {
        // First authenticate
        // Since mocking passport authentication across requests in supertest is tricky without an agent and real session store, 
        // we can mock the middleware or use a specialized test for authorized routes.
        // However, since we are using a MemoryStore and the same app instance, we can try to "login" first.
        
        // Mock user for login
        const mockUser = {
            id: 1,
            username: "testuser",
            password: "hashedpassword", // Only used for comparison if we were using real auth logic, but we mocked createUser
            role: "student"
        };
        // Mock getUser for deserializeUser
        (storage.getUser as jest.Mock).mockResolvedValue(mockUser);
        
        // Manually create a session or simulate login
        // Let's rely on the register test which logs the user in.
        // We need to use `supertest.agent` to persist cookies.
        const agent = supertest.agent(app);

        // Setup register mocks again for the agent flow
        (storage.getUserByUsername as jest.Mock).mockResolvedValue(undefined);
        (storage.getUserByEmail as jest.Mock).mockResolvedValue(undefined);
        (storage.createUser as jest.Mock).mockResolvedValue(mockUser);

        await agent
            .post("/api/register")
            .send({
                username: "testuser",
                password: "password123",
                email: "test@example.com",
                fullName: "Test User",
                role: "student"
            });
            
        // Now create post
        (storage.createPost as jest.Mock).mockResolvedValue({
            id: 1,
            title: "New Post",
            content: "Content",
            authorId: 1
        });

        const res = await agent
            .post("/api/posts")
            .send({
                title: "New Post",
                content: "Content",
                type: "discussion",
                category: "general"
            });

        expect(res.status).toBe(201);
        expect(storage.createPost).toHaveBeenCalledWith(expect.objectContaining({
            title: "New Post",
            content: "Content",
            authorId: 1
        }));
    });

    it("should reject post creation when unauthenticated", async () => {
        const res = await supertest(app)
            .post("/api/posts")
            .send({
                title: "New Post",
                content: "Content",
                type: "discussion",
                category: "general"
            });
            
        expect(res.status).toBe(401);
    });
  });
});
