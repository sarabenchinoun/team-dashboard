# Team Dashboard

## Overview
This project is a staff dashboard for a fictional IT department, designed to streamline staff management and IT requests. It serves as a comprehensive tool for tracking tickets, managing tasks, and facilitating communication within the team.

It features a responsive, type-safe UI with five core pages (Dashboard, Staff Directory, IT Request, Tickets, To-Do List) and advanced functionalities, implemented using Tanstack Router, TypeScript, Tailwind CSS, MSW for mock APIs, shadcn/ui for polished components, and React Query for efficient data fetching.

## Setup Instructions

Clone the Repository:

```git clone <repo-url>```

```cd team-dashboard```


Install Dependencies:

```pnpm install```

Note: The project uses pnpm internally, but npm is compatible for setup. If you prefer to use npm, delete the `pnpm-lock.yaml` file.


Start the Development local server:

```pnpm dev```

- The app will run at http://localhost:3000 (diverted from the default Vite port 5173).
- MSW automatically mocks API endpoints in development mode.


## Pages:

- Dashboard
- Staff Directory
- IT Request
- Tickets
- To-Do List


## Features Completed

### Dashboard:
- Welcome banner with a clean, branded header.
- Summary cards displaying open tickets and pending tasks, fetched via React Query.
- Navigation links to all pages using Tanstack Router.
### Staff Directory:
  - Responsive table listing staff details (Name, Role, Email, Status).
  - Bonus: Displays Google Workspace info (Last Login, Drive Usage, Device Type) from mock API.
  - Pagination (5 items per page) with metadata (total items, pages).
  - Loading skeletons for improved UX during data fetching.
### IT Request: 
  - Form with Issue Type and Status dropdowns (custom Select component), Description textarea, and file input.
  - Async submission to /api/tickets via MSW, with Zod validation for input integrity.
  - File upload support with console logging and Toaster notifications for submission status.
  - Loading spinner and responsive Tailwind styling.
### Tickets:
  - Table listing tickets (Issue Name, Type, Status, etc.) with color-coded status badges.
  - Pagination (5 items per page) with metadata response.
  - Enhanced display with issue type and status mapping.
  - Loading skeletons for smooth UX.
### To-Do List:
  - Add, edit, delete, and fetch tasks via MSW (/api/todos with create, update, delete, get actions).
  - Mark tasks as complete with checkboxes.
  - Loading skeletons and empty state (“No tasks”) for polish.
### Bonus Features: 
  - TypeScript: Type-safe interfaces for Staff, Ticket, and Task, with Tanstack Router’s type-safe routing.
  - Tanstack Router: Client-side, file-based routing for seamless navigation without server-side rendering, with data preloading on hover for better UX.
  - Tailwind CSS: Responsive, utility-first styling across all pages.
  - shadcn/ui: Accessible components (Card, Button, Form, Select, Table, Textarea, Toaster).
  - React Query: Efficient data fetching with useQuery, replacing useEffect for async logic.
  - Zod: Schema validation for IT Request form inputs.
  - UX Enhancements: Skeleton component for loading states, Toaster for notifications, Triangle Alert icon, custom Select component, and Radix UI Tooltip for interactivity.
  - Accessibility: ARIA labels for pagination buttons and form elements, improved input/textarea styling.



## Technical Stack

**Framework**: React with Tanstack Router (file-based, type-safe client-side routing).

**Language**: TypeScript for type safety.

**Styling**: Tailwind CSS for responsive, utility-first design.

**Data**: MSW for mocking API endpoints and simulating realistic responses. Mocking /api/staff, /api/tickets, and /api/todos endpoints.

**Data Fetching**: React Query (useQuery) for efficient, declarative async operations.

**Validation**: Zod for form input validation.
**Components**:  shadcn/ui for polished, accessible UI components (Card, Button, Form, Select, Table, Textarea, Toaster).

**Utilities**: Radix UI for Tooltip, Sonner for Toaster, Faker for mock data seeding.


## Future Improvements

With additional time, I would:

- Add unit tests using Vitest to cover components (e.g., StaffCard, TicketRow, TaskItem).

- Enable downloadable files in the Tickets table for uploaded attachments.

- Add sorting for Staff Directory and Tickets tables by columns (e.g., Name, Status).
