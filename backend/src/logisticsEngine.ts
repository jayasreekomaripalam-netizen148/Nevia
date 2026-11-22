export type VehicleType =
  | "LCV"
  | "MEDIUM_TRUCK"
  | "HEAVY_TRUCK"
  | "REFRIGERATED_TRUCK";

export type Priority =
  | "BALANCED"
  | "LOWEST_COST"
  | "FASTEST"
  | "SAFETY"
  | "ACCESSIBILITY";

export interface LogisticsInput {
  origin: string;
  destination: string;
  distanceKm: number;
  averageSpeedKmh: number;
  cargoType: string;
  weightKg: number;
  vehicle: VehicleType;
  priority: Priority;
}

export interface LogisticsResult {
  shipmentId: string;

  origin: string;
  destination: string;

  cargoType: string;
  weightKg: number;

  vehicle: {
    type: VehicleType;
    capacityKg: number;
    utilizationPercent: number;
    valid: boolean;
  };

  route: {
    distanceKm: number;
    estimatedTravelHours: number;
    estimatedTravelTime: string;
  };

  cost: {
    fuelCost: number;
    driverCost: number;
    maintenanceCost: number;
    tollEstimate: number;
    totalCost: number;
  };

  intelligence: {
    accessibility: number;
    safety: number;
    reliability: number;
    overallScore: number;
  };

  warnings: string[];

  generatedAt: string;
}

const VEHICLES: Record<
  VehicleType,
  {
    name: string;
    capacityKg: number;
    mileageKmPerLiter: number;
  }
> = {
  LCV: {
    name: "LCV — 3.5T",
    capacityKg: 3500,
    mileageKmPerLiter: 8,
  },

  MEDIUM_TRUCK: {
    name: "Medium Truck — 7.5T",
    capacityKg: 7500,
    mileageKmPerLiter: 6,
  },

  HEAVY_TRUCK: {
    name: "Heavy Truck — 16T",
    capacityKg: 16000,
    mileageKmPerLiter: 4.5,
  },

  REFRIGERATED_TRUCK: {
    name: "Refrigerated Truck",
    capacityKg: 10000,
    mileageKmPerLiter: 4,
  },
};

const DIESEL_PRICE_PER_LITER = 92;

const DRIVER_COST_PER_HOUR = 180;

const MAINTENANCE_COST_PER_KM = 2.5;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatTravelTime(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 60) {
    return `${wholeHours + 1}h 0m`;
  }

  return `${wholeHours}h ${minutes}m`;
}

function generateShipmentId(): string {
  const timestamp = Date.now().toString().slice(-8);

  return `NEVIA-${timestamp}`;
}

function estimateToll(
  distanceKm: number,
  vehicle: VehicleType,
): number {
  const tollRate: Record<VehicleType, number> = {
    LCV: 2.2,
    MEDIUM_TRUCK: 3.2,
    HEAVY_TRUCK: 4.5,
    REFRIGERATED_TRUCK: 3.8,
  };

  return round(distanceKm * tollRate[vehicle]);
}

function calculateAccessibility(
  distanceKm: number,
  vehicle: VehicleType,
): number {
  let score = 92;

  if (distanceKm > 500) {
    score -= 5;
  }

  if (distanceKm > 800) {
    score -= 8;
  }

  if (vehicle === "HEAVY_TRUCK") {
    score -= 5;
  }

  if (vehicle === "REFRIGERATED_TRUCK") {
    score -= 3;
  }

  return Math.max(50, Math.min(100, score));
}

function calculateSafety(
  distanceKm: number,
  averageSpeedKmh: number,
): number {
  let score = 90;

  if (distanceKm > 500) {
    score -= 4;
  }

  if (distanceKm > 800) {
    score -= 6;
  }

  if (averageSpeedKmh > 55) {
    score -= 3;
  }

  return Math.max(50, Math.min(100, score));
}

function calculateReliability(
  distanceKm: number,
  averageSpeedKmh: number,
): number {
  let score = 91;

  if (distanceKm > 500) {
    score -= 5;
  }

  if (distanceKm > 800) {
    score -= 5;
  }

  if (averageSpeedKmh < 35) {
    score -= 4;
  }

  return Math.max(45, Math.min(100, score));
}

function calculateOverallScore(
  accessibility: number,
  safety: number,
  reliability: number,
  priority: Priority,
): number {
  let score: number;

  switch (priority) {
    case "LOWEST_COST":
      score =
        accessibility * 0.2 +
        safety * 0.2 +
        reliability * 0.2 +
        40;
      break;

    case "FASTEST":
      score =
        accessibility * 0.15 +
        safety * 0.15 +
        reliability * 0.2 +
        50;
      break;

    case "SAFETY":
      score =
        accessibility * 0.2 +
        safety * 0.5 +
        reliability * 0.3;
      break;

    case "ACCESSIBILITY":
      score =
        accessibility * 0.5 +
        safety * 0.2 +
        reliability * 0.3;
      break;

    default:
      score =
        accessibility * 0.34 +
        safety * 0.33 +
        reliability * 0.33;
  }

  return round(Math.min(100, Math.max(0, score)));
}

export function calculateLogistics(
  input: LogisticsInput,
): LogisticsResult {
  const vehicle = VEHICLES[input.vehicle];

  if (!vehicle) {
    throw new Error("Unsupported vehicle type.");
  }

  if (input.distanceKm <= 0) {
    throw new Error("Distance must be greater than zero.");
  }

  if (input.averageSpeedKmh <= 0) {
    throw new Error("Average speed must be greater than zero.");
  }

  if (input.weightKg <= 0) {
    throw new Error("Cargo weight must be greater than zero.");
  }

  const utilizationPercent =
    (input.weightKg / vehicle.capacityKg) * 100;

  const valid = input.weightKg <= vehicle.capacityKg;

  const travelHours =
    input.distanceKm / input.averageSpeedKmh;

  const fuelLiters =
    input.distanceKm / vehicle.mileageKmPerLiter;

  const fuelCost =
    fuelLiters * DIESEL_PRICE_PER_LITER;

  const driverCost =
    travelHours * DRIVER_COST_PER_HOUR;

  const maintenanceCost =
    input.distanceKm * MAINTENANCE_COST_PER_KM;

  const tollEstimate = estimateToll(
    input.distanceKm,
    input.vehicle,
  );

  const totalCost =
    fuelCost +
    driverCost +
    maintenanceCost +
    tollEstimate;

  const accessibility = calculateAccessibility(
    input.distanceKm,
    input.vehicle,
  );

  const safety = calculateSafety(
    input.distanceKm,
    input.averageSpeedKmh,
  );

  const reliability = calculateReliability(
    input.distanceKm,
    input.averageSpeedKmh,
  );

  const overallScore = calculateOverallScore(
    accessibility,
    safety,
    reliability,
    input.priority,
  );

  const warnings: string[] = [];

  if (!valid) {
    warnings.push(
      `Cargo weight exceeds the ${vehicle.capacityKg} kg vehicle capacity.`,
    );
  }

  if (utilizationPercent > 90 && valid) {
    warnings.push(
      "Vehicle utilization is above 90%.",
    );
  }

  if (input.distanceKm > 800) {
    warnings.push(
      "Long-distance route. Driver rest planning should be considered.",
    );
  }

  if (input.averageSpeedKmh < 35) {
    warnings.push(
      "Low average speed may indicate difficult road conditions or congestion.",
    );
  }

  return {
    shipmentId: generateShipmentId(),

    origin: input.origin,
    destination: input.destination,

    cargoType: input.cargoType,
    weightKg: input.weightKg,

    vehicle: {
      type: input.vehicle,
      capacityKg: vehicle.capacityKg,
      utilizationPercent: round(utilizationPercent),
      valid,
    },

    route: {
      distanceKm: round(input.distanceKm),
      estimatedTravelHours: round(travelHours),
      estimatedTravelTime:
        formatTravelTime(travelHours),
    },

    cost: {
      fuelCost: round(fuelCost),
      driverCost: round(driverCost),
      maintenanceCost: round(maintenanceCost),
      tollEstimate: round(tollEstimate),
      totalCost: round(totalCost),
    },

    intelligence: {
      accessibility,
      safety,
      reliability,
      overallScore,
    },

    warnings,

    generatedAt: new Date().toISOString(),
  };
}

