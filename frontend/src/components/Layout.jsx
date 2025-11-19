import { Outlet, useLocation } from "react-router-dom"
import Navigation from "./Navigation"
import Footer from "./Footer"

export default function Layout() {
  const location = useLocation()
  const hideFooterRoutes = ["/login", "/signup"]
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  )
}
