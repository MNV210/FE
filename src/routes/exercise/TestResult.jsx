import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { QuestionApi } from '../../api/Question';
import { useParams } from 'react-router-dom';

export const TestResult = () => {
  const [testResults, setTestResults] = useState(null);
  const params = useParams();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await QuestionApi.historyMakeExercise({
          user_id: storedUser.info.id,
          exercise_id: parseInt(params.exerciseId)
        });

        setTestResults(response.data);
      } catch (error) {
        console.error('Error fetching test results:', error);
      }
    };

    fetchTestResults();
  }, [params.exerciseId, storedUser.info.id]);

  if (!testResults) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen mt-20">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kết Quả Bài Kiểm Tra</h1>
          <Award className="w-10 h-10 text-blue-500" />
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold">Học Sinh: {testResults.user.name}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="font-bold">Tổng Số Câu</p>
            <p className="text-2xl">{testResults.exercise.total_question}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="font-bold">Câu Đúng</p>
            <p className="text-2xl text-green-600">{testResults.correct_answer}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="font-bold">Câu Sai</p>
            <p className="text-2xl text-red-600">{testResults.exercise.total_question - testResults.correct_answer}</p>
          </div>
        </div>
        <div className={`text-center mb-6 text-green-600`}>
          <p className="text-xl font-bold">Điểm Số</p>
          <p className="text-4xl">{testResults.score}</p>
        </div>
      </div>
    </div>
  );
};

export default TestResult;