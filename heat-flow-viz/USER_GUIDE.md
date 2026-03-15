# Heat Flow Visualization Tool - User Guide

## Overview

The Heat Flow Visualization Tool is an interactive 3D application that simulates and visualizes the thermal performance of multi-lateral closed-loop geothermal wells. It uses line source theory to predict long-term thermal drawdown, helping engineers and researchers understand how heat extraction rates affect system performance over time.

## Key Features

### 3D Visualization
The main viewport displays a three-dimensional representation of the geothermal well system:

- **Temperature Field**: A point cloud colored according to temperature, with a thermal gradient from blue (cold) to red (hot)
- **Wellbore Geometry**: The main vertical wellbore and lateral branches are rendered as glowing cyan tubes
- **Interactive Navigation**: Drag to rotate, scroll to zoom, and explore the system from any angle

### Real-Time Simulation
The tool calculates the temperature distribution around the wellbore using line source theory, which models heat transfer through conduction in the rock formation. As you adjust parameters, the visualization updates instantly to reflect the new conditions.

### Thermal Drawdown Tracking
The application tracks thermal drawdown over time—the reduction in temperature difference between the rock and the circulating fluid. This metric is critical for assessing long-term system performance.

## User Interface

### Main Viewport (Left 75%)
The 3D visualization dominates the interface, showing:
- **Simulation Time** (top-left): Current simulation time in years and days
- **Thermal Drawdown** (top-right): Current temperature reduction in °C
- **Timeline Controls** (bottom): Play/pause, reset, and time slider for temporal navigation

### Control Panel (Right 25%)
The collapsible panel on the right contains all simulation parameters and statistics:

#### Primary Controls
- **Heat Extraction Rate**: Adjust the power extracted from the well (10-200 kW)
- **Animation Speed**: Control how fast time progresses in the visualization (0.1x-10x)

#### Visualization
- **Thermal Drawdown History**: A line chart showing how drawdown evolves over the simulation period

#### Statistics Display
- Current simulation time
- Current thermal drawdown
- Heat extraction rate
- Wellbore depth
- Number of laterals

#### Advanced Settings (Expandable)
- **Wellbore Depth**: Vertical depth of the main wellbore (1000-5000 m)
- **Number of Laterals**: How many lateral branches extend from the main wellbore (1-10)
- **Lateral Length**: Length of each lateral branch (100-1000 m)
- **Rock Thermal Conductivity**: Heat transfer capability of the rock formation (1-5 W/(m·K))

## How to Use

### Basic Workflow

1. **Start the Simulation**: The tool begins with default parameters (2000 m depth, 3 laterals, 50 kW extraction rate, 1 year simulation time)

2. **Adjust Heat Extraction Rate**: Use the slider to change how much power is extracted. Higher rates cause faster thermal drawdown

3. **Play the Animation**: Click the Play button to animate time progression. Watch the thermal drawdown increase as the system operates

4. **Monitor the Drawdown Chart**: The history chart on the right shows how drawdown accumulates over time

5. **Adjust Advanced Parameters**: Expand the Advanced Settings section to customize wellbore geometry and rock properties

### Interpreting the Visualization

- **Blue regions** (near the wellbore): Cooler areas where heat has been extracted
- **Cyan/Green regions**: Moderate temperature zones
- **Yellow/Orange/Red regions** (far from wellbore): Hotter undisturbed rock
- **Thermal Drawdown**: The larger this value, the more the system has cooled down, indicating performance degradation

### Exploring Different Scenarios

**High Heat Extraction**: Set the heat rate to 150 kW to see rapid thermal drawdown. This represents aggressive energy extraction.

**Deep Wells**: Increase wellbore depth to 4000 m. Deeper wells have more rock contact area and may show slower drawdown.

**Multiple Laterals**: Increase the number of laterals to 8-10. More laterals increase the heat exchange surface area and can improve long-term performance.

**Different Rock Properties**: Adjust thermal conductivity to simulate different geological formations. Higher conductivity means faster heat replenishment from surrounding rock.

## Technical Background

### Line Source Theory
The tool uses the line source model, which treats each wellbore segment as a continuous heat source/sink. The temperature change at any point in the rock is calculated using:

ΔT = (Q / (4πk)) × W(u)

where:
- Q is the heat extraction rate per unit length
- k is the rock thermal conductivity
- W(u) is the well function (related to the exponential integral)
- u = r² / (4αt) is a dimensionless parameter

### Superposition
For multi-lateral systems, the principle of superposition is applied: the total temperature change is the sum of contributions from all lateral segments.

### Thermal Drawdown
Thermal drawdown is the reduction in temperature at the wellbore wall over time:

Drawdown(t) = T_initial - T_wellbore(t)

This metric directly affects the efficiency of heat extraction—higher drawdown means lower temperature difference and reduced power output.

## Tips and Best Practices

1. **Start Simple**: Begin with default parameters to understand the baseline behavior, then adjust one parameter at a time

2. **Use Animation**: The animation feature helps visualize how thermal drawdown progresses. Faster speeds show long-term trends more quickly

3. **Compare Scenarios**: Run multiple simulations with different parameters to understand trade-offs (e.g., higher extraction rate vs. longer system life)

4. **Monitor the Chart**: The drawdown history chart is your key performance indicator. Steeper curves indicate faster degradation

5. **Rotate the View**: Use mouse drag to rotate the 3D view. Different angles reveal different aspects of the temperature distribution

## Common Questions

**Q: Why does thermal drawdown increase over time?**
A: As heat is extracted from the rock, the temperature near the wellbore decreases. Over time, this cooled region expands, reducing the temperature difference and thus the heat extraction rate.

**Q: How do I reduce thermal drawdown?**
A: Thermal drawdown is inevitable with continuous heat extraction. However, you can slow it by:
- Reducing the heat extraction rate
- Increasing wellbore depth or lateral length (more surface area)
- Choosing formations with higher thermal conductivity

**Q: What do the different colors mean?**
A: The thermal gradient represents temperature:
- Blue = Cold (cooled by extraction)
- Cyan/Green = Moderate
- Yellow = Warm
- Orange/Red = Hot (undisturbed rock)

**Q: Can I export the data?**
A: Currently, the tool provides visualization and real-time statistics. Data can be captured by taking screenshots or recording the animation.

## System Requirements

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM recommended
- Stable internet connection for optimal performance

## Troubleshooting

**Visualization not loading**: Ensure your browser supports WebGL. Try a different browser or update your graphics drivers.

**Slow performance**: Reduce animation speed or close other applications. The tool performs best with dedicated GPU resources.

**Unexpected values**: Reset the simulation using the Reset button and verify parameter settings in the Advanced Settings panel.

## Future Enhancements

Planned features for future versions include:
- Convection effects in fractured media
- Multiple independent circulation loops
- Thermal storage modeling
- Wellbore geometry optimization tools
- Data export in multiple formats
- Comparison tools for scenario analysis

## Support and Feedback

For questions, issues, or suggestions, please refer to the project documentation or contact the development team.

---

**Version**: 1.0  
**Last Updated**: February 2026  
**License**: MIT
