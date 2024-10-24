# Database Queries Documentation

## Problem Solved
This file provides a set of database query functions for various operations in the application.

## Solution
It exports functions for user authentication, team management, activity logging, and plan information retrieval.

## Dependencies
- drizzle-orm: For database queries
- next/headers: For accessing cookies
- Environment variables: For authentication secret

## Testing Needs
- Unit tests for each query function
- Integration tests with a test database
- Performance tests for complex queries
- Error handling tests for various scenarios (e.g., user not found, invalid session)

## Notes
- Ensure that all queries are optimized for performance
- Implement proper error handling and logging for database operations
- Consider adding caching for frequently accessed data

## Local Imports
- './drizzle': For the database connection
- './schema': For the database schema
- '@/lib/auth/session': For token verification
- '@/lib/plan': For PlanInfo type