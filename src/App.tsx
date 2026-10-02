import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gauge,
  Menu,
  Navigation,
  Package,
  Route,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Page =
  | "dashboard"
  | "planner"
  | "shipments"
  | "analytics";

type VehicleType =
  | "LCV"
  | "MEDIUM_TRUCK"
  | "HEAVY_TRUCK"
  | "REFRIGERATED_TRUCK";

type Priority =
  | "BALANCED"
  | "LOWEST_COST"
  | "FASTEST"
  | "SAFETY"
  | "ACCESSIBILITY";

interface AnalysisResult {
  shipmentId: string;
  origin: string;
  destination: string;
  cargoType: string;
  weightKg: number;

  vehicle: {
    type: string;
    capacityKg: number;
    utilizationPercent: number;
    valid: boolean;
  };

  route: {
    distanceKm: number;
    averageSpeedKmh: number;
    travelHours: number;
    estimatedTime: string;
  };

  cost: {
    fuelLiters: number;
    fuelCost: number;
    driverCost: number;
    maintenanceCost: number;
    tollCost: number;
    total: number;
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

interface RouteData {
  id: string;
  name: string;
  distance: number;
  time: string;
  cost: number;
  accessibility: number;
  safety: number;
  score: number;
  path: [number, number][];
}

const routes: RouteData[] = [
  {
    id: "A",
    name: "NH-306 & NH-6 Golden Corridor",
    distance: 468,
    time: "11h",
    cost: 8500,
    accessibility: 88,
    safety: 86,
    score: 86,
    path: [
      [23.7271, 92.7176],
      [24.2, 92.55],
      [25.0, 91.8],
      [25.5788, 91.8933],
      [26.1445, 91.7362],
    ],
  },

  {
    id: "B",
    name: "NH-6 Alternate Corridor",
    distance: 512,
    time: "12h 20m",
    cost: 7900,
    accessibility: 81,
    safety: 84,
    score: 82,
    path: [
      [23.7271, 92.7176],
      [24.5, 92.7],
      [25.3, 92.0],
      [26.0, 91.9],
      [26.1445, 91.7362],
    ],
  },

  {
    id: "C",
    name: "Regional Connectivity Route",
    distance: 495,
    time: "12h 45m",
    cost: 7300,
    accessibility: 74,
    safety: 79,
    score: 77,
    path: [
      [23.7271, 92.7176],
      [24.1, 92.9],
      [24.9, 92.3],
      [25.7, 92.0],
      [26.1445, 91.7362],
    ],
  },
];

function Score({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="score-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>

      <div>
        <span className="metric-label">{label}</span>

        <strong className="metric-value">
          {value}
        </strong>

        <small>{helper}</small>
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [page, setPage] =
    useState<Page>("dashboard");

  const [origin, setOrigin] =
    useState("Aizawl");

  const [destination, setDestination] =
    useState("Guwahati");

  const [cargo, setCargo] =
    useState("Vegetables & Perishables");

  const [weight, setWeight] =
    useState("500");

  const [vehicle, setVehicle] =
    useState<VehicleType>("LCV");

  const [priority, setPriority] =
    useState<Priority>("BALANCED");

  const [_analyzed, setAnalyzed] = useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

  const [selectedRoute, setSelectedRoute] =
    useState("A");

  const selectedRouteData =
    routes.find(
      (route) => route.id === selectedRoute,
    ) ?? routes[0];

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setSidebarOpen(false);
  };

  const analyzeRoute = async () => {
    setAnalyzed(false);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setApiError("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/logistics/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            origin,
            destination,
            cargoType: cargo,
            weightKg: Number(weight),

            distanceKm:
              selectedRouteData.distance,

            averageSpeedKmh: 42,

            vehicle,
            priority,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to analyze shipment.",
        );
      }

      setAnalysisResult(result.data);
      setAnalyzed(true);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to connect to NEVIA backend.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Navigation size={21} />
          </div>

          <div>
            <h1>NEVIA</h1>
            <span>
              Logistics Intelligence
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              page === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("dashboard")
            }
          >
            <Activity size={18} />
            Dashboard
          </button>

          <button
            className={
              page === "planner"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("planner")
            }
          >
            <Route size={18} />
            Route Planner
          </button>

          <button
            className={
              page === "shipments"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("shipments")
            }
          >
            <Package size={18} />
            Shipments
          </button>

          <button
            className={
              page === "analytics"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("analytics")
            }
          >
            <BarChart3 size={18} />
            Analytics
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot" />
            System operational
          </div>

          <div className="sidebar-version">
            NEVIA v1.0
          </div>

        </div>
      </aside>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen,
              )
            }
          >
            {sidebarOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          <div className="topbar-title">

            <span>
              Northeast India
            </span>

            <strong>
              AI-powered logistics
              intelligence
            </strong>

          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            Live system
          </div>

        </header>

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <section className="page-content">

            <div className="hero">

              <div>

                <span className="eyebrow">
                  SMART LOGISTICS PLATFORM
                </span>

                <h2>
                  Smarter routes.
                  <br />
                  Better connectivity.
                </h2>

                <p>
                  NEVIA helps logistics
                  operators plan safer,
                  more accessible and
                  cost-aware transportation
                  across Northeast India.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("planner")
                  }
                >
                  Plan a shipment
                  <ArrowRight size={17} />
                </button>

              </div>

              <div className="hero-visual">

                <div className="hero-route-line" />

                <div className="hero-node node-one" />

                <div className="hero-node node-two" />

                <div className="hero-node node-three" />

                <div className="hero-route-label">
                  Northeast Connectivity
                </div>

              </div>

            </div>

            <div className="metrics-grid">

              <Metric
                icon={<Route size={20} />}
                label="Routes analyzed"
                value="1,248"
                helper="Across Northeast India"
              />

              <Metric
                icon={<Truck size={20} />}
                label="Active shipments"
                value="86"
                helper="Currently monitored"
              />

              <Metric
                icon={
                  <CircleDollarSign
                    size={20}
                  />
                }
                label="Cost optimized"
                value="₹18.4L"
                helper="Estimated savings"
              />

              <Metric
                icon={
                  <ShieldCheck
                    size={20}
                  />
                }
                label="Reliability"
                value="91%"
                helper="Network average"
              />

            </div>

            <div className="section-heading">

              <div>

                <span className="eyebrow">
                  QUICK PLANNING
                </span>

                <h3>
                  Build a shipment plan
                </h3>

              </div>

              <button
                className="text-button"
                onClick={() =>
                  navigate("planner")
                }
              >
                Open planner
                <ChevronRight
                  size={16}
                />
              </button>

            </div>

            <div className="quick-planner">

              <div className="quick-field">
                <label>Origin</label>
                <strong>
                  {origin}
                </strong>
              </div>

              <div className="quick-arrow">
                <ArrowRight size={18} />
              </div>

              <div className="quick-field">
                <label>
                  Destination
                </label>
                <strong>
                  {destination}
                </strong>
              </div>

              <div className="quick-field">
                <label>Cargo</label>
                <strong>
                  {cargo}
                </strong>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("planner")
                }
              >
                Analyze
              </button>

            </div>

          </section>
        )}

        {/* ROUTE PLANNER */}

        {page === "planner" && (
          <section className="page-content">

            <div className="section-heading planner-heading">

              <div>

                <span className="eyebrow">
                  ROUTE INTELLIGENCE
                </span>

                <h2>
                  Plan your shipment
                </h2>

                <p>
                  Configure the shipment
                  and let NEVIA calculate
                  route intelligence,
                  transportation cost
                  and operational scores.
                </p>

              </div>

            </div>

            <div className="planner-grid">

              {/* SHIPMENT FORM */}

              <div className="planner-panel">

                <div className="panel-header">

                  <div>

                    <span className="eyebrow">
                      SHIPMENT
                      CONFIGURATION
                    </span>

                    <h3>
                      Shipment details
                    </h3>

                  </div>

                  <Package size={21} />

                </div>

                <div className="form-grid">

                  <label className="form-field">

                    <span>Origin</span>

                    <input
                      value={origin}
                      onChange={(event) =>
                        setOrigin(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Enter origin"
                    />

                  </label>

                  <label className="form-field">

                    <span>
                      Destination
                    </span>

                    <input
                      value={destination}
                      onChange={(event) =>
                        setDestination(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Enter destination"
                    />

                  </label>

                  <label className="form-field">

                    <span>
                      Cargo type
                    </span>

                    <input
                      value={cargo}
                      onChange={(event) =>
                        setCargo(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Enter cargo type"
                    />

                  </label>

                  <label className="form-field">

                    <span>
                      Weight (kg)
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={weight}
                      onChange={(event) =>
                        setWeight(
                          event.target
                            .value,
                        )
                      }
                    />

                  </label>

                  <label className="form-field">

                    <span>
                      Vehicle
                    </span>

                    <select
                      value={vehicle}
                      onChange={(event) =>
                        setVehicle(
                          event.target
                            .value as VehicleType,
                        )
                      }
                    >

                      <option value="LCV">
                        LCV — 3.5T
                      </option>

                      <option value="MEDIUM_TRUCK">
                        Medium Truck —
                        7.5T
                      </option>

                      <option value="HEAVY_TRUCK">
                        Heavy Truck —
                        16T
                      </option>

                      <option value="REFRIGERATED_TRUCK">
                        Refrigerated Truck
                        — 10T
                      </option>

                    </select>

                  </label>

                  <label className="form-field">

                    <span>
                      Planning priority
                    </span>

                    <select
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target
                            .value as Priority,
                        )
                      }
                    >

                      <option value="BALANCED">
                        Balanced
                      </option>

                      <option value="LOWEST_COST">
                        Lowest cost
                      </option>

                      <option value="FASTEST">
                        Fastest
                      </option>

                      <option value="SAFETY">
                        Safety
                      </option>

                      <option value="ACCESSIBILITY">
                        Accessibility
                      </option>

                    </select>

                  </label>

                </div>

                <button
                  className="primary-button analyze-button"
                  onClick={
                    analyzeRoute
                  }
                  disabled={
                    isAnalyzing
                  }
                >

                  {isAnalyzing
                    ? "Analyzing..."
                    : "Analyze Route"}

                  {!isAnalyzing && (
                    <ArrowRight
                      size={17}
                    />
                  )}

                </button>

                {apiError && (
                  <div className="api-error">
                    {apiError}
                  </div>
                )}

                {analysisResult && (
                  <div className="analysis-success">

                    <div>

                      <span>
                        Shipment analyzed
                      </span>

                      <strong>
                        {
                          analysisResult.shipmentId
                        }
                      </strong>

                    </div>

                    <CheckCircle2
                      size={21}
                    />

                  </div>
                )}

              </div>

              {/* MAP */}

              <div className="map-panel">

                <div className="map-header">

                  <div>

                    <span className="eyebrow">
                      NETWORK MAP
                    </span>

                    <h3>
                      {origin} →{" "}
                      {destination}
                    </h3>

                  </div>

                  <div className="map-live">
  <span className="status-dot" />
  Route preview
</div>

</div>

<div className="map-wrapper">
  <MapContainer
    center={[25.2, 92.1]}
    zoom={6}
    scrollWheelZoom={true}
    className="nevia-map"
  >
    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <Polyline
      positions={selectedRouteData.path}
      pathOptions={{
        weight: 5,
      }}
    />

    <Marker
      position={selectedRouteData.path[0]}
      icon={markerIcon}
    >
      <Popup>
        <strong>{origin}</strong>
      </Popup>
    </Marker>

    <Marker
      position={
        selectedRouteData.path[
          selectedRouteData.path.length - 1
        ]
      }
      icon={markerIcon}
    >
      <Popup>
        <strong>{destination}</strong>
      </Popup>
    </Marker>
  </MapContainer>
</div>

</div>
</div>

<div className="section-heading">
  <div>
    <span className="eyebrow">
      ROUTE OPTIONS
    </span>

    <h3>
      Recommended transportation routes
    </h3>
  </div>
</div>

<div className="route-grid">
  {routes.map((route) => (
    <button
      key={route.id}
      className={`route-card ${
        selectedRoute === route.id
          ? "selected"
          : ""
      }`}
      onClick={() =>
        setSelectedRoute(route.id)
      }
    >
      <div className="route-card-top">
        <div className="route-number">
          {route.id}
        </div>

        {selectedRoute === route.id && (
          <span className="recommended">
            Selected
          </span>
        )}
      </div>

      <h4>{route.name}</h4>

      <div className="route-stats">
        <div>
          <span>Distance</span>
          <strong>
            {route.distance} km
          </strong>
        </div>

        <div>
          <span>Time</span>
          <strong>{route.time}</strong>
        </div>

        <div>
          <span>Est. cost</span>
          <strong>
            ₹
            {route.cost.toLocaleString(
              "en-IN",
            )}
          </strong>
        </div>
      </div>

      <div className="score-list">
        <Score
          label="Accessibility"
          value={route.accessibility}
        />

        <Score
          label="Safety"
          value={route.safety}
        />

        <Score
          label="Overall"
          value={route.score}
        />
      </div>
    </button>
  ))}
</div>

{analysisResult && (
  <div className="results-section">
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          BACKEND ANALYSIS
        </span>

        <h3>
          NEVIA logistics intelligence
        </h3>
      </div>
    </div>

    <div className="metrics-grid">
      <Metric
        icon={<Route size={20} />}
        label="Distance"
        value={`${analysisResult.route.distanceKm} km`}
        helper={`${analysisResult.route.travelHours} hours estimated`}
      />

      <Metric
        icon={
          <CircleDollarSign size={20} />
        }
        label="Total cost"
        value={`₹${analysisResult.cost.total.toLocaleString(
          "en-IN",
        )}`}
        helper="Calculated by NEVIA engine"
      />

      <Metric
        icon={<Gauge size={20} />}
        label="Overall score"
        value={`${analysisResult.intelligence.overallScore}`}
        helper="Route intelligence"
      />

      <Metric
        icon={<ShieldCheck size={20} />}
        label="Safety"
        value={`${analysisResult.intelligence.safety}`}
        helper="Safety assessment"
      />
    </div>

    <div className="analysis-grid">

      <div className="analysis-card">
        <span className="eyebrow">
          VEHICLE UTILIZATION
        </span>

        <h4>
          {analysisResult.vehicle.utilizationPercent.toFixed(
            1,
          )}
          %
        </h4>

        <p>
          {analysisResult.weightKg} kg cargo /{" "}
          {analysisResult.vehicle.capacityKg} kg
          capacity
        </p>
      </div>

      <div className="analysis-card">
        <span className="eyebrow">
          COST BREAKDOWN
        </span>

        <div className="cost-list">

          <div>
            <span>Fuel</span>
            <strong>
              ₹
              {analysisResult.cost.fuelCost.toLocaleString(
                "en-IN",
              )}
            </strong>
          </div>

          <div>
            <span>Driver</span>
            <strong>
              ₹
              {analysisResult.cost.driverCost.toLocaleString(
                "en-IN",
              )}
            </strong>
          </div>

          <div>
            <span>Maintenance</span>
            <strong>
              ₹
              {analysisResult.cost.maintenanceCost.toLocaleString(
                "en-IN",
              )}
            </strong>
          </div>

          <div>
            <span>Toll</span>
            <strong>
              ₹
              {analysisResult.cost.tollCost.toLocaleString(
                "en-IN",
              )}
            </strong>
          </div>

        </div>
      </div>

      <div className="analysis-card">
        <span className="eyebrow">
          INTELLIGENCE
        </span>

        <div className="score-list">

          <Score
            label="Accessibility"
            value={
              analysisResult.intelligence
                .accessibility
            }
          />

          <Score
            label="Safety"
            value={
              analysisResult.intelligence
                .safety
            }
          />

          <Score
            label="Reliability"
            value={
              analysisResult.intelligence
                .reliability
            }
          />

          <Score
            label="Overall"
            value={
              analysisResult.intelligence
                .overallScore
            }
          />

        </div>
      </div>

    </div>

    {analysisResult.warnings.length > 0 && (
      <div className="warning-card">
        <strong>
          Operational warnings
        </strong>

        <ul>
          {analysisResult.warnings.map(
            (warning) => (
              <li key={warning}>
                {warning}
              </li>
            ),
          )}
        </ul>
      </div>
    )}

  </div>
)}

</section>
)}

{page === "shipments" && (
  <section className="page-content placeholder-page">

    <span className="eyebrow">
      SHIPMENT OPERATIONS
    </span>

    <h2>Shipments</h2>

    <p>
      Shipment monitoring and operational
      tracking will appear here.
    </p>

    <button
      className="primary-button"
      onClick={() =>
        navigate("planner")
      }
    >
      Create shipment
      <ArrowRight size={17} />
    </button>

  </section>
)}

{page === "analytics" && (
  <section className="page-content placeholder-page">

    <span className="eyebrow">
      LOGISTICS INTELLIGENCE
    </span>

    <h2>Analytics</h2>

    <p>
      Cost, route reliability,
      accessibility and transportation
      analytics will appear here.
    </p>

    <div className="metrics-grid">

      <Metric
        icon={<Route size={20} />}
        label="Routes"
        value="1,248"
        helper="Analyzed"
      />

      <Metric
        icon={<Truck size={20} />}
        label="Shipments"
        value="86"
        helper="Active"
      />

      <Metric
        icon={<Gauge size={20} />}
        label="Reliability"
        value="91%"
        helper="Network average"
      />

    </div>

  </section>
)}

<footer className="footer">
  <span>
    NEVIA — Northeast Logistics
    Intelligence
  </span>

  <span>
    Powered by route intelligence &amp; data
  </span>
</footer>

</main>

</div>

  );
}

export default App;

