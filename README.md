# Amazons

This is hackathon solution

## Hackathon Requirements

- [Task](doc/hackathon_task.md)
- [Judging Criteria](doc/judging_criteria.md)
- [Deliverables](doc/deliverables.md)

## Running the Frontend

Install dependencies:

```
npm install
```

Start the dev server (with hot reload):

```
npx nx serve frontend
```

The app will be available at `http://localhost:4200`.

### Via Docker

Build and run the production nginx-served build (from the repo root, since the build context must include the whole Nx workspace):

```
docker build -f apps/frontend/Dockerfile -t frontend .
docker run --rm -p 8080:80 frontend
```

The app will be available at `http://localhost:8080`.

## Kanban Board

We use a lightweight, Markdown-based Kanban board (`kanban-lite`) to track our hackathon progress and stages.

To view or manage the board from the command line:

```bash
npx kanban-lite list
```

To launch the interactive Kanban web UI (opens in browser at `http://localhost:3000`):

```bash
npx kanban-lite serve
```