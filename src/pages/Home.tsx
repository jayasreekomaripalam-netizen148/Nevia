
import { Link } from 'react-router-dom'
import {
  Truck,
  MapPin,
  ShieldCheck,
  BrainCircuit,
  Package,
  ArrowRight,
  Menu
} from 'lucide-react'
import './home.css'

function Home() {
  return (
    <div className="nevia">

      <header className="navbar">
        <Link to="/" className="brand">
          <Truck size={30} />
          <span>NEVIA</span>
        </Link>

        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">Get Started</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              SMART LOGISTICS FOR NORTHEAST INDIA
            </span>

            <h1>
              Moving Northeast India
              <span> Smarter.</span>
            </h1>

            <p>
              NEVIA is an intelligent logistics platform designed
              to simplify transportation, optimize delivery routes
              and connect businesses across Northeast India.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-btn">
                Start Shipping <ArrowRight size={18} />
              </Link>

              <Link to="/login" className="secondary-btn">
                Explore Dashboard
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <h3>AI</h3>
                <p>Route Intelligence</p>
              </div>
              <div>
                <h3>24/7</h3>
                <p>Shipment Visibility</p>
              </div>
              <div>
                <h3>NE</h3>
                <p>Regional Focus</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-top">
                <MapPin size={22} />
                <span>Smart Route Overview</span>
              </div>

              <div className="route-point">
                <span className="dot green"></span>
                <div>
                  <small>ORIGIN</small>
                  <h3>Aizawl</h3>
                </div>
              </div>

              <div className="route-line"></div>

              <div className="route-point">
                <span className="dot blue"></span>
                <div>
                  <small>DESTINATION</small>
                  <h3>Guwahati</h3>
                </div>
              </div>

              <div className="route-info">
                <div>
                  <small>Route distance</small>
                  <strong>468 km</strong>
                </div>
                <div>
                  <small>AI optimization</small>
                  <strong>Enabled</strong>
                </div>
              </div>

              <div className="route-status">
                <ShieldCheck size={18} />
                Smart logistics experience
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <span>OUR TECHNOLOGY</span>
            <h2>Logistics powered by intelligence</h2>
            <p>Technology that makes transportation smarter and simpler.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <BrainCircuit size={32} />
              <h3>AI Route Optimization</h3>
              <p>Plan smarter routes with intelligent logistics decision support.</p>
            </article>

            <article className="feature-card">
              <MapPin size={32} />
              <h3>Live Tracking</h3>
              <p>Monitor shipment progress and improve delivery visibility.</p>
            </article>

            <article className="feature-card">
              <Truck size={32} />
              <h3>Fleet Management</h3>
              <p>Organize vehicles, transportation and delivery operations.</p>
            </article>

            <article className="feature-card">
              <Package size={32} />
              <h3>Shipment Management</h3>
              <p>Manage shipments through a centralized digital platform.</p>
            </article>
          </div>
        </section>

        <section className="about" id="about">
          <div>
            <span>WHY NEVIA?</span>
            <h2>Connecting businesses across Northeast India.</h2>
            <p>
              Our vision is to make regional transportation more
              connected, transparent and efficient through technology.
            </p>
            <Link to="/register" className="primary-btn">
              Join NEVIA <ArrowRight size={18} />
            </Link>
          </div>
          <div className="about-icon">
            <Truck size={100} />
            <Menu size={28} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <h2>NEVIA</h2>
        <p>Smarter Logistics. Stronger Connections.</p>
        <p>© 2026 NEVIA. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default Home
