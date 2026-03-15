# Heat Flow Visualization Tool

A sophisticated 3D interactive visualization tool for simulating and analyzing heat extraction from multi-lateral closed-loop geothermal wells. Built with Three.js and React, this tool uses line source theory to predict long-term thermal drawdown in conduction-dominated systems.

## Features

- **3D Interactive Visualization**: Real-time rendering of temperature fields around multi-lateral wellbores
- **Physics-Based Simulation**: Line source theory implementation for accurate thermal modeling
- **Thermal Drawdown Tracking**: Historical charts showing system performance degradation over time
- **Customizable Geometry**: Adjust wellbore depth, lateral count, and lateral length
- **Rock Properties Control**: Modify thermal conductivity and other formation properties
- **Temporal Animation**: Smooth time progression visualization with adjustable playback speed
- **Real-Time Statistics**: Live metrics including thermal drawdown, heat extraction rate, and simulation time

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **3D Graphics**: Three.js (v0.182.0)
- **Charting**: Recharts for thermal drawdown history visualization
- **Styling**: Tailwind CSS 4 with custom dark theme
- **Build Tool**: Vite 7
- **Package Manager**: pnpm

## Project Structure

```
heat-flow-viz-tool/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeatFlowVisualization.tsx    # Three.js 3D visualization
│   │   │   ├── AdvancedSettings.tsx         # Parameter customization
│   │   │   ├── DrawdownChart.tsx            # Thermal drawdown history
│   │   │   └── ui/                          # shadcn/ui components
│   │   ├── lib/
│   │   │   └── heatSimulation.ts            # Physics simulation engine
│   │   ├── pages/
│   │   │   └── Home.tsx                     # Main application page
│   │   ├── App.tsx                          # Application router
│   │   ├── main.tsx                         # React entry point
│   │   └── index.css                        # Global styles and theme
│   ├── public/                              # Static assets
│   └── index.html                           # HTML template
├── ARCHITECTURE.md                          # Technical architecture details
├── RESEARCH_NOTES.md                        # Physics research background
├── USER_GUIDE.md                            # User documentation
└── README.md                                # This file
```

## Getting Started

### Prerequisites

- Node.js 22.13.0 or later
- pnpm 10.4.1 or later

### Installation

```bash
cd heat-flow-viz-tool
pnpm install
```

### Development

```bash
pnpm run dev
```

The application will start on `http://localhost:3000`

### Build

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

## Physics Model

### Line Source Theory

The tool implements the line source model for heat transfer in geothermal wells. Each lateral segment is treated as a continuous line source, and the temperature response is calculated using:

```
ΔT(r, z, t) = (Q / (4πk)) × W(u)
```

where:
- Q: Heat extraction rate per unit length (W/m)
- k: Rock thermal conductivity (W/(m·K))
- W(u): Well function (exponential integral approximation)
- u: Dimensionless parameter = r² / (4αt)
- α: Thermal diffusivity (m²/s)
- t: Time (s)

### Superposition Principle

For multi-lateral systems, the total temperature change at any point is the sum of contributions from all lateral segments:

```
ΔT_total = Σ ΔT_i (from each lateral i)
```

### Thermal Drawdown

Thermal drawdown quantifies system performance degradation:

```
Drawdown(t) = T_initial - T_wellbore(t)
```

Higher drawdown indicates reduced efficiency due to cooled rock around the wellbore.

## Simulation Parameters

### Default Configuration

- **Wellbore Depth**: 2000 m
- **Number of Laterals**: 3
- **Lateral Length**: 500 m each
- **Heat Extraction Rate**: 50 kW
- **Rock Thermal Conductivity**: 2.5 W/(m·K)
- **Rock Thermal Diffusivity**: 1.0 × 10⁻⁶ m²/s
- **Initial Rock Temperature**: 80°C

### Adjustable Ranges

| Parameter | Min | Max | Default |
|-----------|-----|-----|---------|
| Wellbore Depth | 1000 m | 5000 m | 2000 m |
| Number of Laterals | 1 | 10 | 3 |
| Lateral Length | 100 m | 1000 m | 500 m |
| Heat Extraction Rate | 10 kW | 200 kW | 50 kW |
| Thermal Conductivity | 1 W/(m·K) | 5 W/(m·K) | 2.5 W/(m·K) |
| Animation Speed | 0.1x | 10x | 1x |
| Simulation Duration | 0-50 years | — | 1-50 years |

## Design Philosophy

The tool follows a **"Scientific Precision with Temporal Narrative"** design approach:

- **Dark Theme**: Charcoal background (#0a0a0a) reduces eye strain during extended use
- **Cyan Accents**: Primary accent color (#00d9ff) for interactive elements
- **Thermal Colormap**: Blue (cold) → Red (hot) gradient for intuitive physical understanding
- **Asymmetric Layout**: 75% visualization, 25% controls for focus on the 3D scene
- **Typography**: Space Mono for precision (headers, numbers), Inter for readability (labels)

## Visualization Features

### Temperature Field Rendering

The 3D temperature field is rendered as a point cloud with:
- Perceptually uniform thermal colormap
- Adaptive opacity based on temperature
- Real-time updates as parameters change
- Smooth transitions between states

### Wellbore Geometry

- Main wellbore rendered as a glowing cyan cylinder
- Lateral branches rendered as smaller glowing tubes
- Emissive materials for visual emphasis
- Proper geometric positioning and orientation

### Interactive Controls

- **Mouse Drag**: Rotate the 3D view
- **Mouse Scroll**: Zoom in/out
- **Sliders**: Adjust simulation parameters in real-time
- **Play/Pause**: Control temporal animation
- **Reset**: Return to initial state

## Performance Considerations

- **Grid Resolution**: 25×25×25 points (15,625 total) for real-time performance
- **Update Frequency**: Visualization updates on parameter changes
- **Rendering**: WebGL with Three.js for GPU acceleration
- **Memory**: Typical usage ~100-200 MB for default configuration

## Browser Compatibility

- **Chrome/Chromium**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (macOS 13+)
- **Edge**: Full support
- **Mobile**: Limited support (landscape orientation recommended)

## Known Limitations

1. **Single Well System**: Currently models a single wellbore with multiple laterals. Multiple independent wells not yet supported.

2. **Conduction Only**: The model assumes conduction-dominated heat transfer. Convection effects in fractured media are not included.

3. **Constant Properties**: Rock properties are assumed constant. Layered formations not yet supported.

4. **Steady-State Fluid Temperature**: The circulating fluid temperature is assumed constant. Dynamic fluid temperature variations not modeled.

5. **No Thermal Storage**: Rock thermal storage is implicitly included in the line source model but not explicitly modeled.

## Future Enhancements

- [ ] Multiple independent circulation loops
- [ ] Convection effects in fractured media
- [ ] Layered formation support
- [ ] Dynamic fluid temperature modeling
- [ ] Wellbore geometry optimization
- [ ] Data export (CSV, JSON, images)
- [ ] Comparison tools for scenario analysis
- [ ] Performance metrics dashboard
- [ ] Mobile app version

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## References

### Academic Papers

- Beckers, K. F., et al. (2024). "Evaluating Heat Extraction Performance of Closed-Loop Geothermal Systems with Thermally Conductive Enhancements in Conduction-Only Reservoirs."

- White, M., Vasyliv, Y., Beckers, K., et al. (2024). "Numerical investigation of closed-loop geothermal systems in deep geothermal reservoirs." *Geothermics*, 118, 102922.

- Song, X., Shi, Y., Li, G., et al. (2018). "Numerical analysis of the heat production performance of a closed loop geothermal system." *Renewable Energy*, 123, 140-151.

### Standards and Resources

- Eavor-Loop: Multi-lateral closed-loop geothermal system design
- Line source theory: Modified Kelvin's theory for borehole heat exchangers
- Exponential integral: Well function approximations for transient heat transfer

## Support

For questions, issues, or feature requests, please open an issue on the project repository.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Author**: Manus AI  
**Status**: Production Ready
