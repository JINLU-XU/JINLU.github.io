<template>
  <div class="wode">
    <div class="my-bg">
      <van-uploader v-if="isMain" class="uploader-box" :after-read="upload" />
    </div>
    <div class="my-content">
      <div class="my-boxing">
        <div v-if="isMain" class="my-box">
          <div class="my-img">
            <div class="img-box">
              <img class="img_auto" :src="userInfo.userImg" alt />
            </div>
            <div class="my-info">
              <div class="nickname">{{userInfo.nickName}}</div>
              <div class="desc">{{userInfo.desc == '' ? '这个家伙很懒，什么都没留下~' : userInfo.desc}}</div>
            </div>
          </div>
        </div>
        <div class="not-login" v-else>
          <span @click="goMain">请先登录</span>
        </div>

        <div class="lists">
          <van-cell
            :title="item.title"
            :to="item.to"
            size="large"
            is-link
            v-for="(item, index) in lists"
            :key="index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/wode.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      lists: [
        { title: "个人资料", to: { name: "Gerenziliao" } },
        { title: "我的订单", to: { name: "Wodedingdan" } },
        { title: "我的收藏", to: { name: "Likes" } },
        { title: "收货地址", to: { name: "Shouhuodizhi" } },
        { title: "安全中心", to: { name: "Anquan" } },
      ],
      isMain: false,
      userInfo: {},
      maxSize: 1 * 1024 * 1024,
    };
  },

  created() {
    this.information();
  },

  methods: {
    goMain() {
      this.$router.push({ name: "Main" });
    },

    //查询用户信息
    information() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == "A001") {
            if (result.data.result.length > 0) {
              this.isMain = true;
              this.userInfo = result.data.result[0];
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //上传背景
    upload(file) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //获取文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA",
        });

        return;
      }

      //大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA",
        });
        return;
      }

      // 

      //获取base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>