"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Landing() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setFeatured(data.slice(0, 6)))
      .catch((err) => console.error("Error fetching courses:", err))
  }, [])

  const features = [
    {
      icon: "📚",
      title: "Expert Instructors",
      desc: "Learn from industry professionals with years of experience",
    },
    {
      icon: "🎯",
      title: "Structured Learning",
      desc: "Well-organized curriculum designed for progression",
    },
    {
      icon: "🏆",
      title: "Certificates",
      desc: "Earn recognized certificates upon course completion",
    },
    {
      icon: "💻",
      title: "Practical Projects",
      desc: "Build real-world projects to strengthen your portfolio",
    },
    {
      icon: "⏱️",
      title: "Learn at Your Pace",
      desc: "Lifetime access to all course materials",
    },
    {
      icon: "🌍",
      title: "Global Community",
      desc: "Connect with thousands of learners worldwide",
    },
  ]

  const stats = [
    { label: "Courses", value: "500+" },
    { label: "Instructors", value: "1000+" },
    { label: "Students", value: "1M+" },
    { label: "Reviews", value: "4.8★" },
  ]

  return (
    <div className="bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white font-display leading-tight">
                Learn <span className="text-accent">anything,</span> anytime, anywhere
              </h1>
              <p className="text-xl text-slate-300">
                Master new skills with courses from expert instructors. Start learning for free today and transform your
                career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/catalog"
                  className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold text-center"
                >
                  Explore Courses
                </Link>
                <button className="px-8 py-4 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 font-semibold">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-3xl"></div>
              <div className="relative bg-secondary border border-slate-700 rounded-2xl p-8 h-full flex flex-col justify-center space-y-4">
                <div className="h-24 bg-slate-700 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose CourseHub?</h2>
            <p className="text-xl text-slate-300">Everything you need to succeed in your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-primary border border-slate-700 rounded-xl p-8 hover:border-accent/50 hover:bg-secondary/50 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-slate-300">Start your learning journey with our most popular courses</p>
            </div>
            <Link to="/catalog" className="text-accent hover:text-accent-light font-semibold">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-secondary rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-accent/10 border border-slate-700 hover:border-accent/50 transition"
              >
                <div className="h-48 bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-2">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition">{course.title}</h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-accent">★</span>
                      <span className="text-white font-semibold">{course.rating}</span>
                      <span className="text-slate-500 text-sm">({course.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={course.instructor.avatar || "/placeholder.svg?height=32&width=32"}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-slate-300 text-sm">{course.instructor.name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-accent font-bold text-lg">${course.price}</span>
                    <span className="text-slate-500 text-sm">{course.students} students</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">Ready to Start Learning?</h2>
          <p className="text-xl text-slate-300">
            Join thousands of students and start your learning journey today. Free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold">
              Get Started Free
            </Link>
            <Link
              to="/catalog"
              className="px-8 py-4 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 font-semibold"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
