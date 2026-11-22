
import { Link, useNavigate } from 'react-router-dom'
import {
  Truck, Package, MapPin, Users, LayoutDashboard,
  Settings, LogOut, Bell, TrendingUp
} from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const shipments = [
    { id: 'NV1001', route: 'Aizawl → Guwahati', status: 'In Transit', amount: '₹8,500' },
    { id: 'NV1002', route: 'Shillong → Imphal', status: 'Delivered', amount: '₹6,200' },
    { id: 'NV1003', route: 'Agartala → Aizawl', status: 'Pending', amount: '₹5,800' },
    { id: 'NV1004', route: 'Guwahati → Kohima', status: 'In Transit', amount: '₹7,400' }
  ]

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link to="/" className="dashboard-logo">
          <Truck size={28} /> NEVIA
        </Link>

        <p className="sidebar-label">WORKSPACE</p>

        <a className="sidebar-link active" href="#overview">
          <LayoutDashboard size={19} /> Overview
        </a>
        <a className="sidebar-link" href="#shipments">
          <Package size={19} /> Shipments
        </a>
        <a className="sidebar-link" href="#tracking">
          <MapPin size={19} /> Tracking
        </a>
        <a className="sidebar-link" href="#fleet">
          <Truck size={19} /> Fleet
        </a>
        <a className="sidebar-link" href="#customers">
          <Users size={19} /> Customers
        </a>
        <a className="sidebar-link" href="#settings">
          <Settings size={19} /> Settings
        </a>

        <button
          className="sidebar-logout"
          onClick={() => navigate('/login')}
        >
          <LogOut size={19} /> Sign Out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome to your NEVIA logistics workspace.</p>
          </div>
          <div className="dashboard-user">
            <Bell size={21} />
            <span>Administrator</span>
          </div>
        </header>

        <section className="welcome-banner" id="overview">
          <div>
            <span>NEVIA LOGISTICS PLATFORM</span>
            <h2>Manage your logistics smarter.</h2>
            <p>Monitor shipments, fleet operations and delivery performance.</p>
          </div>
          <Truck size={90} />
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <Package size={27} />
            <p>Total Shipments</p>
            <h2>1,248</h2>
            <small><TrendingUp size={14} /> Sample overview</small>
          </article>

          <article className="stat-card">
            <Truck size={27} />
            <p>Active Vehicles</p>
            <h2>86</h2>
            <small>Sample overview</small>
          </article>

          <article className="stat-card">
            <MapPin size={27} />
            <p>In Transit</p>
            <h2>32</h2>
            <small>Sample overview</small>
          </article>

          <article className="stat-card">
            <Users size={27} />
            <p>Customers</p>
            <h2>540</h2>
            <small>Sample overview</small>
          </article>
        </section>

        <section className="shipment-section" id="shipments">
          <div className="shipment-heading">
            <div>
              <h2>Recent Shipments</h2>
              <p>Example shipment records</p>
            </div>
            <button onClick={() => navigate('/')}>Home</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.id}</td>
                    <td>{shipment.route}</td>
                    <td>
                      <span className={`status ${shipment.status.toLowerCase().replace(' ', '-')}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td>{shipment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dashboard-footer">
          NEVIA © 2026 — Smarter Logistics. Stronger Connections.
        </footer>
      </main>
    </div>
  )
}

export default Dashboard
