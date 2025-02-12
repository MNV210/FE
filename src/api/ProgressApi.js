import axios from "axios";

export const ProgressApi = {
    async updateLessonProgress(data) {
        const response = await axios.post(`http://localhost:8000/api/progress-learn`,data);
        return response.data;
    },
    async getUserCourseProgress(userID,courseID) {
        const response = await axios.get(`http://localhost:8000/api/progress-learn?user_id=${userID}&course_id=${courseID}`);
        return response.data;
    },
    async checkLessonCompleted(userID,courseID,lessonID) {
        const response = await axios.get(`http://localhost:8000/api/check-lesson-completed?user_id=${userID}&course_id=${courseID}&lesson_id=${lessonID}`);
        return response.data;
    }
}