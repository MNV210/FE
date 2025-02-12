import axios from 'axios';

export const CoursesApi = {
    async getCourse(data) {
        if (data) {
            const response = await axios.get(`http://localhost:8000/api/courses?name=${data.name}`);
            return response.data;
        }
        const response = await axios.get(`http://localhost:8000/api/courses`);
        return response.data;
    },
    async getLessonByCourseId(data) {
        const response = await axios.post(`http://localhost:8000/api/get_lesson_by_course`,data);
        return response.data;
    },
    async getLessonBySlugCourse(data) {
        const response = await axios.post(`http://localhost:8000/api/get_lesson_by_course`,data);
        return response.data;
    },
    async getCourseById(courseId) {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}`)
        return response.data
    },
    async registerCourse(data) {
        const response = await axios.post(`http://localhost:8000/api/register_course`, data)
        return response.data
    },
    async checkUserRegisterCourse(data) {
        console.log(data)
        const response = await axios.post(`http://localhost:8000/api/check_user_register`, data)
        return response.data
    },
    async getCourseUserRegister(data) {
        const response = await axios.post(`http://localhost:8000/api/course_user_register`, data)
        return response.data
    }
}