import Vue from "vue";
import moment from "moment-timezone";
Vue.filter('transformUtc',(value,format = 'YYYY-MM-DD HH:mm:ss') => {
    const timeZone = 'Asia/Shanghai'
    return moment.tz(value,timeZone).format(format)
})
Vue.filter('distributionStatus',(value) => {
    switch (value){
        case -1:return '配送提前结束'
        case 0:return '等待审核'
        case 1:return '正在准备物资'
        case 2:return '正在配送'
        case 3:return '物资配送完成'
    }
})
