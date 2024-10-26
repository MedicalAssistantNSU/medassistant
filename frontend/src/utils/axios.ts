import axios from 'axios';

const axiosServices = axios.create({
    baseURL: "http://localhost:8000"
});

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
