# Testing Manual

This document outlines the testing strategy and notes for the project.

## Products API Testing

### File: disco/app/api/products/[id]/route.test.ts

This file contains tests for the individual product API routes (GET, PUT, DELETE).

Test cases:
1. GET method:
   - Should return a product template when id is "add"
   - Should return a product when given a valid id
   - Should return 404 when product is not found

2. PUT method:
   - Should create a new product when id is "add"
   - Should update an existing product

3. DELETE method:
   - Should delete a product
   - Should return 404 when product to delete is not found

### File: disco/app/api/products/route.test.ts

This file contains tests for the products list API routes (POST, GET).

Test cases:
1. POST method:
   - Should create a new product

2. GET method:
   - Should return all products for the user
   - Should handle keyFeatures parsing errors

## Testing Strategy

1. Unit Tests:
   - Focus on testing individual functions and components in isolation
   - Mock external dependencies (e.g., database, authentication)
   - Ensure high coverage of edge cases and error handling

2. Integration Tests:
   - Test the interaction between different parts of the application
   - Ensure API routes work correctly with the database and authentication

3. End-to-End Tests:
   - Simulate user interactions to test complete user flows
   - Ensure all parts of the application work together as expected

## Test Environment Setup

1. Use Jest as the testing framework
2. Set up mock functions for external dependencies (e.g., database, authentication)
3. Use `next/jest` for Next.js specific configurations

## Continuous Integration

1. Run tests automatically on each pull request
2. Ensure all tests pass before merging code into the main branch

## Test Maintenance

1. Regularly review and update tests as the application evolves
2. Remove or update obsolete tests
3. Add new tests for new features or uncovered edge cases

Last updated: 2024-03-22T15:45:00Z