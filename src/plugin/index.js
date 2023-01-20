import Vue from "vue";
import request from '../unit/request'
// 动画 animate.css
import animate from 'animate.css'
// 按需导入
import {
    Form,FormItem,Input,Card,Row,Col,Button,Message,
    Checkbox
} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Card)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(animate)
Vue.use(Checkbox)
Vue.prototype.$message = Message
Vue.prototype.$request = request
