"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle, Lock, Mail } from "lucide-react"
import axios from "axios"
import { useAuthStore } from "../store/authStore"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      if (res.data.success) {
        login(res.data.user, res.data.token)
        navigate("/dashboard")
      }
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setErrors({ submit: err.response?.data?.message || "Invalid credentials" })
    } finally {
      setLoading(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background blobs */}
      <motion.div
        className="fixed inset-0 opacity-20 pointer-events-none"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glassmorphism Card */}
        <motion.div
          className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl ${
            shake ? "animate-shake" : ""
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={shake ? { x: [0, -10, 10, -10, 10, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={shake ? { duration: 0.5 } : { delay: 0.2 }}
        >
          {/* Welcome Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-6 border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white text-sm font-medium">✨ Welcome Back</span>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Sign In to SkillVerse
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Continue your learning journey
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <motion.p className="text-red-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertCircle className="w-4 h-4" /> {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p className="text-red-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertCircle className="w-4 h-4" /> {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Remember Me */}
            <motion.div
              className="flex items-center gap-2"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 cursor-pointer accent-purple-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer">
                Remember me
              </label>
            </motion.div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-20"
                transition={{ duration: 0.3 }}
              />
              {loading ? (
                <motion.span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </motion.span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-4 my-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Login
