import React, { useEffect, useState, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Play, 
  Lock 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs } from 'antd'; // Import Tabs from antd

// APIs
import { CoursesApi } from "../../api/CoursesApi";
import { LessonApi } from "../../api/LessonApi";
import { ProgressApi } from "../../api/ProgressApi";
import AIChat from "./AIChat";
import { MessageCircle } from 'lucide-react';


const { TabPane } = Tabs; // Destructure TabPane from Tabs

export default function LearnPage() {
  // State
  const [showSidebar, setShowSidebar] = useState(true);
  const [listLesson, setListLesson] = useState([]);
  const [lessonInformation, setLessonInformation] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  // Refs & Params
  const videoRef = useRef(null);
  const params = useParams();
  const lessonId = params.lessonId;
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));

  // Lấy thông tin bài học và tiến độ
  const fetchLessonData = async () => {
    try {
      // Lấy thông tin bài học hiện tại
      const lessonData = await LessonApi.getInfomationLesson(lessonId);
      setLessonInformation(lessonData.data);

      // Lấy danh sách bài học trong khóa
      const lessonsResponse = await CoursesApi.getLessonByCourseId({ 
        course_id: lessonData.data.course_id 
      });
      setListLesson(lessonsResponse.data);

      // Lấy danh sách bài học đã hoàn thành
      const progressData = await ProgressApi.getUserCourseProgress(
        storedUser.info.id, 
        lessonData.data.course_id
      );
      const completedLessonIds = progressData.map(p => p.lesson_id);
      setCompletedLessons(completedLessonIds);

    } catch (error) {
      console.error("Lỗi khi tải thông tin:", error);
    }
  };

  // Xử lý cập nhật tiến độ cho file sau 2 phút
  useEffect(() => {
    if (lessonInformation?.type === 'file') {
      const timer = setTimeout(async () => {
        try {
          const checkLessonCompleted = await ProgressApi.checkLessonCompleted(
            storedUser.info.id,
            lessonInformation.course_id,
            lessonId
          );
          
          if (checkLessonCompleted.length === 0) {
            await ProgressApi.updateLessonProgress({
              lesson_id: lessonId,
              course_id: lessonInformation.course_id,
              user_id: storedUser.info.id,
              progress: "completed"
            });
            fetchLessonData(); // Cập nhật lại danh sách hoàn thành
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật tiến độ file:", error);
        }
      }, 30000); // 2 phút

      return () => clearTimeout(timer);
    }
  }, [lessonInformation, lessonId, storedUser.info.id]);

  // Kiểm tra điều kiện mở khóa video
  const canPlayVideo = (checkLessonId) => {
    // Nếu đã hoàn thành rồi thì được xem
    if (completedLessons.includes(checkLessonId)) return true;

    // Bài học đầu tiên luôn được mở
    const currentIndex = listLesson.findIndex(lesson => lesson.id == checkLessonId);
    if (currentIndex === 0) return true;

    // Kiểm tra bài học trước đã hoàn thành chưa
    const previousLesson = listLesson[currentIndex - 1];
    return completedLessons.includes(previousLesson.id);
  };

  // Xử lý tiến độ video
  const handleVideoProgress = async () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      const percentage = (currentTime / duration) * 100;
      // Nếu xem đủ 2/3 video
      if (percentage >= 98 ) {
        try {
          const checkLessonCompleted = await ProgressApi.checkLessonCompleted(storedUser.info.id,lessonInformation.course_id,lessonId);
          console.log(checkLessonCompleted.length);
          // Gọi API đánh dấu hoàn thành
          if (checkLessonCompleted.length == 0) {
            await ProgressApi.updateLessonProgress({
              lesson_id: lessonId,
              course_id: lessonInformation.course_id,
              user_id: storedUser.info.id,
              progress: "completed"
            }).then(() => {
              fetchLessonData();
            });
          }
          

          // Tìm index của bài học hiện tại
          // const currentIndex = listLesson.findIndex(lesson => lesson.id == lessonId);
          
          // // Nếu còn bài học tiếp theo
          // if (currentIndex < listLesson.length - 1) {
          //   const nextLesson = listLesson[currentIndex + 1];
            
          //   // Cập nhật state các bài học đã hoàn thành
          //   setCompletedLessons(prev => [...prev, lessonId]);
          //   console.log(completedLessons);
          // }
        } catch (error) {
          console.error("Lỗi khi cập nhật tiến độ:", error);
        }
      }
    }
  };

  // Điều hướng đến bài học
  const handleStepClick = (clickedLessonId) => {
    if (canPlayVideo(clickedLessonId)) {
      navigate(`/learn/${lessonInformation.course.course_name}/${clickedLessonId}`);
    }
  };

  // Tải dữ liệu khi component mount hoặc lessonId thay đổi
  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  // Nếu chưa có thông tin bài học
  if (!lessonInformation) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 fixed top-0 left-0 right-0 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-medium truncate max-w-[600px]">
            {lessonInformation.course.course_name}
          </h1>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Nội dung chính */}
        <div className={`flex-1 flex flex-col ${showSidebar ? "mr-[400px]" : ""}`}>
          <div className="w-full bg-black aspect-video">
            {lessonInformation.type === 'video' ? (
              <video
                ref={videoRef}
                src={lessonInformation.video_url}
                controls
                className="w-full h-full"
                onTimeUpdate={handleVideoProgress}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <embed
                  src={lessonInformation.video_url}
                  className="w-full h-full"
                  type={
                    lessonInformation.video_url?.endsWith('.pdf') 
                      ? 'application/pdf'
                      : 'text/plain'
                  } />
                {/* <a
                  href={lessonInformation.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-blue-500 px-4 py-2 rounded"
                >
                  Tải xuống tài liệu
                </a> */}
              </div>
            )}
          </div>

          {/* Thông tin bài học */}
          <div className="p-6">
            <h2 className="text-2xl font-bold">{lessonInformation.lesson_name}</h2>
            <p className="text-gray-500 mt-1">{lessonInformation.description}</p>
          </div>

          {/* Sidebar danh sách bài học */}
          <div
            className={`fixed top-16 right-0 bottom-16 w-[400px] bg-white border-l transition-transform duration-300 ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col mx-4">
              <Tabs defaultActiveKey="1" >
                <TabPane tab={<h3> Nội dung khóa học</h3>} key="1">
                  <div className="flex-1 overflow-y-auto">
                    {listLesson.map((lesson) => {
                      const isActive = lesson.id == lessonId;
                      const canPlay = canPlayVideo(lesson.id);
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleStepClick(lesson.id)}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 
                            ${!canPlay ? 'opacity-50 cursor-not-allowed' : ''} 
                            ${isActive ? 'bg-orange-50' : ''}`}
                          disabled={!canPlay}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                            {canPlay ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium line-clamp-2">
                              {lesson.lesson_name}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabPane>
                <TabPane tab={<div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Chat Room</h3>
                    </div>} 
                  key="2">
                    <AIChat />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Không sử dụng layout chung
LearnPage.getLayout = (page) => page;