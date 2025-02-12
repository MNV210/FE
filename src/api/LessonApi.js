import axios from "axios"

export const LessonApi =  {
    async getInfomationLesson(lessonId) {
        const response = await axios.get(`http://localhost:8000/api/lessons/${lessonId}`)
        return response.data
    }
}