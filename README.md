# Bharat Grid Intelligence (BGI)

Bharat Grid Intelligence (BGI) is a full-stack smart grid monitoring platform designed to simulate and visualize India’s electricity transmission and distribution network across national, state, and city levels. The system provides real-time telemetry, SCADA-style dashboards, interactive geographic maps, and intelligent alert management to monitor grid health, power flow, and infrastructure performance.

The platform models realistic Indian power infrastructure hierarchies — including substations, feeders, transformers, and load centers — and delivers live operational insights through multi-level dashboards with role-based access control.

## How to get started

Clone the repository and install dependencies:

**Local Development**

If you want to work locally using your IDE, you can clone this repo and follow these steps:

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Build the project for production:

```sh
npm run build
```

Then deploy the contents of the `dist` folder to your hosting provider.
