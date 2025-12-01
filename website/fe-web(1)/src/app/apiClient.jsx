import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('currentUser');
    if(!token){
       alert("Người dùng chưa đăng nhập");
    }
    if(token){
        config.headers.Authorization  = `Bearer ${token}`;
    };
    return config;
});

export default axiosClient;