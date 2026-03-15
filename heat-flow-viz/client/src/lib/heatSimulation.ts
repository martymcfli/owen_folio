/**
 * Heat Transfer Simulation Engine
 * Implements line source theory for conduction-only heat extraction
 * from multi-lateral closed-loop geothermal wells.
 */

export interface WellboreGeometry {
  depth: number; // meters
  radius: number; // meters
  laterals: Lateral[];
}

export interface Lateral {
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  length: number; // meters
}

export interface RockProperties {
  thermalConductivity: number; // W/(m·K)
  thermalDiffusivity: number; // m²/s
  initialTemperature: number; // °C
  density: number; // kg/m³
  specificHeat: number; // J/(kg·K)
}

export interface SimulationParameters {
  wellbore: WellboreGeometry;
  rock: RockProperties;
  heatExtractionRate: number; // W
  simulationTime: number; // seconds
}

export interface TemperatureField {
  values: number[]; // Temperature at each grid point
  gridSize: number; // Number of points per dimension
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
}

/**
 * Approximates the well function W(u) using the exponential integral
 * W(u) = -E₁(u) ≈ -ln(u) - γ + series expansion
 */
function wellFunction(u: number): number {
  const gamma = 0.5772156649; // Euler-Mascheroni constant

  if (u < 0.01) {
    // For small u, use series expansion
    return -Math.log(u) - gamma + u - (u * u) / 4 + (u * u * u) / 18;
  } else if (u < 100) {
    // For moderate u, use exponential integral approximation
    // E₁(u) ≈ exp(-u) * (1 + u) / (u * (1 + u + u²/2))
    const exp_neg_u = Math.exp(-u);
    return -Math.log(u) - gamma + u * exp_neg_u;
  } else {
    // For large u, E₁(u) ≈ exp(-u) / u
    return Math.exp(-u) / u;
  }
}

/**
 * Calculates temperature change at a point due to a single line source
 * using line source theory (modified Kelvin's theory)
 *
 * ΔT = (Q / (4πk)) * W(u)
 * where u = r² / (4αt)
 */
function temperatureFromLineSource(
  point: { x: number; y: number; z: number },
  lateral: Lateral,
  heatRate: number, // W/m of wellbore
  thermalConductivity: number,
  thermalDiffusivity: number,
  time: number
): number {
  // Find closest point on lateral to the point
  const dx = lateral.endX - lateral.startX;
  const dy = lateral.endY - lateral.startY;
  const dz = lateral.endZ - lateral.startZ;

  const lateralLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (lateralLength === 0) return 0;

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - lateral.startX) * dx +
        (point.y - lateral.startY) * dy +
        (point.z - lateral.startZ) * dz) /
        (lateralLength * lateralLength)
    )
  );

  const closestX = lateral.startX + t * dx;
  const closestY = lateral.startY + t * dy;
  const closestZ = lateral.startZ + t * dz;

  // Distance from point to closest point on lateral
  const distX = point.x - closestX;
  const distY = point.y - closestY;
  const distZ = point.z - closestZ;
  const r = Math.sqrt(distX * distX + distY * distY + distZ * distZ);

  // Avoid singularity at the wellbore
  const r_safe = Math.max(r, 0.01);

  // Calculate dimensionless time parameter
  const time_safe = Math.max(time, 1); // Avoid log(0)
  const u = (r_safe * r_safe) / (4 * thermalDiffusivity * time_safe);

  // Temperature change using line source theory
  const W = wellFunction(u);
  const deltaT = (heatRate / (4 * Math.PI * thermalConductivity)) * W;

  return deltaT;
}

/**
 * Generates a 3D temperature field using superposition of line sources
 */
export function generateTemperatureField(
  params: SimulationParameters,
  gridSize: number = 30
): TemperatureField {
  const { wellbore, rock, heatExtractionRate, simulationTime } = params;

  // Define simulation domain bounds
  const maxLateralExtent = Math.max(
    ...wellbore.laterals.map((l) => Math.max(Math.abs(l.endX), Math.abs(l.endY)))
  );
  const domainExtent = maxLateralExtent + 500; // Add 500m buffer

  const minX = -domainExtent;
  const maxX = domainExtent;
  const minY = -domainExtent;
  const maxY = domainExtent;
  const minZ = -wellbore.depth - 200;
  const maxZ = 0;

  const values: number[] = [];
  const step = domainExtent / (gridSize / 2);

  // Calculate heat extraction rate per unit length
  const totalLateralLength = wellbore.laterals.reduce((sum, l) => sum + l.length, 0);
  const heatRatePerMeter = totalLateralLength > 0 ? heatExtractionRate / totalLateralLength : 0;

  // Generate temperature field
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      for (let k = 0; k < gridSize; k++) {
        const x = minX + (i / (gridSize - 1)) * (maxX - minX);
        const y = minY + (j / (gridSize - 1)) * (maxY - minY);
        const z = minZ + (k / (gridSize - 1)) * (maxZ - minZ);

        const point = { x, y, z };

        // Superposition: sum contributions from all laterals
        let totalDeltaT = 0;
        for (const lateral of wellbore.laterals) {
          const deltaT = temperatureFromLineSource(
            point,
            lateral,
            heatRatePerMeter,
            rock.thermalConductivity,
            rock.thermalDiffusivity,
            simulationTime
          );
          totalDeltaT += deltaT;
        }

        // Final temperature is initial temperature minus drawdown
        const temperature = rock.initialTemperature - totalDeltaT;
        values.push(temperature);
      }
    }
  }

  return {
    values,
    gridSize,
    bounds: { minX, maxX, minY, maxY, minZ, maxZ },
  };
}

/**
 * Creates a default multi-lateral well configuration
 */
export function createDefaultWellbore(depth: number = 2000, lateralCount: number = 3): WellboreGeometry {
  const laterals: Lateral[] = [];
  const lateralLength = 500;
  const lateralSpacing = 200;

  for (let i = 0; i < lateralCount; i++) {
    const angle = (i / lateralCount) * Math.PI * 2;
    const startZ = -(depth * 0.7 + i * 100); // Stagger laterals at different depths
    const endX = Math.cos(angle) * lateralLength;
    const endY = Math.sin(angle) * lateralLength;

    laterals.push({
      startX: 0,
      startY: 0,
      startZ,
      endX,
      endY,
      endZ: startZ - 50, // Slight downward angle
      length: lateralLength,
    });
  }

  return {
    depth,
    radius: 0.075,
    laterals,
  };
}

/**
 * Creates default rock properties for typical sedimentary formations
 */
export function createDefaultRockProperties(): RockProperties {
  return {
    thermalConductivity: 2.5, // W/(m·K)
    thermalDiffusivity: 1.0e-6, // m²/s
    initialTemperature: 80, // °C at depth
    density: 2500, // kg/m³
    specificHeat: 800, // J/(kg·K)
  };
}

/**
 * Calculates thermal drawdown at a specific location
 */
export function calculateThermalDrawdown(
  params: SimulationParameters,
  location: { x: number; y: number; z: number }
): number {
  const { wellbore, rock, heatExtractionRate, simulationTime } = params;
  const totalLateralLength = wellbore.laterals.reduce((sum, l) => sum + l.length, 0);
  const heatRatePerMeter = totalLateralLength > 0 ? heatExtractionRate / totalLateralLength : 0;

  let totalDeltaT = 0;
  for (const lateral of wellbore.laterals) {
    const deltaT = temperatureFromLineSource(
      location,
      lateral,
      heatRatePerMeter,
      rock.thermalConductivity,
      rock.thermalDiffusivity,
      simulationTime
    );
    totalDeltaT += deltaT;
  }

  return totalDeltaT;
}

/**
 * Calculates average thermal drawdown at the wellbore
 */
export function calculateAverageWellboreDrawdown(params: SimulationParameters): number {
  const { wellbore } = params;

  // Sample drawdown at multiple points along the laterals
  let totalDrawdown = 0;
  let sampleCount = 0;

  for (const lateral of wellbore.laterals) {
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const x = lateral.startX + t * (lateral.endX - lateral.startX);
      const y = lateral.startY + t * (lateral.endY - lateral.startY);
      const z = lateral.startZ + t * (lateral.endZ - lateral.startZ);

      const drawdown = calculateThermalDrawdown(params, { x, y, z });
      totalDrawdown += drawdown;
      sampleCount++;
    }
  }

  return totalDrawdown / sampleCount;
}
