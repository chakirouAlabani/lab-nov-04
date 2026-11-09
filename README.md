# Lab : Docker Compose and GitHub Actions

**Course:** 420-530-LE — Transactional Web Applications 2  
**Format:** Individual practical assessment with a live demonstration  

## Your task

You are given a working MERN dashboard for managing users, products, and orders. Your task is to containerize the application, run its three services together, and automate its checks and image builds with GitHub Actions.

You must write your own frontend Dockerfile, backend Dockerfile, Compose configuration, and GitHub Actions workflow. This handout gives requirements and expected results; it does not provide their implementation. You must be able to explain the configuration you submit.

## What you receive

- `frontend/`: React, Vite, Tailwind CSS, and a dependency lockfile.
- `backend/`: Express, Mongoose, a dependency lockfile, and a sample-data command.
- Environment examples for running the app with local MongoDB.
- Existing CRUD pages and APIs for users, products, and orders.

The starter contains no completed container or CI configuration.

## Before you begin

Make sure it runs locally and setup your git repository.

Create your own repository from the provided starter and push the source. Commit both dependency lockfiles and the `.env.example` files.

### Optional local baseline

With local MongoDB running, open a terminal in `backend/`:

```powershell
npm ci
Copy-Item .env.example .env
npm run seed
npm start
```

In another terminal, from `frontend/`:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. The local API uses port 4000. The seed command adds 3 users, 5 products, and 3 linked orders. 

These settings describe execution on your computer. You must determine the correct settings for the containerized application.

## Part A Build the application images

Create a separate Dockerfile for the frontend and backend.

Your images must:

- Build from the submitted source and lockfiles using a compatible Node.js version. The starter has been checked with Node.js 24.
- Install their own dependencies.
- Provide a frontend that serves the built application and a backend that starts the Express API.
- Make the application reachable through the ports you document.

Use a MongoDB image for the database. Explain your base-image choices during the demonstration.

**Expected result:** Both application images build from a clean checkout, and each contains what it needs to run.

## Part B Run the stack with Docker Compose

Create a Compose configuration for three services: frontend, backend, and MongoDB.

Your configuration must:

- Build the frontend and backend from their Dockerfiles.
- Connect the backend to the MongoDB service in the Compose stack.
- Store MongoDB data in a named volume.
- Run the app without mounting host dependency folders or requiring separately started host frontend/backend processes.

Use environment configuration where appropriate and document the required values. Remember that a hostname reachable by another container may not be reachable by the browser.

### Populate the containerized database

After starting your Compose stack, open a terminal in the folder containing your Compose file. If your backend service is named `backend`, run:

```powershell
docker compose exec backend npm run seed
```

Replace `backend` with the service name you defined in your Compose file if it is different.

Here is what the command does:

- `docker compose exec` runs a command inside an already running service container.
- `backend` identifies the service in which to run it.
- `npm run seed` runs the supplied seed script inside that container, using its MongoDB connection settings.

The backend service must be running and its `MONGODB_URL` must point to the MongoDB service in your stack. Running `npm run seed` directly on your computer could populate your host database instead.

Expected output includes:

```text
Sample data ready: 3 users, 5 products, 3 orders.
```

Open or refresh the dashboard. Check that sample records appear on the Users, Products, and Orders pages, and that orders show their associated users and products. Record the command you used in your README.

Run seeding manually after startup; you do not need to add automatic seeding to your Compose configuration. Repeating the command skips existing sample records and preserves edits. It recreates deleted sample records, so do not run it during the persistence check below.

**Expected result:** One documented Compose startup command starts the complete stack. Users can manage records through the browser, and the API uses the containerized database.


## Part C Create the GitHub Actions pipeline

Create your own workflow in `.github/workflows/`. It must run on pushes to your repository's default branch.

The workflow must:

1. Check out the submitted source and use a Node.js version compatible with the application.
2. Install frontend and backend dependencies reproducibly from their lockfiles.
3. Run the frontend lint check and production build.
4. Build both application Docker images using the submitted Dockerfiles.
5. Validate the submitted Compose configuration, supplying non-secret example values where necessary.
6. Fail if a required command fails.

Available frontend checks, run from `frontend/`:

```powershell
npm run lint
npm run build
```

The upstream backend `npm test` script is a placeholder that always exits with an error. It is not a test suite and is not a required check. Installing backend dependencies and building the backend image are required. You do not need to invent a passing test command.

Publishing images and running the complete stack in CI are not required.

**Expected result:** A successful workflow run corresponds to the final commit you demonstrate. A green image build does not replace the live runtime demonstration.

## Part D Demonstrate and explain

When ready, show mw : 

1. Git repo
2. Show your Dockerfiles, Compose file, workflow, and environment examples.
3. Your containers in docker desktop
4. Your app running



## Run this branch with Docker Compose

From the repository root, with Docker Engine and Compose available:

```bash
docker compose up -d --build --wait
docker compose exec backend npm run seed
```

Open **http://localhost:8080** and check Users, Products, and Orders. The API is available through **http://localhost:8080/api/**. Only the frontend publishes a host port. To use a different port, set `HTTP_PORT` in a root `.env` file (for example, `HTTP_PORT=8081`).

The frontend image builds with `VITE_API_BASE_URL=/api`. Nginx forwards those requests to Express on port 4000. Compose sets `MONGODB_URL=mongodb://mongodb:27017/mern_lab6` for the backend. The local stack requires no credentials or environment file.

To verify persistence, edit a sample record, run `docker compose down`, and start the stack again. Check the edited record without reseeding. The `mongo-data` named volume survives `docker compose down`. Adding `--volumes` deletes the database data.

GitHub Actions installs both sets of dependencies, lints and builds the frontend, validates Compose, and builds both images on pushes to `main` and `docker-compose-ci`.
