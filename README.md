# 🌳 Tree Visualizer

An interactive, client-side tree structure visualizer built with **React** and **React Flow**. It renders hierarchical data with clean spacing, clear parent-child relationships, and intuitive expand/collapse interactions.

![React](https://img.shields.io/badge/React-19-blue) ![React Flow](https://img.shields.io/badge/React_Flow-12-green) ![Vite](https://img.shields.io/badge/Vite-6-purple)

<img width="1868" height="935" alt="image" src="https://github.com/user-attachments/assets/a3390a1d-1829-4e1f-9cd7-8c82f5685693" />


---

## ✨ Features

### Core
- ✅ **Proper tree layout** with calculated spacing between siblings
- ✅ **Parent nodes centered** above their group of children
- ✅ **Smooth step edges** connecting parent and child nodes
- ✅ **Expand/Collapse** functionality for any node with children
- ✅ **Smooth recalculation** of layout when collapsing or expanding

### Bonus
- 🎯 **Hover highlighting** — highlights ancestor path on hover
- 🔍 **Search + highlight** — find nodes by label, auto-expand paths to results
- 📋 **Node metadata display** — click any node to see its details in a side panel
- 🗺️ **MiniMap** — overview of the full tree for easy navigation
- 🔄 **Auto-pan & zoom** — fit view automatically on layout changes
- 📊 **Statistics bar** — total nodes, visible nodes, depth, leaf count
- 🎨 **Expand All / Collapse All** — bulk operations via toolbar

---

## 🚀 Setup & Run

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation

```bash
# Clone the repository
git clone [<repository-url>](https://github.com/shivamparmar07/tree-visualiser/tree/main)
cd Infollion

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will start at `http://localhost:5173` (default Vite port).

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
Infollion/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── TreeNode.jsx          # Custom React Flow node component
│   │   ├── TreeVisualizer.jsx    # Main visualizer with toolbar & canvas
│   │   └── DetailPanel.jsx       # Node metadata detail panel
│   ├── data/
│   │   └── treeData.js           # Sample hierarchical tree data
│   ├── utils/
│   │   └── treeLayout.js         # Tree layout engine & utilities
│   ├── App.jsx                   # App entry point
│   ├── main.jsx                  # React DOM entry
│   └── index.css                 # Complete styling
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧩 How It Works

### Tree Layout Algorithm
1. **Bottom-up width calculation**: Each node's width is computed as the sum of its children's widths plus gaps, or the minimum node width if it's a leaf.
2. **Top-down position assignment**: Nodes are positioned by distributing children within their parent's allocated width, centering the parent above.
3. **Collapse handling**: Collapsed nodes are treated as leaves, causing the layout to recalculate and animate via React Flow's `fitView`.

### Interactions
- **Click** a node to see its metadata in the detail panel
- **Hover** a node to highlight its ancestor path
- **Click the orange circle** below a node to expand/collapse its subtree
- **Search** by typing in the search bar — matching nodes glow amber
- **Pan** by dragging the canvas, **zoom** with scroll wheel

---

## 🛠️ Technologies

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI framework |
| [React Flow (@xyflow/react)](https://reactflow.dev) | Graph/tree rendering engine |
| [Vite 6](https://vite.dev) | Build tool & dev server |
| Vanilla CSS | Styling with custom properties |

---

## 📝 Customization

### Changing Tree Data
Edit `src/data/treeData.js` to modify the tree structure. Each node follows this schema:

```js
{
  id: 'unique-id',
  label: 'Display Name',
  meta: { type: 'Category', status: 'Active' },
  children: [ /* nested nodes */ ]
}
```

### Adjusting Layout
Edit the constants in `src/utils/treeLayout.js`:

```js
const NODE_WIDTH = 140;      // Minimum node width
const NODE_HEIGHT = 50;       // Node height
const HORIZONTAL_GAP = 30;    // Gap between siblings
const VERTICAL_GAP = 90;      // Gap between levels
```

---

## 📄 License

MIT
