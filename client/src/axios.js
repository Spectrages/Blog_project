import axios from 'axios';
// process.env.REACT_APP_API_URL
const instance = axios.create({
    baseURL: `http://localhost:5000`
});

instance.interceptors.request.use((config) => {
   config.headers.Authorization = window.localStorage.getItem('token');
   return config;
});

export default instance;