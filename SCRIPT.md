# Recording Script: Joining an Existing Project and Adding a Feature

**Target length:** 13 to 14 minutes (limit: 10 to 15)
**Format:** screen recording + voice-over (OBS Studio, MP4, 1920x1080, 30 fps)
**Narration rule:** for every action say (1) what you will click or type, (2) the element name, (3) what you are about to do, and (4) why. Speak at a calm pace and pause one second after each result appears.

---

## Before you hit record

- [ ] Docker Desktop open, running, and no `demo_db` container or volume left over (`docker compose down -v` in the old folder)
- [ ] Ports 5432 and 3000 free
- [ ] Project folder does **not** exist on your machine yet (the video starts with `git clone`)
- [ ] The repository is hosted somewhere (GitHub, for example) and you have its URL: `<REPO_URL>`
- [ ] REST Client extension (`humao.rest-client`) installed in VS Code
- [ ] DBeaver open with no previous `tasks_db` connection
- [ ] VS Code font size 16 or larger, notifications silenced
- [ ] Do one full dry run first, then reset everything

**Expected data during the video** (so you are never surprised):

| Moment | Table `tasks` |
|---|---|
| At start | id 1 done, id 2 pending, id 3 pending |
| After baseline test (POST + PATCH) | id 1 done, id 2 done, id 3 pending, id 4 pending (new) |
| `GET /tasks/pending` must return | ids 3 and 4 only |

---

## Timeline at a glance

| Time | Segment | Apps |
|---|---|---|
| 0:00 | 1. Intro | Screen / VS Code |
| 0:45 | 2. Open the project | Terminal, VS Code |
| 1:45 | 3. Understand the project | VS Code, Terminal |
| 3:15 | 4. Start the database | Terminal, Docker Desktop |
| 5:00 | 5. Explore the database | DBeaver |
| 6:30 | 6. Run the API and baseline test | VS Code terminal, REST Client |
| 8:15 | 7. Create the feature branch | Terminal |
| 8:45 | 8. Add and test the new endpoint | VS Code, REST Client |
| 11:00 | 9. Verify against the database | DBeaver |
| 12:30 | 10. Commit and wrap up | Terminal |

---

## 1. Intro (0:00 – 0:45)

**On screen:** empty desktop with a terminal open.

**Say:**
"Hi, I'm a backend developer. In this video I show how I work when I join a project that already exists. I did not write this code, I have never run it on this machine, and my job is to run it, understand it, and add one small feature without breaking anything. The project is a Node.js and Express API that stores tasks in PostgreSQL running in Docker. The feature I will add is a new endpoint, GET /tasks/pending, which returns only unfinished tasks. I will use the terminal, VS Code, Docker Desktop and DBeaver."

---

## 2. Open the project (0:45 – 1:45)

**Type in terminal:**
```bash
git clone <REPO_URL>
cd tasks-api-demo
code .
```

**Say:**
"First I need the code. In the terminal I will type git clone with the repository address, because I want a local copy of the project. Now I will move into the folder with cd, and run code dot, which opens this folder in VS Code so I can read everything."

**Pause** while VS Code opens. Say: "VS Code is open on the project folder."

---

## 3. Understand the project (1:45 – 3:15)

**Click:** `README.md` in the VS Code Explorer (left sidebar). Open the preview with `Ctrl+Shift+V`.

**Say:**
"Before running anything, I read the README, because it tells me what the project does and how to start it. I will click README.md in the Explorer and open the preview. It says this is a tasks API with three endpoints, a PostgreSQL database in Docker, and a pending feature: GET /tasks/pending. That is my task."

**Scroll** through the file structure table, then click each file briefly:
- `docker-compose.yml`: "defines the database container"
- `init.sql`: "creates the tasks table and sample rows"
- `server.js`: "the API with its three endpoints"
- `requests.http`: "ready-made requests I can use for testing"

**Say:** "I now know where the database, the API and the tests live. Notice that nothing here needs to change except server.js."

**Open the VS Code terminal** (`` Ctrl+` ``) and type:
```bash
git log --oneline
```

**Say:**
"Now I check the history of changes with git log --oneline, because it shows how the project evolved and what the team did before me. Each line is one commit. This helps me follow the same style when I write my own commit message."

---

## 4. Start the database (3:15 – 5:00)

**Type in the VS Code terminal:**
```bash
docker compose up -d
docker ps
docker logs demo_db
```

**Say:**
"Next I start the database. I will type docker compose up -d, which reads the docker-compose.yml file and starts the PostgreSQL container in the background. The first time it downloads the image, so it may take a moment."

*(Wait for it to finish. Do not cut this wait if it is short; if it is very long, say "I will wait for the download to finish.")*

"Now I type docker ps to confirm the container is running. I should see demo_db with status Up and port 5432."

"To be sure the database started correctly, I type docker logs demo_db. I am looking for the line that says the database system is ready to accept connections."

**Switch to Docker Desktop.** Click the **Containers** tab.

**Say:**
"I will also open Docker Desktop and click the Containers tab, because it gives me a visual confirmation. Here is demo_db with a green status, and I can see its port and its logs from here."

---

## 5. Explore the database (5:00 – 6:30)

**Open DBeaver.** Click **New Database Connection** (plug icon) → **PostgreSQL** → **Next**.

**Say:**
"Now I want to see the data. In DBeaver I click New Database Connection, choose PostgreSQL and click Next, because I need to connect to the database inside the container."

**Fill in the fields while saying them:**
- Host: `localhost`
- Port: `5432`
- Database: `tasks_db`
- Username: `dev`
- Password: `dev123`

**Say:** "These values come from docker-compose.yml. I click Test Connection to confirm they work, and then Finish."

*(If DBeaver asks to download the driver, say: "DBeaver asks for the PostgreSQL driver, I click Download.")*

**Expand:** `tasks_db` → `Schemas` → `public` → `Tables` → double-click `tasks` → **Data** tab.

**Say:**
"I expand tasks_db, Schemas, public, Tables, and double-click the tasks table. In the Properties tab I see the columns: id, title, completed and created_at. In the Data tab I see the three sample rows. Task 1 is completed, tasks 2 and 3 are still pending. I will remember this for later."

---

## 6. Run the API and baseline test (6:30 – 8:15)

**In the VS Code terminal:**
```bash
npm install
npm start
```

**Say:**
"Now the API. I type npm install in the VS Code terminal, because the project does not include its dependencies. This reads package.json and installs express and pg. Then I type npm start to run the server."

**Point at the output:** "API ready at http://localhost:3000. The API is running."

**Open a second terminal tab** (click the **+** in the terminal panel) *or* leave the API running and open `requests.http` in the editor.

**Say:**
"Before I change anything, I do a baseline test. This proves the existing endpoints work today, so if something fails later I know it was my change. I open requests.http. Above the first request I click Send Request."

**Run in order and read each response:**
1. `GET /tasks` → "Status 200 and the three tasks."
2. `POST /tasks` → "Status 201 and the new task, id 4."
3. `PATCH /tasks/2/complete` → "Status 200 and task 2 now has completed true."

**Say:** "All three existing endpoints work. This is my baseline."

---

## 7. Create the feature branch (8:15 – 8:45)

**In the VS Code terminal** (open a new terminal tab so the API keeps running):
```bash
git checkout -b feature/pending-tasks
```

**Say:**
"Now I create a branch for my work. I type git checkout -b feature/pending-tasks, because I never change the main branch directly. If something goes wrong, main stays safe. The bottom-left corner of VS Code now shows the new branch name."

---

## 8. Add and test the new endpoint (8:45 – 11:00)

**Open `server.js`.** Place the cursor on the empty line right **after** the `GET /tasks` endpoint and before the `POST /tasks` one.

**Say:**
"Now the feature. I open server.js and put my cursor after the GET /tasks endpoint, because the new endpoint is closely related and I want to keep similar code together. I will copy the style of the existing endpoint: same pool, same query pattern, same JSON response."

**Type:**
```js
// List only the pending tasks
app.get('/tasks/pending', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM tasks WHERE completed = FALSE ORDER BY id'
  );
  res.json(rows);
});
```

**Say while typing:**
"I define a GET route at /tasks/pending. It runs a SELECT on tasks where completed is false, ordered by id, and returns the rows as JSON. I do not touch any other endpoint."

**Save:** `Ctrl+S`.

**Add a request to `requests.http`** at the end:
```
### 4. List only the pending tasks
GET http://localhost:3000/tasks/pending
```

**Say:** "I also add a request to requests.http so the next developer can test this endpoint too."

**Restart the API:** click the terminal where the API runs, press `Ctrl+C`, then:
```bash
npm start
```

**Say:**
"The server does not reload by itself, so I click the terminal where the API runs, press Ctrl+C to stop it, and type npm start again, so it loads my new code."

**In `requests.http`**, click **Send Request** above the new block.

**Say:**
"Now I click Send Request on my new request. The response is status 200 with two tasks: id 3 and the new id 4. Task 2 is gone from the list because I completed it earlier, and task 1 was already complete. The endpoint works."

**Regression check (important):** click **Send Request** on `GET /tasks` again.

**Say:** "To be sure I did not break anything, I run the original GET /tasks again. It still returns all four tasks. Existing behavior is intact."

---

## 9. Verify against the database (11:00 – 12:30)

**Switch to DBeaver.** Click **SQL Editor** → **New SQL script** (or `Ctrl+]`).

**Type and run** (`Ctrl+Enter`):
```sql
SELECT * FROM tasks WHERE completed = false;
```

**Say:**
"The API says tasks 3 and 4 are pending, but I want to confirm that against the source of truth. In DBeaver I open a new SQL script and run a SELECT on tasks where completed is false, by pressing Control Enter. The result shows exactly two rows: id 3 and id 4. They match the API response, so the new endpoint reads the database correctly."

**Optional extra check** (10 seconds):
```sql
SELECT * FROM tasks ORDER BY id;
```
**Say:** "And the full table shows tasks 1 and 2 completed, which is why they are not in the pending list."

---

## 10. Commit and wrap up (12:30 – 13:30)

**In the VS Code terminal:**
```bash
git status
git add .
git commit -m "Add GET /tasks/pending endpoint"
git log --oneline
```

**Say:**
"Finally I save my work. git status shows I changed server.js and requests.http, nothing else. I type git add dot to stage the changes and git commit with a clear message. git log --oneline shows my commit on top of the existing history, on the feature/pending-tasks branch."

**Closing line (look at the final screen with both the commit and DBeaver result visible):**
"To summarize: I got an existing project running, I understood it from its README, structure and history, I tested the existing endpoints first, I added one small feature on its own branch, and I verified it against the database. The existing code stays intact. Thanks for watching."

---

## Optional: short note for the deliverable

```
Baseline test (before my change):
- GET /tasks -> 200, 3 tasks
- POST /tasks -> 201, task id 4 created
- PATCH /tasks/2/complete -> 200, task 2 completed

New endpoint:
- GET /tasks/pending -> 200, returns tasks id 3 and id 4

Database check (DBeaver):
SELECT * FROM tasks WHERE completed = false;
-> 2 rows: id 3 and id 4 (matches the API response)

Commit: feature/pending-tasks, "Add GET /tasks/pending endpoint"
```

## If something goes wrong while recording

| Problem | Quick fix |
|---|---|
| Port 5432 or 3000 in use | Stop the other process; mention it briefly on camera |
| `docker ps` shows nothing | Docker Desktop not running; start it and repeat `docker compose up -d` |
| API cannot connect to the database | `docker logs demo_db`; wait a few seconds and run `npm start` again |
| New endpoint returns 404 | The API was not restarted; press `Ctrl+C` and `npm start` |
| Data differs from the table above | Fine, just compare the API result with the SELECT result |
