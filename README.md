# G-Code Visualizer

A professional web-based tool for visualizing and analyzing G-code commands from 3D printers, CNC machines, laser cutters, and other fabrication equipment.

## 🔗 Live Demo

**[https://mauricioize.dev/gcode-visualizer](https://mauricioize.dev/gcode-visualizer)**

## 📋 Overview

G-Code Visualizer helps you understand and optimize your fabrication workflows by providing detailed analysis of G-code files. Simply drop your `.gcode` file from popular slicers (like UltiMaker Cura, PrusaSlicer, or others) and get instant analytical insights including:

- **Extrusion volume calculations** per command and layer
- **Speed and flow analysis** for movement optimization
- **Layer-by-layer visualization** with interactive navigation
- **Command distribution statistics** for better understanding of your prints
- **Canvas rendering** to visualize toolpaths

This tool is particularly valuable for custom 3D printer builders and advanced users looking to detect issues, optimize print speeds, and understand the behavior of their G-code.

## ✨ Features

- 📁 **File Input** - Upload G-code files or load example files
- 🔍 **Layer Explorer** - Navigate through layers with detailed command inspection
- 📊 **Command Analysis** - Deep dive into position, movement, extrusion, speed, and flow metrics
- 🎨 **Visualization** - Canvas-based toolpath rendering and extrusion charts
- ⌨️ **Keyboard Navigation** - Use arrow keys for quick layer and command browsing
- 📈 **Interactive Charts** - Visual representation of extrusion volumes and command distribution

## 🛠️ Technologies

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Recharts** for data visualization
- **Styled Components** for modern CSS-in-JS styling
- Built with modern web standards (March 2025)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```
