
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Mail, Lock, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !password) return
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/">
          <Truck size={30} /> NEVIA
        </Link>
      </div>

      <div className="auth-card">
        <div className="auth-icon"><Truck size={30} /></div>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your NEVIA account</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-submit" type="submit">
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>

        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    </div>
  )
}

export default Login
