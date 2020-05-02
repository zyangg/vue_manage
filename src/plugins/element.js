import Vue from 'vue'
/* 导入element组件 */
import {
  Button,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'
/* Vue注册为全局可用组件 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
/* message挂载到vue 的原型对象 */

Vue.prototype.$message = Message
