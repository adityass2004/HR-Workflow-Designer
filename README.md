# HR Workflow Designer
### Tredence Studio — Full Stack Engineering Intern Case Study

🔗 **Live Demo:** [https://hr-workflow-designer.vercel.app](https://hr-workflow-designer.vercel.app)
📁 **Repository:** [https://github.com/your-username/hr-workflow-designer](https://github.com/your-username/hr-workflow-designer)

---

## What This Is

A visual HR workflow builder where admins drag, connect, and configure workflow steps — then simulate execution end-to-end. Built in ~5 hours as a functional prototype focused on architectural clarity over visual polish.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI Framework | React 18 + TypeScript | Type safety, component model |
| Graph Canvas | React Flow v11 | Purpose-built for node editors |
| State | Zustand | Minimal boilerplate, no context hell |
| Forms | react-hook-form + Zod | Reactive validation, zero re-renders |
| Styling | Tailwind CSS | Fast, consistent dark theme |
| Build | Vite | Instant HMR, lean output |
| Deploy | Vercel | Zero-config, instant CI/CD |

---

## Features Built

**Canvas**
- Drag nodes from sidebar onto canvas
- Connect nodes with animated edges
- Delete nodes/edges via keyboard or button
- Snap-to-grid positioning

**Node Types**
- `Start` — entry point with metadata key-value pairs
- `Task` — human task with assignee, due date, custom fields
- `Approval` — role-based approval with auto-approve threshold
- `Automation` — system action chosen from mock API, dynamic params
- `End` — completion with summary toggle

**Config Forms**
- Right panel opens on node click, pre-filled with current data
- Saves reactively on every keystroke (300ms debounce) — no submit button
- Dynamic field arrays for metadata and custom fields
- Automation params re-render based on selected action

**Validation Engine**
- Checks: missing Start/End, disconnected nodes, dead ends, cycles (DFS), unconfigured nodes
- Invalid nodes show red border rings on canvas
- Error bar at top of canvas with count + details

**Simulation Panel**
- Serializes graph → calls mock `/simulate` API
- BFS traversal, per-node status: success / pending / failed
- Timeline view with colored status icons
- Blocked when validation errors exist

**Export / Import**
- Export full workflow as `workflow.json`
- Import JSON with Zod shape validation

---

## Architecture

```
src/
  types/          → All TS interfaces, enums (workflow, API)
  store/          → Single Zustand store (nodes, edges, selection, simulation)
  utils/          → nodeFactory, graphValidator, serializer, exportImport
  api/            → mockData, automationsApi, simulationApi (local mocks)
  hooks/          → useAutomations, useSimulation, useValidation
  features/
    canvas/       → WorkflowCanvas, NodePalette, Toolbar, drop handler
    nodes/        → One file per node type (StartNode, TaskNode, ...)
    forms/        → One form per node type + KeyValueEditor
    simulation/   → SimulationPanel
```

**State flow:**
```
User action → Zustand store mutation → React Flow re-render
                                     → Form pre-fill (via reset())
                                     → Validation re-run (via useMemo)
```

**Key design decisions:**
- Forms write back to store via `watch` + debounce — no submit step
- Validation runs synchronously on every store change via `useMemo`
- Simulation is blocked by validation — invalid graphs cannot run
- `nodeTypes` map is defined once in `features/nodes/index.ts`, never inline

---

## Run Locally

```bash
git clone https://github.com/your-username/hr-workflow-designer
cd hr-workflow-designer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

```bash
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## What I Would Add With More Time

- FastAPI backend with PostgreSQL persistence
- Real-time collaboration via WebSockets
- Workflow versioning and node history
- Conditional edge routing (if/else branching)
- Drag-to-reorder execution priority on parallel nodes
- Auth via OAuth with role-based canvas access

---

## Assumptions Made

- No backend required — all state is in-memory, simulation is deterministic mock
- Automation actions list is static (mock API, no polling)
- Workflow execution order follows BFS from Start node
- Cycles are treated as hard errors — simulation will not run with a cycle present

---

*Built by [Your Name] · April 2025*