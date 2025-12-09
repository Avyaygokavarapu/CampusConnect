import "dotenv/config";
import { db } from "./db";
import { users, posts, polls, pollOptions, comments } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(comments);
  await db.delete(pollOptions);
  await db.delete(polls);
  await db.delete(posts);
  await db.delete(users);

  // Create Users
  const password = await hashPassword("password123");
  
  const userList = [
    { username: "cyber_goth", email: "cyber_goth@campus.edu", password },
    { username: "campus_oracle", email: "oracle@campus.edu", password },
    { username: "trend_watcher", email: "trends@campus.edu", password },
    { username: "glitch_witch", email: "glitch@campus.edu", password },
    { username: "neuro_punk", email: "neuro@campus.edu", password },
    { username: "null_ptr", email: "null@campus.edu", password },
  ];

  const createdUsers = await db.insert(users).values(userList).returning();
  const userMap = new Map(createdUsers.map(u => [u.username, u.id]));

  // Create Posts
  const postsData = [
    {
      content: "Just saw the future in a dream. It was made of chrome and silence. 🌌",
      authorId: userMap.get("cyber_goth")!,
      likes: 42,
      reposts: 5,
    },
    {
      content: "The algorithm is feeling particularly moody today. Anyone else getting weird recommendations?",
      authorId: userMap.get("glitch_witch")!,
      likes: 128,
      reposts: 32,
    },
    {
      content: "Trying to debug my own thoughts like 01001011 001... 😵‍💫",
      authorId: userMap.get("null_ptr")!,
      likes: 892,
      reposts: 104,
    },
  ];

  await db.insert(posts).values(postsData);

  // Create Polls
  const poll1 = await db.insert(polls).values({
    question: "Will finals be postponed due to the heatwave?",
    authorId: userMap.get("campus_oracle")!,
    isPrediction: true,
    totalVotes: 600,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  }).returning();

  await db.insert(pollOptions).values([
    { pollId: poll1[0].id, text: "Yes", votes: 150 },
    { pollId: poll1[0].id, text: "No", votes: 450 },
  ]);

  const poll2 = await db.insert(polls).values({
    question: "What is the best aesthetic for 2025?",
    authorId: userMap.get("trend_watcher")!,
    isPrediction: false,
    totalVotes: 645,
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
  }).returning();

  await db.insert(pollOptions).values([
    { pollId: poll2[0].id, text: "Solarpunk 🌱", votes: 124 },
    { pollId: poll2[0].id, text: "Dark Futurism 🌑", votes: 432 },
    { pollId: poll2[0].id, text: "Y2K Glitch 👾", votes: 89 },
  ]);

  const poll3 = await db.insert(polls).values({
    question: "Should we upload our consciousness?",
    authorId: userMap.get("neuro_punk")!,
    isPrediction: false,
    totalVotes: 350,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
  }).returning();

  await db.insert(pollOptions).values([
    { pollId: poll3[0].id, text: "Yes, immediately 🧠", votes: 200 },
    { pollId: poll3[0].id, text: "No, stay organic 🥩", votes: 150 },
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
