import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Play, Lock } from 'lucide-react'
import { CoursesApi } from '../../api/CoursesApi'
import { useParams } from 'react-router-dom'
import { CourseHeader } from './CourseHeader'

export function CourseCurriculum() {
  const { courseId } = useParams()
  const [totalLessons, setTotalLessons] = useState(0)
  const [lessons, setLessons] = useState([])
  const [course,setCourses] = useState([])

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const ID = { course_id: courseId }
        const data = await CoursesApi.getLessonByCourseId(ID)
        const course = await CoursesApi.getCourseById(courseId)
        setTotalLessons(data.data.length)
        setCourses(course.data)
        setLessons(data.data)
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
    }

    fetchCourseData()
  }, [courseId])

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <CourseHeader
        course = {course}
        lesson = {lessons}
      />

      <div className="flex justify-between items-center mb-3 mt-3">
        <h2 className="text-2xl font-bold">Nội dung khóa học</h2>
        <div className="flex gap-8 text-gray-600">
          <span>{totalLessons} bài học</span>
        </div>
      </div>
      <div className="space-y-4">
        {lessons.map(lesson => (
          <div key={lesson.id} className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className='flex items-center gap-4'>
              <Play className="w-5 h-5 text-gray-400 ml-5" />
              <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <span className="font-medium"> {lesson.lesson_name}</span>
                  <span className="text-gray-500">{Math.floor(lesson.duration / 60)} phút</span>
                </div>
              </div>
            </div>
            {/* <Lock className="w-5 h-5 text-gray-400" /> */}
          </div>
        ))}
      </div>
    </div>
  )
}