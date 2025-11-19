import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">CourseHub</h3>
            <p className="text-slate-400 text-sm">Learn from the best instructors worldwide.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Courses</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/catalog" className="hover:text-accent">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent">
                  Popular Courses
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent">
                  New Courses
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="#" className="hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="#" className="hover:text-accent">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 flex justify-between items-center">
          <p className="text-slate-400 text-sm">&copy; 2025 CourseHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-accent">
              <span className="sr-only">Twitter</span>𝕏
            </a>
            <a href="#" className="text-slate-400 hover:text-accent">
              <span className="sr-only">LinkedIn</span>in
            </a>
            <a href="#" className="text-slate-400 hover:text-accent">
              <span className="sr-only">GitHub</span>gh
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
