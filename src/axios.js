import axios from "axios";

const service = axios.create({
    baseURL: "/api"
})

// 添加请求拦截器
// service.interceptors.request.use(function (config) {
//     // header中自动添加token
//     const token = getToken()
//     if(token){
//         config.headers["Authorization"] = token
//     }

//     return config;
// }, function (error) {
//     return Promise.reject(error);
// });

// 添加响应拦截器
// service.interceptors.response.use(function (response) {
//     return response.data;
// }, function (error) {
//     ElMessage({
//         message: "请求失败",
//         type: 'error',
//     })
//     return Promise.reject(error);
// });

export default service