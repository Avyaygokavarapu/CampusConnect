# CampusConnect User Stories

This document outlines the key user stories and features for the CampusConnect application, serving as a knowledge base for the project's functionality.

## Authentication
- **Sign Up**: As a new user, I can create an account with a username and password so that I can access personalized features.
- **Log In**: As a returning user, I can log in to my account to access my profile and interact with content.

## Content Creation & Interaction
- **Create Post**: As a user, I can create new text-based posts to share my thoughts with the community.
- **View Feed**: As a user, I can view a chronological feed of posts and polls from other users.
- **View Post Details**: As a user, I can click on a post to view its full details, including comments (mocked) and engagement metrics.
- **Like Post**: As a user, I can like a post to show my appreciation.
- **View Engagement**: As a user, I can see the number of likes, reposts, and comments on each post.

## Polls & Predictions
- **View Polls**: As a user, I can see polls mixed into my feed.
- **View Poll Options**: As a user, I can view the different options available for voting in a poll.
- **Prediction Markets**: As a user, I can identify special "Prediction Market" polls that allow for forecasting outcomes.
- **Poll Status**: As a user, I can see the total number of votes and the time remaining for a poll.

## Navigation & Discovery
- **Navigation Bar**: As a user, I can use the bottom navigation (on mobile) or sidebar to switch between Home, Create, Trending, and Profile sections.
- **Trending**: As a user, I can access a "Trending" section to see popular content (currently routes to Home).
- **Profile**: As a user, I can access my profile page (currently routes to Home).

## User Experience
- **Responsive Design**: As a user, I can access the application on both mobile and desktop devices with an optimized layout.
- **Visual Feedback**: As a user, I receive visual feedback (animations, toasts) when performing actions like liking a post or submitting content.
- **Modern UI**: As a user, I enjoy a modern, aesthetic interface ("Cyberpunk/Glassmorphism" style) with glass-card effects and smooth transitions.

## Technical Context (Current State)
- **Data Persistence**: Currently, the application uses in-memory storage, meaning data may reset on server restarts. A PostgreSQL database schema is defined for future persistent storage.
- **Mock Data**: The home feed currently displays mock data for demonstration purposes.
