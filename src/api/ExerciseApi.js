import axios from "axios";

export const ExerciseApi = {
    async listExerciseUserRegister(data) {
        const response = await axios.post(`http://localhost:8000/api/list_course_user`,data)
        return response.data
    },
    async getExerciseById(exerciseId) {
        const response  = await axios.get(`http://localhost:8000/api/exercises/${exerciseId}`)
        return response.data
    },
    async getExerciseByUserId(data) {
        const response = await axios.post(`http://localhost:8000/api/list_course_user`,data)
        return response.data
    },
    async getExercisesByCourseId(data) {
        const response = await axios.post(`http://localhost:8000/api/get_exercise_by_course_id`,data)
        return response.data
    }
}