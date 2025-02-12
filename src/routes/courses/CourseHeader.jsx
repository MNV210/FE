import { Play } from 'lucide-react'
import defaultImage from '../../assets/default.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { CoursesApi } from '../../api/CoursesApi'
import { AuthModal } from '../auth/AuthModal'
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export function CourseHeader({ course, lesson }) {
  const navigate = useNavigate()
  // const { user } = useAuth(); // Get the user from useAuth hook
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [checkregister,setCheckRegister] = useState(false)
  const params = useParams()

  useEffect(() => {
    // Ensure the ToastContainer is rendered
    const container = document.getElementById('toast-container');
    if (!container) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    //Check User Register Course
    const checkUserRegisterCourse = async() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const course_id = params.courseId
      const check = await CoursesApi.checkUserRegisterCourse({ user_id: storedUser.info.id, course_id: course_id })
      setCheckRegister(check.is_registered)
    }
    checkUserRegisterCourse()
  }, []);

  const handleRegistrationCourse = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    // console.log(storedUser.info)
    if (!storedUser) {
      // If user is not logged in, navigate to the login page
      setAuthMode("login")
      setShowAuthModal(true)
      return;
    }

    try {
      await CoursesApi.registerCourse({ user_id: storedUser.info.id, course_id: course.id });
      toast.success('Registration successful!');
      // Navigate to the course learning page after successful registration
      // navigate(`/learn/${course.slug}/${lesson[0].id}`);
    } catch (error) {
      console.error('Error registering for course:', error);
      toast.error('Registration failed. Please try again.');
    }
  }

  const handleGoToCourse = () => {
    navigate(`/learn/${course.slug}/${lesson[0].id}`);
  }

  return (
    <div className="bg-white border-b">
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{course.course_name}</h1>
            <p className="text-gray-600 mb-6">{course.course_description}</p>

            <div className="flex gap-8 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>{course.member_register} học viên</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⌚</span> 
                {/* <span>{Math.floor(course.duration / 3600)} giờ {Math.floor((course.duration % 3600) / 60)} phút</span> */}
              </div>
              <div className="flex items-center gap-2">
                <span>🎯</span>
                {/* <span>{course.level.title}</span> */}
              </div>
            </div>
            {checkregister ? (
              <button onClick={handleGoToCourse} className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors">
                VÀO HỌC
              </button>
            ) : (
              <button onClick={handleRegistrationCourse} className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors">
                ĐĂNG KÝ HỌC 
              </button>
            )}
          </div>

          <div className="w-[400px] relative">
            <div className="aspect-video rounded-2xl overflow-hidden relative group cursor-pointer">
              <img 
                src={course.image_url || defaultImage } 
                alt={course.course_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center invisible group-hover:visible">
                <button className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal 
        show={showAuthModal} 
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onChangeMode={(mode) => setAuthMode(mode)}
      />
      <ToastContainer />
    </div>
  )
}