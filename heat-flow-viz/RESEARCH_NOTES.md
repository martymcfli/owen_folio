# Heat Flow Visualization Tool - Research Notes

## Key Findings on Closed-Loop Geothermal Systems

### Heat Transfer Physics
- **Conduction-Only Model**: In closed-loop geothermal systems, heat transfer is dominated by conduction rather than convection. The heat transfer fluid circulates in a closed loop, and heat flows from the surrounding rock to the wellbore primarily through conduction.
- **Thermal Drawdown**: Long-term operation of closed-loop systems results in thermal drawdown—a gradual reduction in the temperature difference between the rock formation and the circulating fluid. This is a critical performance metric.
- **Line Source Theory**: The standard analytical approach uses line source theory (modified Kelvin's theory) to model heat extraction from a wellbore. Each wellbore segment is treated as a line source or line sink.

### Multi-Lateral Well Systems
- **Eavor-Loop Configuration**: Multi-lateral closed-loop geothermal systems (MCLGS) like the Eavor-Loop use multiple lateral branches extending from a main wellbore. This increases the contact surface area with the rock formation.
- **Superposition Principle**: For multi-lateral systems, the principle of superposition can be applied—the thermal response of the system is the sum of the responses from individual line sources (each lateral segment).
- **Lateral Geometry Impact**: Research shows that longer lateral wells and larger well spacing are beneficial for enhancing performance and reducing thermal drawdown.

### Mathematical Modeling Approaches
1. **Analytical Models**: Use line source theory and superposition to calculate temperature distribution around the wellbore. These are fast but simplified.
2. **Numerical Models**: Finite element or finite difference methods solve the heat conduction equation in 3D. These are more accurate but computationally intensive.
3. **Hybrid Approaches**: Some models use analytical solutions for the near-field (around the wellbore) and numerical methods for the far-field.

### Key Parameters for Simulation
- **Rock Thermal Conductivity** (k): Typically 2-5 W/(m·K) for sedimentary rocks
- **Rock Thermal Diffusivity** (α = k/(ρ·c)): Controls how quickly heat diffuses through the rock
- **Heat Extraction Rate** (Q): Power extracted from the well (W)
- **Wellbore Geometry**: Radius, depth, lateral length, number of laterals
- **Initial Rock Temperature**: Geothermal gradient typically 25-30°C/km depth
- **Fluid Temperature**: Depends on the heat pump or direct use application

### Thermal Drawdown Prediction
- **Early Time Behavior**: Dominated by the thermal properties of the rock near the wellbore
- **Late Time Behavior**: Thermal drawdown continues but at a decreasing rate as the thermal front expands
- **Steady-State Consideration**: For very long timescales, the system approaches a quasi-steady state where the thermal drawdown rate stabilizes

## Visualization Strategy

### 3D Representation
- **Rock Formation**: 3D cube or domain representing the subsurface
- **Wellbore**: Line or cylinder representing the main wellbore
- **Laterals**: Multiple lines extending from the main wellbore
- **Temperature Field**: Color-mapped volumetric visualization showing temperature distribution
- **Thermal Drawdown**: Animated progression showing how the temperature field changes over time

### Interactive Controls
- Adjust heat extraction rate
- Modify wellbore geometry (lateral length, number of laterals, spacing)
- Change rock thermal properties
- Animate time progression
- Toggle between different visualization modes

## Implementation Plan

### Phase 1: Core Simulation Engine
- Implement line source theory calculations
- Create superposition logic for multi-lateral systems
- Develop time-stepping algorithm for thermal drawdown prediction

### Phase 2: 3D Visualization
- Set up Three.js scene with proper lighting and camera
- Create geometric representations of wellbore and laterals
- Implement temperature field visualization using color mapping
- Add interactive controls and parameter adjustment UI

### Phase 3: Integration & Polish
- Connect simulation engine to visualization
- Add real-time parameter adjustment
- Implement animation and time controls
- Add documentation and help UI
