import express from "express";
import cors from "cors";

import {
  calculateLogistics,
  LogisticsInput,
} from "./logisticsEngine.js";

const app = express();

const PORT = 4000;

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "NEVIA Logistics Intelligence API",
    status: "operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/logistics/analyze", (req, res) => {
  try {
    const body = req.body as Partial<LogisticsInput>;

    if (!body.origin) {
      return res.status(400).json({
        success: false,
        error: "Origin is required.",
      });
    }

    if (!body.destination) {
      return res.status(400).json({
        success: false,
        error: "Destination is required.",
      });
    }

    if (!body.cargoType) {
      return res.status(400).json({
        success: false,
        error: "Cargo type is required.",
      });
    }

    if (
      typeof body.weightKg !== "number" ||
      body.weightKg <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid cargo weight is required.",
      });
    }

    if (
      typeof body.distanceKm !== "number" ||
      body.distanceKm <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid route distance is required.",
      });
    }

    if (
      typeof body.averageSpeedKmh !== "number" ||
      body.averageSpeedKmh <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid average speed is required.",
      });
    }

    if (!body.vehicle) {
      return res.status(400).json({
        success: false,
        error: "Vehicle type is required.",
      });
    }

    if (!body.priority) {
      return res.status(400).json({
        success: false,
        error: "Planning priority is required.",
      });
    }

    const result = calculateLogistics({
      origin: body.origin,
      destination: body.destination,
      cargoType: body.cargoType,
      weightKg: body.weightKg,
      distanceKm: body.distanceKm,
      averageSpeedKmh: body.averageSpeedKmh,
      vehicle: body.vehicle,
      priority: body.priority,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error.";

    return res.status(500).json({
      success: false,
      error: message,
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("========================================");
  console.log(" NEVIA Logistics Intelligence API");
  console.log("========================================");
  console.log(` API: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(" Status: Operational");
  console.log("========================================");
  console.log("");
});

