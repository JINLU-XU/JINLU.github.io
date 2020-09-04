<template>
  <div class="caidan">
    <van-search shape="round" background="#0C34BA" placeholder="请输入搜索关键词" />
    <div class="left_box">
      <!-- 导航栏 -->
      <div class="fl box_daohang">
        <!-- <div class="ce_daohang">每日推荐</div> -->
        <div
          class="ce_daohang"
          v-for="(item,index) in potions"
          :key="index"
          :class="{isActive:item.isActive}"
          @click="potion_item(item)"
        >{{item.typeDesc}}</div>
      </div>

      <!-- 右边 -->
      <div class="right_box">
        <!-- 单个奶茶 -->

        <div
          class="shangpn clearfix"
          v-for="(item,index) in products"
          :key="index"
          @click="redirection(item.pid)"
        >
          <div class="img_box fl">
            <img class="img_auto" :src="item.smallImg" alt />
          </div>

          <div class="ht_shang_box fr">
            <div class="bujinqi">
              <div class="name_item">{{item.name}}</div>
              <div class="name_item_eres">{{item.enname}}</div>
              <!-- <van-stepper v-model="value" theme="round" button-size="17" disable-input /> -->
            </div>
            <div class="price">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/caidan.less";
export default {
  data() {
    return {
      value: 0,
      //    选项
      potions: [],
      products: [],
    };
  },
  created() {
    this.cai_xuanxiang();
  },
  methods: {
    //  切换商品类型
    potion_item(item) {
      if (item.isActive) {
        return;
      }
      for (let i = 0; i < this.potions.length; i++) {
        // 
        if (this.potions[i].isActive) {
          this.potions[i].isActive = false;
          break;
        }
      }
      item.isActive = true;
      // 根据商品类型获取数据
      this.swidthtype(item);
    },

    // 获取商品类型数据
    cai_xuanxiang() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/type",

        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 400) {
            for (let i = 0; i < result.data.result.length; i++) {
              result.data.result[i].isActive = false;
            }
            result.data.result.unshift({
              type: "isHot",
              typeDesc: "推荐",
              isActive: true,
            });
            this.potions = result.data.result;
            this.swidthtype(this.potions[0]);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 切换商品获取类型数据
    swidthtype(item) {
      this.products = [];

      let data = sessionStorage.getItem(item.type);
      // 
      if (data) {
        this.products = JSON.parse(data);
        return;
      }

      let params = {
        key: "type",
        value: item.type,
        appkey: this.appkey,
      };

      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }
      // 

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          
          this.$toast.clear();
          if (result.data.code == 500) {
            this.products = result.data.result;
            this.products = this.products.concat(this.products);

            // 将商品数据缓存
            sessionStorage.setItem(item.type, JSON.stringify(this.products));
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 跳转到详情页
    redirection(pid) {
      this.$router.push({ name: "Detailpage", query: { pid } });
    },
  },
};
</script>
