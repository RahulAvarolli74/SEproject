"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import axios from "axios"
import { useAuthStore } from "../store/authStore"

function Signup() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (pwd) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    setPasswordStrength(strength)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (name === "password") calculatePasswordStrength(value)
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validateStep = () => {
    const newErrors = {}
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    } else if (step === 2) {
      if (!formData.password) newErrors.password = "Password is required"
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    } else if (step === 3) {
      if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(step + 1)
  }

  const handleBack = () => setStep(step - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return

    setLoading(true)
    try {
      const res = await axios.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (res.data.success) {
        login(res.data.user, res.data.token)
        navigate("/dashboard")
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Signup failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 opacity-20 pointer-events-none"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Progress indicator */}
        <motion.div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-semibold">Step {step} of 3</span>
            <span className="text-gray-400 text-sm">{Math.round((step / 3) * 100)}%</span>
          </div>
          <motion.div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white text-sm font-medium"> Join SkillVerse</span>
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-6">
            {step === 1 && "Create Account"}
            {step === 2 && "Secure Password"}
            {step === 3 && "Choose Your Role"}
          </h1>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fieldVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <motion.p className="text-red-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <AlertCircle className="w-4 h-4" /> {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <motion.p className="text-red-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <AlertCircle className="w-4 h-4" /> {errors.email}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <motion.div
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fieldVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all pr-10"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {formData.password && (
                    <motion.div className="mt-3 space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= passwordStrength ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        {passwordStrength === 1 && "Weak password"}
                        {passwordStrength === 2 && "Fair password"}
                        {passwordStrength === 3 && "Good password"}
                        {passwordStrength === 4 && "✓ Strong password"}
                      </p>
                    </motion.div>
                  )}

                  {errors.password && (
                    <motion.p className="text-red-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <AlertCircle className="w-4 h-4" /> {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all pr-10"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <motion.p className="text-green-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Check className="w-4 h-4" /> Passwords match
                    </motion.p>
                  )}
                  {errors.confirmPassword && (
                    <motion.p className="text-red-400 text-sm mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <AlertCircle className="w-4 h-4" /> {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Role Selection */}
            {step === 3 && (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {["student", "instructor"].map((roleOption, idx) => (
                  <motion.label
                    key={roleOption}
                    variants={fieldVariants}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center p-4 bg-white/10 border-2 border-white/20 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-white/15 transition-all"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={roleOption}
                      checked={formData.role === roleOption}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="ml-4 flex-1">
                      <span className="text-white font-medium capitalize">{roleOption}</span>
                      <p className="text-gray-400 text-sm">
                        {roleOption === "student" ? "Learn from expert instructors" : "Create and teach courses"}
                      </p>
                    </span>
                  </motion.label>
                ))}

                <motion.div
                  className="flex items-start gap-2 mt-6"
                  variants={fieldVariants}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 cursor-pointer accent-purple-500"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-400 cursor-pointer">
                    I agree to the{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold">
                      Terms and Conditions
                    </a>
                  </label>
                </motion.div>

                {errors.agreeTerms && (
                  <motion.p className="text-red-400 text-sm flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AlertCircle className="w-4 h-4" /> {errors.agreeTerms}
                  </motion.p>
                )}
              </motion.div>
            )}

            {errors.submit && (
              <motion.p className="text-red-400 text-sm mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {errors.submit}
              </motion.p>
            )}

            {/* Buttons */}
            <motion.div className="mt-8 flex gap-4">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating...
                  </motion.span>
                ) : (
                  step === 3 ? "Create Account" : "Next"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Login link */}
          <motion.p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Signup
