
import { Link, useNavigate } from 'react-router-dom'
import { Truck, User, Mail, Lock, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !email || !password) return
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/"><Truck size={30} /> NEVIA</Link>
      </div>

      <div className="auth-card">
        <div className="auth-icon"><User size={30} /></div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join the smarter logistics network</p>

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <div className="auth-input">
            <User size={19} />
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Your email address"
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
              placeholder="Create a password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-submit" type="submit">
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign In</Link>
        </p>

        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    </div>
  )
}

export default Register
