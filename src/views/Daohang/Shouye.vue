<template>
    <div class="shouye">
        <div>
            <router-view></router-view>
        </div>
        <van-nav-bar :fixed="true">
            <template #left>
            <div class="shou_title">寒冬中季，蓝朋友陪你</div>
            </template>
            <template #right>
                <div class="right_see clearfix">
                    <div class="zuobiao fl">
                        <img src="../../assets/images/ZB.png" alt="">
                    </div>
                    <div class="text_zuo fr">桂山新村小区></div>
                </div>
            </template>
        </van-nav-bar>
        
        <!-- 轮播层 -->
    <div>
        <van-swipe :autoplay="6000"  style="height: 200px;" vertical :show-indicators="false">
            <van-swipe-item v-for="(item,index) in bannerget" :key="index" @click="redirection(item.pid)">
                <img class="img_auto" :src="item.bannerImg" alt="">
            </van-swipe-item>
           
        </van-swipe>
    </div>
        <!-- 派送 -->
        <div class="luckin_pai clearfix">
            
                <div class="titles fl">
                    <div class="pai_title_tiem">Luckin派送</div>
                    <div class="pai_stime">30分钟必达</div>
                    <span class="diandong fr">
                        <img src="../../assets/images/DD.png" alt="">
                    </span>
                </div>
            
            <div class="pai_right fr clearfix">
                <div class="pai_daodian">到店自取</div>
                <div class="pai_kuaisu">快速取餐不排队</div>
                <span class="wai_xiang fr">
                    <img src="../../assets/images/WM.png" alt="">
                </span>
            </div>
        </div>

        <!-- 企业账户 -->
        <div class="paddings">
        <div class="qizhang_box clearfix">
            <div class="qi_left fl">
                <div class="qi_text">企业账户</div>
                <div class="chuang_text">创建office新潮流</div>
            </div>
            <div class="shen_right fl">
                <span>申请立享7.5折</span>
            </div>
        </div>
        </div>
        
        <!-- 大师推荐 -->
            <div class="dashi_text">大师推荐</div>

            <!-- 商品 -->
        <div class="dashi_box">
            <div class="tuijian_box" >
                <!-- 样品 -->
                <div class="yangpin_item">

                    <div class="yangpin_text fl clearfix" :class="[index % 2 == 0 ? 'p-left' : 'p-right']" v-for="(item,index) in remen_shang" :key="index">
                        <div class="img_box_item" @click="redirection(item.pid)">
                            <img class="img_item " :src="item.smallImg" alt="">
                        </div>
                        <div class="img_name fl">{{item.name}}</div>
                        <div class="marray">￥{{item.price}}</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../../assets/less/shouye.less'
    export default {
        data(){
            return{
                // 轮播
                bannerget:[],
                remen_shang:[]
            }
        },

        created(){
            this.getbanner();
            this.hotcommodity()
        },

        methods:{
            // 轮播
            getbanner(){
                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0,
                    loadingType:'spinner'
                })

                this.axios({
                method:'GET',
                url:'/banner',

                params:{
                    appkey:this.appkey,
                   
                }
                }).then(result => {
                this.$toast.clear();
                // 
                if(result.data.code == 300){
                    this.bannerget = result.data.result;
                }
                }).catch(err => {
                this.$toast.clear();
                

            })
            },

            // 热门商品
            hotcommodity(){
                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0,
                    loadingType:'spinner'
                })

                this.axios({
                method:'GET',
                url:'/typeProducts',

                params:{
                    appkey:this.appkey,
                    key: 'isHot',
                    value: 1
                }
                }).then(result => {
                this.$toast.clear();
                
                if(result.data.code == 500){
                    this.remen_shang = result.data.result;
                }
                }).catch(err => {
                this.$toast.clear();
                

                })
            },

            // 跳转到详情页
            redirection(pid){
                this.$router.push({name:'Detailpage',query:{pid}})
            }
        }
    }
</script>

<style lang="less" scoped>

</style>