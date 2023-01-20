const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 3000,
});

const data = {
    name:'cxd'
}
const request = (url,method,data,query) => {
    console.log(data)
    instance[method](url,data,{
        params:query
    }).then(res => {
        return res.data
    }).catch(err => {
        return err.data
    })
}

request('test','post',data)
