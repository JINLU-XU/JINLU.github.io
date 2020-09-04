import Vue from 'vue'
import { Notify } from 'vant';

// 全局注册
Vue.use(Notify);

class Yanzheng {
    // 验证表单
    valid(o) {
        // 
        for (let key in o) {
            // 
            // 
            if (!o[key].reg.test(o[key].value)) {
                Notify({
                    type: 'primary',
                    message: o[key].errorMsg,
                })
                return false
            }

            // return true
        }

        // 验证通过
        return true;
    }
}
export const yanzheng = new Yanzheng()
