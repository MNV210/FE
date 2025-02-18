import axios from "axios";

export const QuestionAi = {
    async getQuestionByUserAndLesson(data) {
        console.log(data)
        const response = await axios.get(`http://localhost:8000/api/question_ai?user_id=${data.user_id}&lesson_id=${data.lesson_id}`);
        return response.data;
    },
    async createQuestionAI(data) {
        console.log(data)
        const response = await axios.post('http://localhost:8000/api/question_ai', data);
        return response.data;
    }
}