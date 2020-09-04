<template>
    <div calss="daohangbox">
        <div>
            <keep-alive include="Shouye,Caidan">
                <router-view></router-view>
            </keep-alive>
        </div>
        <van-tabbar v-model="active" active-color="#0C34BA" route>
           
                <van-tabbar-item v-for="(item, index) in tubiao_button" :key="index" :to="item.url">
                    <span>{{item.title}}</span>
                    <template #icon="props">
                    <img :src="props.active ? item.icon.active : item.icon.inactive" />
                    </template>
                </van-tabbar-item>
                
        </van-tabbar>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                active:0,
                tubiao_button:[
                    {
                        title:'首页',
                        icon:{
                            active:require('../assets/images/home_active.png'),
                            inactive:require('../assets/images/home.png')
                        },
                        url:{
                            name:'Shouye'
                        }
                    },
                    {
                        title:'菜单',
                        icon:{
                            active:require('../assets/images/menu_active.png'),
                            inactive:require('../assets/images/menu.png')
                        },
                        url:{
                            name:'Caidan'
                        }
                    },
                    {
                        title:'购物袋',
                        icon:{
                            active:require('../assets/images/shopbag_active.png'),
                            inactive:require('../assets/images/shopbag.png')
                        },
                        url:{
                            name:'Gouwudai'
                        }
                    },
                    {
                        title:'我的',
                        icon:{
                            active:require('../assets/images/my_active.png'),
                            inactive:require('../assets/images/my.png')
                        },
                        url:{
                            name:'Wode'
                        }
                    },
                ]
            }
        },
       
    }
</script>

<style lang="less" scoped>
    // .daohangbox{
    //     padding-bottom: 50px;
    // }
</style>