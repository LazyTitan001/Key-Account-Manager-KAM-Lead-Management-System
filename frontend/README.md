# Lead Management System - Frontend

This is the frontend application for the Lead Management System (LMS). It is built using React and Vite, and it provides a user interface for managing leads, contacts, and interactions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [DevDependencies](#devdependencies)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/lead-management-frontend.git
cd lead-management-frontend
npm install
```

## Usage

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server and you can access the application at `http://localhost:5173`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build.

## Project Structure

```
/src
  /components
    AddLead.jsx
    Dashboard.jsx
    LeadDetail.jsx
    LeadList.jsx
    Navbar.jsx
  /styles
    App.css
  App.jsx
  main.jsx
  index.css
/vite.config.js
/package.json
```

## Dependencies

- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.8.0
- `@headlessui/react`: ^1.7.19
- `@heroicons/react`: ^2.2.0
- `recharts`: ^2.9.0

## DevDependencies

- `vite`: ^6.0.3
- `@vitejs/plugin-react`: ^4.3.4
- `eslint`: ^9.17.0
- `eslint-plugin-react`: ^7.37.2
- `eslint-plugin-react-hooks`: ^5.0.0
- `eslint-plugin-react-refresh`: ^0.4.16
- `@eslint/js`: ^9.17.0
- `@types/react`: ^18.3.17
- `@types/react-dom`: ^18.3.5
- `autoprefixer`: ^10.4.20
- `postcss`: ^8.4.49
- `tailwindcss`: ^3.4.17
- `globals`: ^15.13.0

## Environment Variables

The project uses environment variables to configure different settings. Create a `.env` file in the root directory and add the following variables:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## API Endpoints

The frontend interacts with the backend API to fetch and manipulate data. Here are some of the key endpoints:

- `GET /api/leads`: Fetch all leads.
- `GET /api/leads/:id`: Fetch a specific lead by ID.
- `POST /api/leads`: Create a new lead.
- `GET /api/contacts/lead/:leadId`: Fetch contacts for a specific lead.
- `POST /api/contacts`: Create a new contact.
- `GET /api/interactions/lead/:leadId`: Fetch interactions for a specific lead.
- `POST /api/interactions`: Create a new interaction.
- `PUT /api/interactions/mark-done/:id`: Mark an interaction as done.
