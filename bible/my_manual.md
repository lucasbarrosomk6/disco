# My Manual

This document outlines specific maintenance and development tasks that can be performed on the project. When instructed to "perform a maintenance sweep," refer to these tasks.

## Documentation Job

1. For each file in the app, create or update a corresponding `fileName_doc.md` file
2. In each `fileName_doc.md`, include:
   - The problem the file solves
   - How it solves that problem
   - Other files it relies on
   - Whether it needs tests
   - A list of local files it imports from
3. Use solution-based wording in the documentation
4. Ensure the project README.md is up-to-date
5. Review and update any API documentation (excluding external APIs)
6. Handle 5 new files per prompt from the user
7. Update the `my_manual_documentation_notes.ts` file with:
   - List of files written
   - Last update timestamp for each file
   - Additional metadata as needed
8. Update relevant job notes in this manual after completing the documentation task

## Testing Job

1. Review the `fileName_doc.md` for the file in question
   - If the doc file doesn't exist, request it as context
2. Based on the documentation, write new test cases or update existing ones
3. Focus on unit tests for individual functions and components
4. Write integration tests for critical user flows
5. Aim for comprehensive test coverage of the file's functionality
6. Do not include tests that interact with external APIs (except our own database)
7. Update relevant job notes in this manual after completing the testing task

## Task Tracking Job

1. Review the current task list
2. Update the status of completed tasks
3. Add new tasks based on recent development and documentation
4. Prioritize tasks for the next development phase
5. Identify and log any blockers or dependencies
6. Update time estimates for remaining tasks
7. Create subtasks for complex items to improve tracking
8. Update relevant job notes in this manual after completing the task tracking job

### Assumed Tasks for Customer Readiness
1. Implement user onboarding flow
2. Set up error logging and monitoring
3. Perform security audit (focusing on our own code and database)
4. Optimize database queries for improved performance
5. Implement data backup and recovery procedures
6. Create user documentation and help center
7. Set up customer support channels
8. Conduct usability testing with beta users
9. Implement analytics to track key metrics (using our own systems)
10. Ensure GDPR and other relevant compliance measures are in place

## Performance Optimization Job

1. Analyze and optimize database queries
2. Implement code splitting for faster initial load times
3. Review and optimize component rendering
4. Identify and resolve any memory leaks
5. Optimize asset loading and management
6. Update relevant job notes in this manual after completing the performance optimization job

## Security Audit Job

1. Review authentication and authorization mechanisms
2. Check for proper input validation and sanitization
3. Ensure all API endpoints are properly secured
4. Verify that sensitive data is encrypted at rest and in transit
5. Conduct a dependency audit and update any packages with known vulnerabilities
6. Update relevant job notes in this manual after completing the security audit job

## Accessibility Check Job

1. Review keyboard navigation throughout the application
2. Verify proper use of ARIA attributes
3. Check color contrast ratios for all text elements
4. Ensure all images have appropriate alt text
5. Verify that form inputs have associated labels
6. Update relevant job notes in this manual after completing the accessibility check job

## Code Quality Job

1. Run linter and fix any warnings or errors
2. Conduct a code review to identify and refactor any complex or unclear code
3. Check for and remove any dead code
4. Ensure consistent coding style across the project
5. Optimize imports and remove unused dependencies
6. Update relevant job notes in this manual after completing the code quality job

When instructed to perform a maintenance sweep, systematically go through each of these jobs, focusing on the areas that are most relevant to the current state of the project. Remember to always refer to and update the corresponding `fileName_doc.md` files during these tasks, and update the relevant job notes in this manual after completing each task.