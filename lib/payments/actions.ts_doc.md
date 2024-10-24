# Payment Actions Documentation

## Problem Solved
This file provides server actions for handling Stripe checkout and customer portal operations.

## Solution
It exports two server actions: `checkoutAction` and `customerPortalAction`, which are wrapped with team authentication middleware.

## Dependencies
- next/navigation: For redirection
- Stripe integration functions from './stripe'
- Authentication middleware from '@/lib/auth/middleware'

## Testing Needs
- Unit tests for each action
- Integration tests with Stripe's test mode
- Tests for authentication and authorization scenarios
- Error handling tests

## Notes
- Ensure that these actions are only called from appropriate client-side components
- Implement proper error handling and user feedback for failed actions
- Consider rate limiting these actions to prevent abuse

## Local Imports
- './stripe': For Stripe-related functions
- '@/lib/auth/middleware': For the `withTeam` middleware