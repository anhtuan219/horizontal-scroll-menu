import { useState } from "react";
import { HorizontalMenu } from "./components/HorizontalNavMenu";
import { VanillaHorizontalMenu } from "./components/VanillaHorizontalMenu";
import "./App.css";

interface MenuItem {
  id: string;
  label: string;
}

function App() {
  const [items] = useState<MenuItem[]>([
    { id: "1", label: "Getting Started" },
    { id: "2", label: "Design Principles" },
    { id: "3", label: "Component Library" },
    { id: "4", label: "Best Practices" },
    { id: "5", label: "User Experience" },
    { id: "6", label: "Animation Guide" },
    { id: "7", label: "Color Theory" },
    { id: "8", label: "Typography Rules" },
    { id: "9", label: "Layout Systems" },
    { id: "10", label: "Responsive Design" },
    { id: "11", label: "Accessibility" },
    { id: "12", label: "Performance Tips" },
    { id: "13", label: "Code Quality" },
    { id: "14", label: "Team Collaboration" },
    { id: "15", label: "Project Management" },
    { id: "16", label: "Testing Strategy" },
    { id: "17", label: "Deployment Guide" },
    { id: "18", label: "Security Basics" },
    { id: "19", label: "API Integration" },
    { id: "20", label: "Documentation" },
  ]);

  return (
    <div className="app">
      <h1>Horizontal Scroll Menu</h1>

      <div className="demo-section">
        <h2>Swiper.js Version</h2>
        <HorizontalMenu items={items} />
      </div>

      <div className="demo-section">
        <h2>Vanilla JS Version</h2>
        <VanillaHorizontalMenu items={items} />
      </div>
    </div>
  );
}

export default App;
