import { 
  type User, type InsertUser, 
  type Post, type InsertPost, 
  type Poll, type InsertPoll,
  type PollOption, type InsertPollOption,
  type Comment, type InsertComment,
  users, posts, polls, pollOptions, comments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, inArray } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface PostWithAuthor extends Post {
  author: string;
  commentCount?: number;
}

export interface PollWithAuthor extends Poll {
  author: string;
  options: PollOption[];
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Posts
  createPost(post: InsertPost & { authorId: number }): Promise<Post>;
  getPosts(): Promise<PostWithAuthor[]>;
  getPost(id: number): Promise<PostWithAuthor | undefined>;
  likePost(id: number): Promise<Post | undefined>;

  // Polls
  createPoll(poll: InsertPoll & { authorId: number }): Promise<Poll>;
  createPollOption(option: InsertPollOption): Promise<PollOption>;
  createPollWithOptions(poll: InsertPoll & { authorId: number }, options: string[]): Promise<PollWithAuthor>;
  getPolls(): Promise<PollWithAuthor[]>;
  getPoll(id: number): Promise<PollWithAuthor | undefined>;
  votePollOption(optionId: number): Promise<PollOption | undefined>;

  // Comments
  createComment(comment: InsertComment & { authorId: number }): Promise<Comment>;
  getComments(postId: number): Promise<(Comment & { author: string })[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Posts
  async createPost(post: InsertPost & { authorId: number }): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPosts(): Promise<PostWithAuthor[]> {
    const result = await db.select({
      post: posts,
      author: users.username,
      commentCount: sql<number>`count(${comments.id})`.mapWith(Number),
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(comments, eq(comments.postId, posts.id))
    .groupBy(posts.id, users.username, users.id)
    .orderBy(desc(posts.createdAt));

    return result.map(row => ({
      ...row.post,
      author: row.author || "Unknown",
      commentCount: row.commentCount || 0
    }));
  }

  async getPost(id: number): Promise<PostWithAuthor | undefined> {
    const [result] = await db.select({
      post: posts,
      author: users.username,
      commentCount: sql<number>`count(${comments.id})`.mapWith(Number),
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(comments, eq(comments.postId, posts.id))
    .where(eq(posts.id, id))
    .groupBy(posts.id, users.username, users.id);

    if (!result) return undefined;

    return {
      ...result.post,
      author: result.author || "Unknown",
      commentCount: result.commentCount || 0
    };
  }

  async likePost(id: number): Promise<Post | undefined> {
    const [updatedPost] = await db
      .update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, id))
      .returning();
      
    return updatedPost;
  }

  // Polls
  async createPoll(poll: InsertPoll & { authorId: number }): Promise<Poll> {
    const [newPoll] = await db.insert(polls).values(poll).returning();
    return newPoll;
  }

  async createPollOption(option: InsertPollOption): Promise<PollOption> {
    const [newOption] = await db.insert(pollOptions).values(option).returning();
    return newOption;
  }

  async createPollWithOptions(pollData: InsertPoll & { authorId: number }, options: string[]): Promise<PollWithAuthor> {
    return await db.transaction(async (tx) => {
      const [newPoll] = await tx.insert(polls).values(pollData).returning();
      
      const createdOptions = [];
      for (const optionText of options) {
         const [opt] = await tx.insert(pollOptions).values({
           text: optionText,
           pollId: newPoll.id
         }).returning();
         createdOptions.push(opt);
      }

      // We need to fetch author username too
      const [author] = await tx.select({ username: users.username })
        .from(users)
        .where(eq(users.id, pollData.authorId));

      return {
        ...newPoll,
        author: author?.username || "Unknown",
        options: createdOptions
      };
    });
  }

  async getPolls(): Promise<PollWithAuthor[]> {
    const allPolls = await db.select({
      poll: polls,
      author: users.username,
    })
    .from(polls)
    .leftJoin(users, eq(polls.authorId, users.id))
    .orderBy(desc(polls.createdAt));
    
    if (allPolls.length === 0) return [];

    const pollIds = allPolls.map(p => p.poll.id);
    const options = await db.select().from(pollOptions).where(inArray(pollOptions.pollId, pollIds));
    
    // Group options by pollId
    const optionsMap = new Map<number, PollOption[]>();
    options.forEach(opt => {
      if (!optionsMap.has(opt.pollId)) {
        optionsMap.set(opt.pollId, []);
      }
      optionsMap.get(opt.pollId)?.push(opt);
    });

    return allPolls.map(row => ({ 
      ...row.poll, 
      author: row.author || "Unknown",
      options: optionsMap.get(row.poll.id) || []
    }));
  }

  async getPoll(id: number): Promise<PollWithAuthor | undefined> {
    const [row] = await db.select({
      poll: polls,
      author: users.username,
    })
    .from(polls)
    .leftJoin(users, eq(polls.authorId, users.id))
    .where(eq(polls.id, id));

    if (!row) return undefined;
    
    const options = await db.select().from(pollOptions).where(eq(pollOptions.pollId, row.poll.id));
    return { 
      ...row.poll, 
      author: row.author || "Unknown",
      options 
    };
  }

  async votePollOption(optionId: number): Promise<PollOption | undefined> {
    const [option] = await db.select().from(pollOptions).where(eq(pollOptions.id, optionId));
    if (!option) return undefined;

    // Use atomic increment
    const [updatedOption] = await db
      .update(pollOptions)
      .set({ votes: sql`${pollOptions.votes} + 1` })
      .where(eq(pollOptions.id, optionId))
      .returning();

    // Also update total votes on the poll atomically
    await db
      .update(polls)
      .set({ totalVotes: sql`${polls.totalVotes} + 1` })
      .where(eq(polls.id, option.pollId));

    return updatedOption;
  }

  // Comments
  async createComment(comment: InsertComment & { authorId: number }): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getComments(postId: number): Promise<(Comment & { author: string })[]> {
    const result = await db
      .select({
        comment: comments,
        author: users.username,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);

    return result.map(row => ({
      ...row.comment,
      author: row.author || "Unknown",
      // @ts-ignore
      parentId: row.comment.parentId, 
    }));
  }
}

export const storage = new DatabaseStorage();
