"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Users, ChevronRight } from "lucide-react"

export default function Catalog() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [priceRange, setPriceRange] = useState([0, 500])

  const categories = ["all", "web development", "data science", "design", "business"]

  useEffect(() => {
    const mockCourses = [
      { id: 1, title: "React Mastery", category: "web development", price: 49, rating: 4.8, students: 1500, instructor: { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" } },
      { id: 2, title: "Python for Data Science", category: "data science", price: 59, rating: 4.9, students: 2000, instructor: { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" } },
      { id: 3, title: "UI/UX Design Fundamentals", category: "design", price: 39, rating: 4.7, students: 1200, instructor: { name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=3" } },
      { id: 4, title: "Business Strategy 101", category: "business", price: 44, rating: 4.6, students: 800, instructor: { name: "Sarah Lee", avatar: "https://i.pravatar.cc/150?img=4" } },
      { id: 5, title: "Advanced JavaScript", category: "web development", price: 54, rating: 4.8, students: 1800, instructor: { name: "Mike Brown", avatar: "https://i.pravatar.cc/150?img=5" } },
      { id: 6, title: "Machine Learning Basics", category: "data science", price: 64, rating: 4.9, students: 2200, instructor: { name: "Emily Chen", avatar: "https://i.pravatar.cc/150?img=6" } },
    ]
    
    setTimeout(() => {
      setCourses(mockCourses)
      setFilteredCourses(mockCourses)
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    let filtered = courses
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    
    filtered = filtered.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1])
    
    setFilteredCourses(filtered)
  }, [selectedCategory, searchQuery, courses, priceRange])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Catalog</span>
          </h1>
          <p className="text-gray-400 text-lg">Explore thousands of courses and start learning today</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search Bar */}
          <motion.div className="relative" whileHover={{ scale: 1.02 }}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Price Range Slider */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-white font-medium mb-4 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Courses Grid */}
        {loading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="bg-white/10 rounded-lg h-80 animate-skeleton"
                variants={itemVariants}
              />
            ))}
          </motion.div>
        ) : filteredCourses.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  className="group relative bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)" }}
                  onClick={() => setSelectedCourse(course)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                    <motion.div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      📚
                    </motion.div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-pink-500 transition-all">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize">{course.category}</p>
                    </motion.div>

                    {/* Instructor and Rating */}
                    <motion.div
                      className="flex items-center justify-between text-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-2">
                        <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
                        <span className="text-gray-400">{course.instructor.name}</span>
                      </div>
                    </motion.div>

                    {/* Rating and Students */}
                    <motion.div
                      className="flex items-center justify-between text-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </motion.div>

                    {/* Price and Button */}
                    <motion.div
                      className="flex items-center justify-between pt-4 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-2xl font-bold text-white">${course.price}</span>
                      <motion.button
                        className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-lg">No courses found. Try adjusting your filters.</p>
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-md border border-white/20 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-6 flex items-center justify-center text-5xl">
                📚
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedCourse.title}</h2>
              <p className="text-gray-400 capitalize mb-2">{selectedCourse.category}</p>
              <div className="flex items-center gap-2 mb-4">
                <img src={selectedCourse.instructor.avatar} alt={selectedCourse.instructor.name} className="w-8 h-8 rounded-full" />
                <span className="text-gray-400">{selectedCourse.instructor.name}</span>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">{selectedCourse.rating}</span>
                </div>
                <span className="text-gray-400">{selectedCourse.students.toLocaleString()} students</span>
              </div>

              <div className="flex items-center justify-between mb-6 pt-6 border-t border-white/10">
                <span className="text-3xl font-bold text-white">${selectedCourse.price}</span>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enroll Now
                </motion.button>
              </div>

              <motion.button
                onClick={() => setSelectedCourse(null)}
                className="w-full py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
