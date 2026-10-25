# Tasks API (Node.js + Express + PostgreSQL + Docker)

## What is this project about?

It is a simple REST API for managing a to-do list on the server side. It lets you **list** tasks, **create** new ones and **mark them as completed**. Data is stored in a PostgreSQL database running inside a Docker container, so you do not need to install Postgres on your computer.

The project is already started and working: it has its database, its API and its manual tests ready. It is meant as an example of **how to work with an existing project**: clone it, understand how it is put together, run it locally, check that everything works, and then add new features without breaking what is already there.

## How is it built?

```
 Client (VS Code REST Client / curl)
              │  HTTP (port 3000)
              ▼
   Node.js + Express API  (server.js)
              │  SQL (port 5432)
              ▼
   PostgreSQL 16 in Docker  (demo_db container)
```

| Piece | Technology | Purpose |
|---|---|---|
| API | Node.js + Express | Receives HTTP requests and replies in JSON |
| Data access | `pg` library | Connects the API to PostgreSQL |
| Database | PostgreSQL 16 in Docker | Stores tasks persistently |
| Manual testing | `requests.http` (REST Client) | Ready-made requests to try each endpoint |

## File structure

| File | Contents |
|---|---|
| `docker-compose.yml` | Defines the PostgreSQL container (`demo_db`), its credentials, port and data volume |
| `init.sql` | Creates the `tasks` table and 3 sample rows; runs only the first time the container starts |
| `server.js` | API code: database connection and the 3 endpoints |
| `package.json` | Project dependencies (`express`, `pg`) and the `npm start` command |
| `requests.http` | Test requests to run from VS Code |
| `.gitignore` | Keeps `node_modules/` and `.env` files out of the repository |
| `SCRIPT.md` | Script for recording the explainer video (not part of the application) |

## Data model

A single table, `tasks`:

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (primary key) | Auto-generated identifier |
| `title` | VARCHAR(120), required | Task text |
| `completed` | BOOLEAN, defaults to `false` | Whether the task is done |
| `created_at` | TIMESTAMP, defaults to now | Creation date and time |

Sample data loaded by `init.sql`:

| id | title | completed |
|---|---|---|
| 1 | Set up the environment with Docker | true |
| 2 | Connect DBeaver to the database | false |
| 3 | Test the GET /tasks endpoint | false |

## Available endpoints

| Method | Route | What it does | Response |
|---|---|---|---|
| GET | `/tasks` | Lists all tasks ordered by id | `200` with a JSON array |
| POST | `/tasks` | Creates a new task. Body: `{"title": "text"}` | `201` with the created task; `400` if the title is missing |
| PATCH | `/tasks/:id/complete` | Marks the task as completed | `200` with the updated task; `404` if it does not exist |

Example response from `GET /tasks`:

```json
[
  {
    "id": 1,
    "title": "Set up the environment with Docker",
    "completed": true,
    "created_at": "2026-10-22T12:00:00.000Z"
  }
]
```

## Next feature (pending)

There is currently no way to see only the unfinished tasks. The planned improvement is:

- `GET /tasks/pending`: return only the tasks where `completed = false`.

## Prerequisites

- Docker Desktop (open and running)
- Node.js 20 or higher
- Git
- Visual Studio Code (recommended extension: REST Client, `humao.rest-client`)
- DBeaver Community (to inspect the database)

## How to get it running

### 1. Start the database

```bash
docker compose up -d
docker ps
```

The `demo_db` container should appear with status "Up". The `tasks` table and the 3 sample rows are created automatically from `init.sql`.

### 2. Connect DBeaver

New connection → PostgreSQL:

| Field | Value |
|---|---|
| Host | localhost |
| Port | 5432 |
| Database | tasks_db |
| User | dev |
| Password | dev123 |

Open `tasks_db > Schemas > public > Tables > tasks` to see the data. If DBeaver asks to download the PostgreSQL driver, accept.

### 3. Start the API

```bash
npm install
npm start
```

It should print: `API ready at http://localhost:3000`

### 4. Test the endpoints

Open `requests.http` in VS Code and click "Send Request" above each block. Terminal alternative:

```bash
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"My new task"}'
curl -X PATCH http://localhost:3000/tasks/2/complete
```

### 5. Verify in DBeaver

Run in the SQL editor (Ctrl + Enter):

```sql
SELECT * FROM tasks ORDER BY id;
```

You should see the new task and task 2 with `completed = true`.

## Git workflow

```bash
git checkout -b feature/my-change     # new branch for your work
git add .
git commit -m "Describe your change"
git push
```

## Cleanup when finished

```bash
docker compose down        # stops the container and keeps the data
docker compose down -v     # also deletes the data
```

## Common problems

- **Port 5432 already in use:** change `"5432:5432"` to `"5433:5432"` in `docker-compose.yml` and use 5433 in DBeaver and in `server.js`.
- **The API cannot connect to the database:** check with `docker ps` that `demo_db` is up and look at `docker logs demo_db`.
- **Changes to `init.sql` are not applied:** that file only runs the first time; use `docker compose down -v` and start again.
- **Port 3000 already in use:** close the process using it or change the number in `app.listen` inside `server.js`.
