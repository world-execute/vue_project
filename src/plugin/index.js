import Vue from "vue";
import request from '../unit/request'
// 滑动验证
import SlideVerify from 'vue-monoplasty-slide-verify';
// 动画 animate.css
import animate from 'animate.css'
// 按需导入
import {
    Form,FormItem,Input,Card,Row,Col,Button,Message,
    Checkbox,Switch,Link,Avatar,Descriptions,DescriptionsItem,
    Tag,Progress,MessageBox,Dialog,Tabs,TabPane,Upload,Table,TableColumn,
    Pagination,Cascader,InputNumber,Alert,Slider,Select,Option,Collapse,
    CollapseItem,Divider
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
Vue.use(Switch)
Vue.use(Checkbox)
Vue.use(Link)
Vue.use(Avatar)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Tag)
Vue.use(Progress)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Cascader)
Vue.use(InputNumber)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Select)
Vue.use(Option)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Divider)
Vue.prototype.$message = Message
Vue.prototype.$request = request
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert

Vue.use(SlideVerify);
// 导入字体图标
import '../assets/css/iconfont.css'

