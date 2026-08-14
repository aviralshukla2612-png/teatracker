# API Reference

The Laravel backend provides a RESTful API secured by Laravel Sanctum. All endpoints (except login) require a Bearer token in the `Authorization` header.

## Authentication
- `POST /api/login` - Authenticates a user and returns a Sanctum token.
- `POST /api/logout` - Revokes the current access token.
- `GET /api/user` - Returns the currently authenticated user's profile and role.

## Entries
- `GET /api/entries` - Retrieves a list of entries (filtered by role).
- `POST /api/entries` - Creates a new daily entry. (Sub Admins restricted to current date).
- `GET /api/entries/{id}` - Retrieves a specific entry.
- `PUT /api/entries/{id}` - Updates an existing entry.
- `DELETE /api/entries/{id}` - Deletes an entry.

## Settings & Rates (Super Admin Only)
- `GET /api/settings` - Retrieves the current active rates for tea and coffee.
- `POST /api/settings` - Updates the global rates. (Automatically creates a new snapshot version in the database).

## User Management (Super Admin Only)
- `GET /api/users` - Lists all Sub Admins.
- `POST /api/users` - Creates a new Sub Admin.
- `PUT /api/users/{id}` - Updates a Sub Admin's details (name, email, password, active status).
- `DELETE /api/users/{id}` - Deletes a Sub Admin.
