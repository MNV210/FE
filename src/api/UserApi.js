import axios from "axios";

export const UserApi = {
    async ChangePassword(data) {
        const response = await axios.post(`http://localhost:8000/api/change_password`, data);
        return response.data;
    }
}