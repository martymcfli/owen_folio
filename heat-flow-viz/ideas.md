# Heat Flow Visualization Tool - Design Brainstorm

## Design Approach Selection

This tool requires a design that communicates **scientific precision, temporal progression, and spatial complexity** while remaining accessible to both specialists and stakeholders. The visualization must balance technical accuracy with intuitive understanding.

---

## Selected Design Philosophy: "Scientific Precision with Temporal Narrative"

### Design Movement
**Data-Driven Modernism** — A contemporary approach that treats data visualization as the primary narrative medium. Inspired by scientific dashboards, geological surveys, and temporal data visualization practices. The design emphasizes clarity, precision, and the storytelling power of animated data.

### Core Principles

1. **Temporal Clarity**: Time is a primary design dimension. The interface prominently displays current simulation time, elapsed duration, and remaining projection. Animations show change over time, not just static states.

2. **Spatial Hierarchy**: The 3D visualization dominates the interface as the hero element. Control panels are secondary, arranged to support rather than compete with the visualization.

3. **Scientific Authenticity**: Color schemes, typography, and UI elements reflect real scientific practice—using perceptually uniform colormaps (like viridis or thermal gradients), precise numerical displays, and technical terminology.

4. **Interactive Exploration**: Users can pause, rewind, and adjust parameters in real-time. The interface invites experimentation and discovery rather than passive observation.

### Color Philosophy

**Primary Palette**: A thermal gradient from deep blue (cold rock, low temperature) through cyan, green, yellow, orange, to deep red (hot rock, high temperature). This directly maps to physical reality and requires no legend explanation.

**Secondary Colors**: Dark charcoal backgrounds (#1a1a1a) for the 3D viewport to maximize contrast and reduce eye strain during extended viewing. Accent colors: bright cyan (#00d9ff) for interactive elements and highlights, creating visual pop against dark backgrounds.

**Reasoning**: The thermal gradient is not arbitrary—it mirrors the physical phenomenon being visualized. Users intuitively understand that red = hot and blue = cold. Dark backgrounds reduce glare and make the 3D scene more immersive.

### Layout Paradigm

**Asymmetric Split Layout**: The 3D viewport occupies 70-75% of the screen on the left/center. The right side contains a collapsible control panel with parameter sliders, time controls, and simulation statistics. This asymmetry creates visual interest and prioritizes the visualization.

**Vertical Information Stack**: Above the 3D viewport, a thin header bar displays key metrics (current time, thermal drawdown rate, heat extraction rate). Below, a timeline scrubber allows temporal navigation. This sandwich structure keeps critical information accessible without cluttering the viewport.

**Responsive Adaptation**: On smaller screens, the control panel becomes a bottom drawer or modal overlay, ensuring the 3D visualization remains the focus.

### Signature Elements

1. **Animated Thermal Gradient**: The temperature field is rendered as a volumetric cloud with smooth color transitions. Particles or subtle noise effects suggest the continuous nature of heat diffusion.

2. **Wellbore Glow**: The wellbore and laterals emit a subtle glow that intensifies with heat extraction rate, creating a visual metaphor for energy flow.

3. **Thermal Drawdown Indicator**: A radial progress ring or curve showing drawdown over time, positioned in a corner of the viewport. As time progresses, the ring fills, visually representing the system's degradation.

### Interaction Philosophy

**Immediate Feedback**: Adjusting a parameter instantly updates the visualization. No "submit" buttons or delays—the tool responds in real-time to user input.

**Layered Complexity**: Basic users see simple controls (heat rate, simulation speed). Advanced users can access detailed parameters (thermal conductivity, wellbore radius, lateral geometry).

**Gesture-Based 3D Navigation**: Mouse drag to rotate, scroll to zoom, right-click to pan. These are standard 3D interaction patterns, making the tool feel familiar.

### Animation Guidelines

**Time Progression**: Smooth, continuous animation of the temperature field as time advances. The color gradient shifts gradually, not in discrete jumps. Animation speed is user-controllable (1x, 5x, 10x, etc.).

**Parameter Changes**: When a user adjusts a parameter, the visualization smoothly transitions to the new state over 0.5-1 second, showing cause-and-effect clearly.

**Entrance Effects**: When the page loads, the 3D scene fades in, and the wellbore geometry appears first, followed by the temperature field. This establishes context before showing data.

**Hover States**: Hovering over a lateral or control element highlights it in cyan, making interactive elements discoverable.

### Typography System

**Display Font**: "Space Mono" (monospace) for headers and large numerical values. Monospace fonts evoke technical precision and are commonly used in scientific software.

**Body Font**: "Inter" for UI labels, descriptions, and parameter names. Inter is clean, modern, and highly legible at small sizes.

**Hierarchy Rules**:
- **H1 (Page Title)**: Space Mono, 32px, bold, dark charcoal
- **H2 (Section Headers)**: Space Mono, 18px, semibold, cyan accent
- **Body Text**: Inter, 14px, regular, light gray
- **Numerical Displays**: Space Mono, 16px, bold, cyan or white
- **Labels**: Inter, 12px, regular, medium gray

**Rationale**: The monospace/sans-serif pairing creates visual contrast—monospace for data and precision, sans-serif for readability and accessibility.

---

## Rejected Approaches

**Approach 1 - "Minimalist Brutalism"**: Stripped-down interface with harsh geometric shapes and limited color. Rejected because it would obscure the complexity of the thermal phenomena and make the tool feel cold/unwelcoming.

**Approach 2 - "Playful Gradient Explosion"**: Vibrant gradients, rounded corners, and animated particles everywhere. Rejected because it would undermine scientific credibility and distract from the data.

---

## Implementation Checklist

- [ ] Implement thermal gradient colormap (blue → red)
- [ ] Set up dark charcoal background (#1a1a1a)
- [ ] Add cyan accent color (#00d9ff) for interactive elements
- [ ] Import Space Mono and Inter fonts from Google Fonts
- [ ] Create 3D viewport with Three.js
- [ ] Build control panel with parameter sliders
- [ ] Add time display and timeline scrubber
- [ ] Implement smooth animation for time progression
- [ ] Add thermal drawdown indicator visualization
- [ ] Implement wellbore glow effect
- [ ] Create responsive layout (desktop-first, mobile-adaptive)
- [ ] Add hover and interaction feedback
