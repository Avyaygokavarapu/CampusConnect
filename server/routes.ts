import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPostSchema, insertPollSchema, insertPollOptionSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication first
  setupAuth(app);

  // Helper to ensure user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  // Posts
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid ID");
    
    const post = await storage.getPost(id);
    if (!post) return res.status(404).send("Post not found");
    
    const comments = await storage.getComments(id);
    res.json({ ...post, comments });
  });

  app.post("/api/posts", requireAuth, async (req, res) => {
    const parsed = insertPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const post = await storage.createPost({
      ...parsed.data,
      authorId: (req.user as any).id,
    });
    res.status(201).json(post);
  });

  app.post("/api/posts/:id/like", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid ID");

    const post = await storage.likePost(id);
    if (!post) return res.status(404).send("Post not found");
    
    res.json(post);
  });

  // Comments
  app.get("/api/posts/:id/comments", async (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).send("Invalid Post ID");
    
    const comments = await storage.getComments(postId);
    res.json(comments);
  });

  app.post("/api/posts/:id/comments", requireAuth, async (req, res) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).send("Invalid Post ID");
    
    // Pass parentId through if it exists
    const parsed = insertCommentSchema.safeParse({ ...req.body, postId });
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const comment = await storage.createComment({
      ...parsed.data,
      authorId: (req.user as any).id,
    });
    res.status(201).json(comment);
  });

  // Polls
  app.get("/api/polls", async (_req, res) => {
    const polls = await storage.getPolls();
    res.json(polls);
  });

  app.get("/api/polls/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid ID");

    const poll = await storage.getPoll(id);
    if (!poll) return res.status(404).send("Poll not found");
    
    res.json(poll);
  });

  app.post("/api/polls", requireAuth, async (req, res) => {
    // Expect body to contain poll data AND options array
    const { options, ...pollData } = req.body;
    
    const parsedPoll = insertPollSchema.safeParse(pollData);
    if (!parsedPoll.success) {
      return res.status(400).json(parsedPoll.error);
    }
    
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).send("Poll must have at least 2 options");
    }

    const validOptions: string[] = [];
    for (const optionText of options) {
       if (typeof optionText === 'string' && optionText.trim().length > 0) {
         validOptions.push(optionText);
       }
    }

    if (validOptions.length < 2) {
      return res.status(400).send("Poll must have at least 2 valid options");
    }

    try {
      const poll = await storage.createPollWithOptions({
        ...parsedPoll.data,
        authorId: (req.user as any).id,
      }, validOptions);

      res.status(201).json(poll);
    } catch (error) {
      console.error("Poll creation failed:", error);
      res.status(500).send("Failed to create poll");
    }
  });

  app.post("/api/polls/vote/:optionId", requireAuth, async (req, res) => {
    const optionId = parseInt(req.params.optionId);
    if (isNaN(optionId)) return res.status(400).send("Invalid Option ID");

    const updatedOption = await storage.votePollOption(optionId);
    if (!updatedOption) return res.status(404).send("Option not found");

    res.json(updatedOption);
  });

  return httpServer;
}
