import { useEffect, useState } from 'react';
import { CoursesApi } from '../../api/CoursesApi';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/default.jpg';

export default function CourseList() {
  const [proCourses, setProCourses] = useState({ data: [] });
  const [freeCourses, setFreeCourses] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const courses = await CoursesApi.getCourse();
      setProCourses({ data: courses.data.filter(course => course.type === 'pro') });
      setFreeCourses({ data: courses.data.filter(course => course.type === 'free') });
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleClickCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-12">
      {/* Pro Courses */}
      {proCourses.data.length === 0 ? '' : (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Khóa học Pro 
              <span className="ml-2 text-sm font-normal py-1 px-2 bg-blue-100 text-blue-600 rounded-full">
                Mới
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {proCourses.data.map(course => (
              <div onClick={() => handleClickCourse(course.slug)} key={course.id} className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src={course.image_url || defaultImage} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{course.students_count.toLocaleString()} học viên</span>
                    </div>
                  </div>
                </div>
              </div>
                ))}
          </div>
        </section>
      )}

      {/* Free Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Khóa học miễn phí</h2>
          <a href="/courses" className="text-orange-500 hover:underline">Xem lộ trình &#10132;</a>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {freeCourses.data.slice(0, 6).map(course => (
            <div onClick={() => handleClickCourse(course.id)} key={course.id} className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={course.image_url || defaultImage} alt={course.course_name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.course_name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.course_description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className='text-orange-500 font-bold'>Giáo viên: {course.users[0].name}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}