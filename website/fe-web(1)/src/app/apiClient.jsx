import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://fast-food-website.onrender.com/api',
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