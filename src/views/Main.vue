<template>
  <div class="main">
    <div>
      <router-view></router-view>
    </div>

    <!-- 顶部 -->
    <div class="logo fl">
      <img class="img_auto" src="../assets/images/mida.png" alt />
    </div>
    <van-nav-bar @click-right="suibian('Shouye')">
      <template #left>
        <div class="title_text">The Mi Da Coffee</div>
      </template>
      <template #right>
        <div class="right_title">逛一逛~</div>
      </template>
    </van-nav-bar>

    <div class="middle_box">
      <!-- 中部 -->
      <div class="huan_box">
        <div class="huanying">欢迎回来！</div>
        <div class="image">Please login to your accounts</div>
      </div>
      <!-- 登录 -->
      <div class="form_box">
        <van-form>

          <van-field v-model="mima_haoma.phone" label="手机号" placeholder="手机号" />

          <van-field
            :type="isPassword ? 'password' : 'text'"
            v-model="mima_haoma.password"
            label="密码"
            placeholder="密码"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="password_text"
          />
          <div class="wangji clearfix">
            <span class="fr" @click="suibian('Wangjimima')">忘记密码？</span>
          </div>
          <div class="button_box">
            <van-button
              round
              block
              type="info"
              color="#0C34BA"
              native-type="submit"
              @click="logintext"
            >登录</van-button>
          </div>
        </van-form>

        <!-- 注册 -->
        <div class="registered_btn">
          <van-button round block type="default" @click="showPopup">注&nbsp;&nbsp;册</van-button>
        </div>
      </div>
    </div>

    <div class="round">
      <!-- 注册 -->
      <van-popup v-model="show" closeable round position="bottom" :style="{ height: '60%' }">
        <div class="form_box">
          <van-nav-bar>
            <template #left>
              <div class="title_text">注册</div>
            </template>
          </van-nav-bar>

          <van-form>
            <van-field v-model="zhuces.nickName" label="昵称" placeholder="昵称" />
            <van-field v-model="zhuces.phone" label="手机号" placeholder="11位手机号" />
            <van-field
              :type="isPassword ? 'password' : 'text'"
              v-model="zhuces.password"
              label="密码"
              placeholder="6-16密码首字母大写"
              :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
              @click-right-icon="password_text"
            />
            <div class="button_box">
              <van-button
                round
                block
                @click="register"
                color="#0C34BA"
                native-type="submit"
              >注&nbsp;&nbsp;册</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/main.less";
import { utils } from "../assets/js/utils";
import { yanzheng } from "../assets/js/yanzheng";
export default {
  data() {
    return {
      // 登录
      mima_haoma: {
        phone: "",
        password: "",
      },
      zhuces: {
        nickName: "",
        phone: "",
        password: "",
      },
      isPassword: true,
      show: false,
    };
  },

  methods: {
    onSubmit(values) {
      
    },
    password_text() {
      this.isPassword = !this.isPassword;
    },
    showPopup() {
      this.show = true;
    },
    suibian(name){
      this.$router.push({name});
    },
    // 注册
    register() {
      // 获取用户注册信息
      let userzhuce = this.zhuces;
      

      // 验证注册表单
      let o = {
        nickName: {
          value: userzhuce.nickName,
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
          errorMsg: "昵称格式不正确",
        },
        phone: {
          value: userzhuce.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: userzhuce.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };

      if (!yanzheng.valid(o)) {
        return;
      }

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        // 防止穿透效果
        forbidClick: true,
        // 显示时间，如果时间为0，则不会自动关闭
        duration: 0,
        loadingType: "spinner",
      });

      // 序列化参数
      let info = Object.assign({}, userzhuce);
      info.appkey = this.appkey;
      let data = utils.queryString(info);
      
      // 请求Ajax
      this.axios({
        method: "POST",
        url: "/register",
        data,
      })
        .then((result) => {
          // 关闭加载提示
          this.$toast.clear();
          
          if (result.data.code == 100) {
            this.show = false;
            for (let key in userzhuce) {
              userzhuce[key] = "";
            }
          } else {
            this.$notify({
              // type:'warning',
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 登录
    logintext() {
      // alert(111)
      let mima_has = this.mima_haoma;

      let o = {
        phone: {
          value: mima_has.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        password: {
          value: mima_has.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };

      // 验证表单
      if (!yanzheng.valid(o)) {
        return;
      }

     // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        // 防止穿透效果
        forbidClick: true,
        // 显示时间，如果时间为0，则不会自动关闭
        duration: 0,
        loadingType: "spinner",
      });

       // 序列化参数
      let info = Object.assign({}, mima_has);
      info.appkey = this.appkey;
      let data = utils.queryString(info);


      this.axios({
        method: 'POST',
        url: '/login',
        data
      }).then(result => {
        this.$toast.clear();
        
        if (result.data.code == 200) {
          localStorage.setItem('CSTK', result.data.token);
          this.$router.push({name: 'Shouye'});
        } else {
          this.$notify({
            type: 'warning', 
            message: result.data.msg
          })
        }
      }).catch(err => {
        this.$toast.clear();
        

      })
    },
  },
};
</script>
 
<style lang="less" scoped>
</style>