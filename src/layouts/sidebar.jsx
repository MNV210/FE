import { Link, useLocation } from "react-router-dom"
import { Home, ChartNoAxesGantt } from "lucide-react"
import { useAuth } from "../hooks/useAuth" // Assuming you have a useAuth hook

export const Sidebar = () => {
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const menuItems = [
    { 
      label: 'Trang chủ', 
      href: '/', 
      icon: Home 
    },
    ...(isLoggedIn ? [{ 
      label: 'Bài kiểm tra', 
      href: '/bai-kiem-tra', 
      icon: ChartNoAxesGantt
    }] : []),
  ]

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-24 bg-white">
      <nav className="flex flex-col gap-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center py-2 px-0 rounded-xl hover:bg-gray-50 transition-colors
                ${isActive ? 'bg-gray-100' : ''}`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-black' : 'text-gray-700'}`} />
              <span className={`text-xs font-bold ${isActive ? 'text-black' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar