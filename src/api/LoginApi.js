import axios from "axios";

export const LoginApi = {
    async Login(data) {
        const response = await axios.post(`http://localhost:8000/api/login`, data);
        return response.data;
    }
}