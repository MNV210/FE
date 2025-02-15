import { Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SearchBar } from '../common/SearchBar'
import { AuthModal } from '../routes/auth/AuthModal'
import { message } from 'antd'

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    let user = sessionStorage.getItem('user')
    if (!user) {
      user = localStorage.getItem('user')
    }
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  const openModal = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    setIsLoggedIn(false)
    setShowLogoutModal(false)
    navigate('/')
    window.location.reload(); // Reload the page after logging out
  }

  const handleClickProfile = () => {
    navigate('/profile');
  }
  const handleClickSetting = () => {}


  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-8xl mx-auto px-4 h-full flex items-center">
        <a href="/" className="text-2xl font-bold text-orange-500 mr-8">
          Logo
        </a>
        <div className='font-bold'> </div>
        
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              {/* <button
                onClick={() => openModal('register')}
                className="px-4 py-1 text-gray-600 hover:text-gray-900 rounded-lg"
              >
                Đăng ký
              </button> */}
              <button
                onClick={() => openModal('login')}
                className="px-4 py-1 bg-orange-500 text-white rounded-3xl hover:bg-orange-600"
              >
                Đăng nhập
              </button>
            </>
          ) : (
            <>
              <div className="relative">
                <img
                  src="/path/to/avatar.jpg"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => setShowLogoutModal(!showLogoutModal)}
                />
                {showLogoutModal && (
                  <div className="absolute items-center right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <button
                      onClick={handleClickProfile}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Tài khoản
                    </button>
                    {/* <button
                      onClick={handleClickSetting}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt
                    </button> */}
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Đăn xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <AuthModal 
          show={showAuthModal} 
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onChangeMode={(mode) => setAuthMode(mode)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </header>
  )
}
