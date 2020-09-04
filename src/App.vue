<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<style lang="less">
  body{
    margin: 0;
    padding: 0;
    user-select: none;
  }
  .fl{
        float: left;
    }
  .fr{
      float:right;
    }
  .clearfix::after{
    content:"";
    display:block;
    clear:both;
  }
  .img_auto{
    width: 100%;
    // height: 100px;
    display: block;
  }
</style>
