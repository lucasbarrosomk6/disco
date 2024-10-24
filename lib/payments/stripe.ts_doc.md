# Stripe Integration Documentation

## Problem Solved
This file handles all Stripe-related operations for the application's payment system.

## Solution
It provides functions for creating checkout sessions, managing customer portal sessions, handling subscription changes, and fetching Stripe products and prices.

## Dependencies
- stripe: The official Stripe library for Node.js
- next/navigation: For redirection
- Environment variables: For Stripe API key and base URL

## Testing Needs
- Unit tests for each exported function
- Integration tests with Stripe's test mode
- Mock tests for Stripe API responses
- Error handling tests for various Stripe-related scenarios

## Notes
- Ensure that all sensitive information (like Stripe API keys) is properly secured
- Implement proper error handling and logging for Stripe operations
- Keep the Stripe library updated to the latest version for security and feature improvements

## Local Imports
- `@/lib/db/schema`: For Team type
- `@/lib/db/queries`: For database operations related to teams and subscriptions