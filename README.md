# Vue Progress & Charts

Vue 3 + Vite project demonstrating:
- **Task 1** — Circular SVG progress bar component:
<img width="1440" height="716" alt="Screenshot 2026-03-01 at 3 22 47 AM" src="https://github.com/user-attachments/assets/a308a034-dc7e-4db2-b7fc-f4f14faf0b7c" />

- **Task 2** — Pie chart with Chart.js + custom color picker:
<img width="1440" height="716" alt="Screenshot 2026-03-01 at 3 23 01 AM" src="https://github.com/user-attachments/assets/34e33f4a-097f-4856-b908-36ba67ebaf43" />


## Stack

| Tool | Version |
|------|---------|
| Vue | 3.4+ |
| Vue Router | 4.3+ |
| Chart.js | 4.4+ |
| Vite | 5+ |

No extra UI libraries. Color picker is implemented from scratch using the `useColorPicker` composable.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project Structure

```
src/
├── main.js                        # App entry point
├── App.vue                        # Shell + nav + router-view
├── router/
│   └── index.js                   # Vue Router config (2 routes)
├── assets/
│   └── main.css                   # Global CSS variables & shared utilities
├── composables/
│   ├── useColorPicker.js          # HSV ↔ RGB ↔ HEX + canvas rendering
│   └── useProgressColor.js        # Red→Amber→Green interpolation
├── views/
│   ├── ProgressView.vue           # Page: progress bar demos
│   └── ChartView.vue              # Page: pie chart
└── components/
    ├── ProgressBar/
    │   ├── CircularProgress.vue   # SVG ring — main reusable component
    │   └── ProgressControls.vue   # Sliders / chips / toggle for playground
    └── PieChart/
        ├── PieChartCanvas.vue     # Chart.js wrapper (reactive to sectors[])
        ├── SectorList.vue         # List with edit/delete actions
        ├── SectorModal.vue        # Add/Edit modal (Teleport + Transition)
        ├── ColorPicker.vue        # Dropdown color picker UI
        ├── ChevronIcon.vue        # SVG icon
        ├── EditIcon.vue           # SVG icon
        └── TrashIcon.vue          # SVG icon
```

## Component API — CircularProgress

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Number` | `0` | Progress 0–100 |
| `status` | `String` | `'inprogress'` | `inprogress` \| `success` \| `warning` \| `error` |
| `size` | `Number` | `120` | Outer diameter (px) |
| `stroke-width` | `Number` | `8` | SVG stroke width (px) |
| `type` | `String` | `'circle'` | `circle` \| `dashboard` (270° arc) |
| `show-label` | `Boolean` | `true` | Show percentage / status icon |

```vue
<CircularProgress :value="75" status="inprogress" :size="160" type="dashboard" />
```
