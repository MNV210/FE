import { useEffect, useState } from 'react';
import { CoursesApi } from '../../api/CoursesApi';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/default.jpg';

export default function CourseList() {
  const [courses, setCourses] = useState({ data: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await CoursesApi.getCourse();
        setCourses({ data: courses.data });
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.data.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generatePagination = (totalCourses, coursesPerPage, currentPage) => {
    const totalPages = Math.ceil(totalCourses / coursesPerPage);
    const pagination = [];
    const delta = 1; // Number of pages to show before and after the current page

    let left = currentPage - delta;
    let right = currentPage + delta;
    let range = [];
    let rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const navigate = useNavigate();
  const handleClickCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  }

  return (
    <div className="py-12">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tất cả khóa học</h2>
          {/* <a href="#" className="text-orange-500 hover:underline">
            Xem lộ trình &#10132;
          </a> */}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <div
                key={course.id}
                className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onClick={() => handleClickCourse(course.id)}
            >
              <img
                src={course.image_url || defaultImage}
                alt={course.course_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.course_name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {course.course_description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-orange-500 font-bold">
                      Giáo viên: {course.users[0]?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          {generatePagination(courses.data.length, coursesPerPage, currentPage).map((item, index) => (
            <button
              key={index}
              onClick={() => item !== '...' && paginate(item)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === item ? 'bg-orange-500 text-white' : 'bg-gray-200'
              } ${item === '...' ? 'cursor-default' : ''}`}
              disabled={item === '...'}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
