# Database Schema Documentation

## Problem Solved
This file defines the database schema for the application using Drizzle ORM.

## Solution
It exports table definitions, relations, and types for users, teams, team members, activity logs, invitations, and products.

## Dependencies
- drizzle-orm: For defining the database schema
- drizzle-orm/pg-core: For PostgreSQL-specific column types

## Testing Needs
- Validation of schema integrity
- Tests for relation definitions
- Type checks for exported types

## Notes
- Ensure that any schema changes are reflected in the migration files
- Consider using enum types for fields like 'role' and 'status' for better type safety
- Keep the schema in sync with the actual database structure

## Local Imports
None