import Vue from "vue";
import moment from "moment-timezone";
Vue.filter('transformUtc',(value) => {
    const timeZone = 'Asia/Shanghai'
    return moment.tz(value,timeZone).format('YYYY-MM-DD HH:mm:ss')
})
