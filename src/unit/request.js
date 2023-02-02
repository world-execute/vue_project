import axios from "axios";
import { Loading } from 'element-ui';

// 封装请求方法
// 初始化axios对象实例
const instance = axios.create({
    // 接口地址根路径
    baseURL: 'http://localhost:8080/api',
    // 请求超时时间
    timeout: 3000
});
let loading
// 请求加载动画
const startLoading = () => {
    loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
// 关闭请求动画
const endLoading = () => {
    loading.close()
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 加载请求动画
    startLoading()
    // 为请求头对象,添加 Token 验证的Authorization 字段
    const token = window.sessionStorage.getItem('token') || window.localStorage.getItem('token')
    config.headers.Authorization = token
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 关闭请求动画
    endLoading()
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 关闭请求动画
    endLoading()
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 请求方法
const request = (url,method,payload) => {
    if(method === 'post' || method === 'put'){
        return new Promise((resolve, reject) => {
            let data = payload
            let query = {}
            if(payload.data){
                data = payload.data
            }
            if(payload.query){
                query = payload.query
            }
            instance[method](url,data,{
                params:query
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    if(method === 'get' || method === 'delete'){
        return new Promise((resolve, reject) => {
            instance[method](url,{
                params:payload
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    return new Promise((resolve, reject) => {reject('请求方式错误')})

}

export default request
