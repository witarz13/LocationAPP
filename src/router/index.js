import Vue from 'vue'
import Router from  'vue-router'
import myLocation from '../components/myLocation'
Vue.use(Router)

export default new Router({
    Router:[{
        path:'/',
        component: myLocation
    }]
}

)