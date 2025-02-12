import axios from "axios";

export const QuestionApi = {
    async getQuestionByExerciseId(exerciseId) {
        const response = await axios.get(`http://localhost:8000/api/questions/exercise/${exerciseId}`)
        return response.data
    },
    async userAnswerQuestion(data) {
        const response = await axios.post('http://127.0.0.1:8000/api/user_answer_question',data)
        return response
    },
    async historyMakeExercise(data) {
        const response =  await axios.post("http://127.0.0.1:8000/api/history_make_exercise",data);
        return response.data
    }
}