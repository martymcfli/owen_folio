# Heat Flow Visualization Tool - Architecture & Mathematical Model

## System Architecture

### Core Components

**Simulation Engine**: Implements the heat transfer physics using line source theory and superposition. It calculates temperature distribution in the rock formation at discrete time steps and spatial points.

**Visualization Layer**: Uses Three.js to render the 3D scene, including the wellbore geometry, rock formation, and temperature field visualization. Handles camera controls, lighting, and interactive elements.

**Parameter Manager**: Maintains simulation parameters (rock properties, wellbore geometry, heat extraction rate) and allows real-time updates through the UI.

**Time Controller**: Manages simulation time progression, animation playback, and temporal visualization updates.

### Data Flow

The user adjusts parameters through the UI → Parameter Manager updates simulation state → Simulation Engine recalculates temperature field → Visualization Layer renders the updated 3D scene → User observes thermal drawdown progression.

## Mathematical Model

### Line Source Theory

For a single line source (representing a wellbore segment) at depth z₀ with constant heat extraction rate Q, the temperature rise at a point (r, z) in an infinite medium is given by:

```
ΔT(r, z, t) = (Q / (4πk)) * W(u)
```

where:
- Q is the heat extraction rate (W/m of wellbore)
- k is the rock thermal conductivity (W/(m·K))
- W(u) is the well function (related to the exponential integral)
- u = r² / (4αt), with α being thermal diffusivity and t being time

For practical implementation, the well function can be approximated using analytical expressions or numerical integration.

### Superposition for Multi-Lateral Systems

For a system with n lateral segments, each treated as a line source, the total temperature change at any point is:

```
ΔT_total(x, y, z, t) = Σᵢ₌₁ⁿ ΔT_i(x, y, z, t)
```

where ΔT_i is the temperature contribution from the i-th lateral segment, calculated using the line source equation with the distance from that segment.

### Discretization Strategy

**Spatial Discretization**: The rock formation is discretized into a 3D grid of points. Temperature is calculated at each grid point for visualization. A coarser grid is used for real-time visualization, while finer grids can be used for detailed analysis.

**Temporal Discretization**: Time is stepped forward in increments (e.g., days or months). At each time step, the temperature field is recalculated using the updated time value in the well function.

### Thermal Drawdown Calculation

The thermal drawdown is quantified as the temperature difference between the initial rock temperature and the current temperature at the wellbore wall:

```
Drawdown(t) = T_initial - T_wellbore(t)
```

This metric is tracked over time to show how the system's performance degrades.

## Implementation Details

### Simulation Parameters

**Rock Properties**:
- Thermal conductivity (k): 2-5 W/(m·K)
- Thermal diffusivity (α): 0.5-1.5 × 10⁻⁶ m²/s
- Initial temperature: Calculated from geothermal gradient (e.g., 25°C/km)

**Wellbore Geometry**:
- Depth: 1000-5000 m
- Main wellbore radius: 0.05-0.1 m
- Number of laterals: 1-10
- Lateral length: 100-1000 m
- Lateral spacing: Configurable

**Operating Conditions**:
- Heat extraction rate: 10-100 kW
- Simulation duration: 1-50 years
- Time step: 1 day to 1 month

### Well Function Approximation

For computational efficiency, the well function W(u) is approximated using:

```
W(u) ≈ -ln(u) - γ + u - u²/4 + u³/18 - ...
```

where γ ≈ 0.5772 is the Euler-Mascheroni constant. This series converges quickly for small u values.

Alternatively, the exponential integral E₁(u) can be used:

```
W(u) = -E₁(u)
```

### Visualization Approach

**Temperature Field Representation**: A 3D volumetric visualization using color mapping. Points with higher temperature are rendered in warm colors (red/orange), while cooler points are rendered in cool colors (blue/cyan).

**Isosurfaces**: Optional rendering of temperature isosurfaces to highlight specific temperature thresholds.

**Wellbore Representation**: The wellbore and laterals are rendered as cylinders or tubes with appropriate radius and positioning.

**Animation**: Time progression is animated to show how the temperature field evolves, making the thermal drawdown process visually intuitive.

## Performance Considerations

**Computational Efficiency**: Line source calculations are O(n) per grid point, where n is the number of lateral segments. For a 50×50×50 grid with 5 laterals, this is manageable in real-time.

**GPU Acceleration**: Three.js can leverage WebGL for efficient rendering. Temperature field calculations can potentially be offloaded to GPU shaders for further acceleration.

**Level of Detail**: Multiple visualization modes can be implemented—low-detail for real-time interaction, high-detail for detailed analysis.

## Extensibility

The architecture is designed to support future enhancements:

- **Convection Effects**: Adding natural convection in fractured media
- **Multiple Fluid Loops**: Simulating systems with multiple independent circulation loops
- **Thermal Storage**: Accounting for thermal energy storage in the rock
- **Optimization**: Tools to optimize wellbore geometry for maximum energy extraction
- **Data Export**: Exporting simulation results for further analysis
