<template>
  <div class="gouwudai">
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-right="bianji"
      @click-left="back"
    >
      <template #right v-if="gouwudaiData.length > 0">
        <div>{{isEdit ? '完成' : '编辑'}}</div>
      </template>
    </van-nav-bar>
    <div v-if="gouwudaiData.length > 0">
      <div class="shopbag-bg"></div>
      <van-swipe-cell :disabled="!isEdit" v-for="(item, index) in gouwudaiData" :key="index">
        <van-cell :border="false">
          <div class="clearfix cell-box">
            <div class="fl check">
              <van-checkbox
                v-model="item.isCheck"
                icon-size="24px"
                checked-color="#0C34BA"
                @change="danxuanBox"
              ></van-checkbox>
            </div>
            <div class="fl pro-img">
              <img class="img_auto img_bbx" :src="item.small_img" alt />
            </div>
            <div class="fl pro-info">
              <div class="text-box">
                <div class="clearfix">
                  <div class="fl text-name">{{item.name}}</div>
                  <div class="fl text-rule">{{item.rule}}</div>
                </div>
                <div class="text-enname">{{item.enname}}</div>
              </div>
              <div class="price-box">
                <div class="fl price">￥{{item.price}}</div>
                <div class="fr">
                  <van-stepper
                    v-model="item.count"
                    theme="round"
                    button-size="24"
                    disable-input
                    @change="xiugaishang(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </van-cell>

        <template #right>
          <van-button square color="#3D75FE" text="删除" @click="removeOneShopbag(item.sid)" />
        </template>
      </van-swipe-cell>

      <div>
        <van-submit-bar
          v-show="!isEdit"
          :price="total"
          button-text="提交订单"
          button-color="#0C34BA"
          @submit="commit"
        >
          <van-checkbox
            @click="allSelect"
            v-model="allCheck"
            icon-size="24px"
            checked-color="#0C34BA"
          >全选</van-checkbox>
        </van-submit-bar>

        <van-submit-bar
          v-show="isEdit"
          button-text="删除选择"
          button-color="#0C34BA"
          @submit="removeduoge"
        >
          <van-checkbox
            v-model="allCheck"
            @click="allSelect"
            icon-size="24px"
            checked-color="#0C34BA"
          >全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
    <div v-else>
      <van-empty description="购物袋空空如也~">
        <van-button round color="#0C34BA" class="bottom-button" @click="goMenu">去逛一逛</van-button>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../../assets/less/gouwudai.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      isEdit: false,
      allCheck: false,
      gouwudaiData: [],
      total: 0,
    };
  },
  created() {
    
    //查询购物袋数据
    this.chaxun();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //回到菜单
    goMenu() {
      this.$router.push({ name: "Caidan" });
    },

    //提交订单
    commit() {
      //查找需要购买的商品, sid
      let sids = [];
      this.gouwudaiData.map((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast("请选择购买商品");
        return;
      }

      sids = sids.join("-");

      this.$router.push({ name: "Tijiao", query: { sids } });

      // 
    },

    //编辑商品
    bianji() {
      this.isEdit = !this.isEdit;
    },

    //查询购物袋数据
    chaxun() {
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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          

          if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isCheck = false;
            });

            this.gouwudaiData = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //全选
    allSelect() {
      this.gouwudaiData.map((v) => {
        v.isCheck = this.allCheck;
      });

      this.sum();
    },

    //单选
    danxuanBox() {
      this.sum();

      for (let i = 0; i < this.gouwudaiData.length; i++) {
        if (!this.gouwudaiData[i].isCheck) {
          this.allCheck = false;
          return;
        }
      }

      this.allCheck = true;
    },

    //修改商品数量
    xiugaishang(item) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sid: item.sid,
        count: item.count,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          this.sum();
          if (result.data.code !== 6000) {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除购物袋数据
    removegouwu(sids) {
      //sids: sid的集合，类型：array

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(sids),
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      return this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data,
      });
    },

    //单个删除购物袋
    removeOneShopbag(sid, index) {
      this.removegouwu([sid])
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            this.gouwudaiData.splice(index, 1);
          }

          this.$toast(result.data.msg);

          this.sum();
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除多个购物袋
    removeduoge() {
      //查找选择购物袋
      let sids = [];
      this.gouwudaiData.map((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      this.removegouwu(sids)
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            for (let i = this.gouwudaiData.length - 1; i >= 0; i--) {
              if (this.gouwudaiData[i].isCheck) {
                this.gouwudaiData.splice(i, 1);
              }
            }

            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //计算总金额
    sum() {
      this.total = 0;
      this.gouwudaiData.map((v) => {
        if (v.isCheck) {
          this.total += v.count * v.price;
        }
      });

      this.total *= 100;
    },
  },
};
</script>