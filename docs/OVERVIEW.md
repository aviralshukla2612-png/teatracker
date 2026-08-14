# TeaTrack Overview

TeaTrack is a comprehensive Expense Tracker application designed specifically to monitor daily office consumption of tea and coffee. The system is split into a robust Laravel backend API and a modern, responsive React frontend.

## Technology Stack

### Frontend (`/teatrack`)
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM
- **Styling**: Plain CSS with CSS Variables for theming (Mobile-first, Responsive)
- **HTTP Client**: Axios (with interceptors for auth tokens)

### Backend (`/teatrack-api`)
- **Framework**: Laravel 11/12
- **Database**: SQLite (Development) / MySQL (Production)
- **Authentication**: Laravel Sanctum (Token-based)
- **Architecture**: Service Repository Pattern (Controllers handle HTTP, Services handle business logic)

## Key Features
- **Role-Based Access Control**: Differentiates between `Super Admin` and `Sub Admin`.
- **Dynamic Rates**: Super Admins can update the cost per cup of tea/coffee. Historical entries preserve the rates at the time they were created.
- **Monthly Summaries**: Automatically generates metrics and charts per month.
- **Exporting**: Allows exporting data as CSV (Excel) or PDF.
