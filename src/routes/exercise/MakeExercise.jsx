import React, { useState, useEffect } from 'react';
import { QuestionApi } from '../../api/Question';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Timer } from 'lucide-react';
import ShowResult from './TestResult';
import { ExerciseApi } from '../../api/ExerciseApi';
import { set } from 'react-hook-form';

export const MakeExercise = () => {
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15*60);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitted,setIsSubmitted] = useState(false)

  const params = useParams()
  const userId = JSON.parse(localStorage.getItem('user'))

  const navigate = useNavigate()

  // Giả sử hàm này sẽ gọi API để lấy dữ liệu
  const fetchQuizData = async () => {
    try {
      // Thay thế bằng API call thực tế
        const exercise = await ExerciseApi.getExerciseById(params.exerciseId)
        const data = await QuestionApi.getQuestionByExerciseId(params.exerciseId)
        setQuizData(data.data);
        setLoading(false);
        setTimeLeft(parseInt(exercise.time)*60)
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  // Timer đếm ngược
  useEffect(() => {
    if (!showResults && !loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showResults, loading]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await QuestionApi.userAnswerQuestion({answers: answers, exercise_id: params.exerciseId,user_id: userId.info.id})
      // setIsSubmitted(true)
      // setShowResults(true);
      navigate(`/exercise_result/${params.exerciseId}`)

    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setTimeLeft(30 * 60); // Reset thời gian
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="text-center">Đang tải câu hỏi...</div>
      </div>
    );
  }

  return (
      <div className="flex min-h-screen bg-gray-100 p-4 mt-10">
        {/* Bên Trái */}
        <div className="w-3/4 pr-4 mt-10">
          <div className="space-y-4">
            {quizData && quizData.length > 0 && quizData.map((question, index) => (
              <div 
                key={question.id} 
                className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 question-${question.id}`}
                id={`question-${question.id}`}
              >
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="font-medium">Câu {index + 1}:</span>
                    <p className="font-medium">{question.question}</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: question.option_1, text: question.option_1, position: "a" },
                      { id: question.option_2, text: question.option_2, position: "b" },
                      { id: question.option_3, text: question.option_3, position: "c" },
                      { id: question.option_4, text: question.option_4, position: "d" }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => !showResults && handleAnswerSelect(question.id, option.id)}
                        disabled={showResults}
                        className={`
                          w-full p-3 rounded-lg flex items-center gap-3 border transition-all duration-200
                          ${answers[question.id] === option.id 
                            ? 'bg-orange-100 border-orage-500' 
                            : 'hover:bg-gray-50 border-gray-200'}
                          ${showResults ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                      >
                        <span className="w-8 h-8 flex items-center justify-center rounded-full border font-medium">
                          {option.position.toUpperCase()}
                        </span>
                        <span className="flex-1 text-left">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bên phải */}
        <div className="w-1/4 space-y-4 mt-10">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <div className="flex items-center justify-center mb-2">
              <Timer className="mr-2" />
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Nộp bài
            </button>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24 mt-3">
              <h3 className="font-bold mb-2">Danh sách câu hỏi</h3>
              <div className="grid grid-cols-5 gap-2">
                {quizData.map((q, index) => (
                  <button
                    key={q.id}
                    className={`w-full h-10 rounded-lg border flex items-center justify-center transition-colors
                      ${answers[q.id] !== undefined && !showResults
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'border-gray-300'}
                    `}
                    onClick={() => {
                      const element = document.querySelector(`#question-${q.id}`);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>{index + 1}</span>
                    {answers[q.id] !== undefined && (
                      <CheckCircle className="w-3 h-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dialog xác nhận nộp bài */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Xác nhận nộp bài</h3>
              <p className="mb-4">Bạn đã trả lời {Object.keys(answers).length}/{quizData.length} câu hỏi.</p>
              <p className="mb-4">Bạn có chắc chắn muốn nộp bài?</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={handleSubmit}
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};
