"use client"

import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { useState } from "react"

export default function Navigation() {
  const { user, logout } = useAuthStore()
  const { items } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">CourseHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/catalog" className="text-slate-300 hover:text-accent transition">
              Catalog
            </Link>
            {user?.role === "instructor" && (
              <Link to="/instructor" className="text-slate-300 hover:text-accent transition">
                Teach
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-slate-300 hover:text-accent">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-slate-300 hover:text-accent">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = "/"
                  }}
                  className="px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Link to="/login" className="px-4 py-2 text-accent hover:text-accent-light">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-dark">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700">
            <Link to="/catalog" className="block py-2 text-slate-300 hover:text-accent">
              Catalog
            </Link>
            {!user && (
              <>
                <Link to="/login" className="block py-2 text-slate-300 hover:text-accent">
                  Login
                </Link>
                <Link to="/signup" className="block py-2 text-slate-300 hover:text-accent">
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
