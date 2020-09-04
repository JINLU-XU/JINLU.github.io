<template>
  <div class="tijiao">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow :fixed="true" @click-left="back" />

    <div class="address-box">
      <div class="address">
        <div class="clearfix" @click="tijiaoding">
          <div class="fl address-title">选择收货地址</div>
          <div class="fl arrow-box">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="address-content">
          <div class="clearfix">
            <div class="fl name">{{currents.name}}</div>
            <div class="fl phone">{{currents.tel}}</div>
          </div>
          <div class="address-info">{{currents.address}}</div>
        </div>
      </div>
    </div>

    <div class="order-info">
      <div class="order-box">
        <div class="order-title">订单信息</div>

        <div>
          <div class="clearfix cell-box" v-for="(item, index) in gouwudaiData" :key="index">
            <div class="fl pro-img">
              <img class="img_auto" :src="item.small_img" alt />
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
                <div class="fr count">x{{item.count}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pro-box">
          
          <div class="clearfix pro-boxing">
            <div class="fl pro-count">共计 {{product.count}} 件商品</div>
            <div class="fr pro-total">合计 ￥{{product.total}}</div>
          </div>
          <div class="left-box left"></div>
          <div class="left-box right"></div>
        </div>
      </div>
    </div>

    <div class="pay-btn">
      <van-button round block color="#0C34BA" @click="pay">立即结算</van-button>
    </div>

    <van-popup v-model="isOpen" position="bottom" closeable>
      <div class="address-title-box">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="xuanze"
        @add="newAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/tijiao.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      isOpen: false,
      chosenAddressId: "",
      //地址列表数据
      list: [],
      //选择地址数据
      currents: {
        name: "",
        tel: "",
        address: "",
      },
      //购物袋数据
      gouwudaiData: [],

      product: {
        count: 0,
        total: 0,
      },

      sids: [],
    };
  },

  created() {
    this.sids = this.$route.query.sids.split("-");

    this.getReceiveAddress();

    this.genwudaixius();
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    tijiaoding() {
      this.isOpen = true;
    },

    //选择地址
    xuanze(item, index) {
      this.isOpen = false;
      
      
      for (let key in this.currents) {
        this.currents[key] = item[key];
      }
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "Xinzeng" });
    },

    //查询收货地址
    getReceiveAddress() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            result.data.result.map((v) => {
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address,
                isDefault: Boolean(v.isDefault),
              });

              if (Boolean(v.isDefault)) {
                (this.chosenAddressId = v.aid), (this.currents.name = v.name);
                this.currents.tel = v.tel;
                this.currents.address = address;
              }
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //根据sids查询购物袋数据
    genwudaixius() {
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
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 50000) {
            if (result.data.result.length === 0) {
              return this.$router.push({ name: "Shouye" });
            }

            result.data.result.map((v) => {
              this.product.count += v.count;
              this.product.total += v.count * v.price;
            });

            this.gouwudaiData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //立即结算
    pay() {
      //判断是否选择地址
      if (this.chosenAddressId == "") {
        this.$toast("请选择收货地址");
        return;
      }

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.currents.tel,
        address: this.currents.address,
        receiver: this.currents.name,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code == 60000) {
            this.$router.push({ name: "Wodedingdan" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>
