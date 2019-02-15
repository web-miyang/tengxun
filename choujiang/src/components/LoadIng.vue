<template>
  <div class="LoadIng">
    <img class="logo" src="http://gorun-app-beijing-image.oss-cn-beijing.aliyuncs.com/official/activity/qingtie/l_yaoqinghan.jpg">
    <div style="display:none;">
      <img v-for="(item, index) in loading" :src='item' @load="successLoadImg(index)" @error="errorLoadImg(index)" />
    </div>
    <img class="loadbg" src="http://gorun-app-beijing-image.oss-cn-beijing.aliyuncs.com/official/activity/qingtie/jindutiao_d.png">
    <div class="jiancai" ref="jiancai">
      <img src="http://gorun-app-beijing-image.oss-cn-beijing.aliyuncs.com/official/activity/qingtie/jindutiao.png">
    </div>
  </div>
</template>

<script>
  import members from '../../static/js/members'

  var THREE = require('three');

  export default {
    name: 'HelloWorld',
    mounted: function () {
      var self = this;

      //载入所有的图片
      for (var key in members) {
        let name = members[key];
        let url = "static/assets/images/" + members[key] + ".jpg";
        THREE.ImageUtils.loadTexture(url, null, function (t) {
          self.$datacenter.addTexture(t, name)
          self.successLoadImg()
        });
      }
    },
    data() {
      return {
        loading: [],
        percent: 0,
        loaded: 0
      }
    },
    methods:
      {
        successLoadImg() {
          this.loaded++;
          this.percent = Math.floor(this.loaded * 100 / members.length)
          this.$refs.jiancai.style.width = 522 * this.percent / 100 + 'px';
          if (this.loaded >= members.length) {
            this.$router.replace("/pagetwo");
          }
        },
        errorLoadImg(index) {

        },
      },
    components: {}
  }
</script>
<style scoped>
  .LoadIng {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #b51e25;
  }

  .LoadIng .logo {
    position: absolute;
    transform: translate(-50%, 0);
    left: 50%;
    top: 130px;
  }

  .LoadIng .loadbg {
    position: absolute;
    transform: translate(0, -50%);
    left: 114px;
    top: 703px;
  }

  .LoadIng .jiancai {
    position: absolute;
    transform: translate(0, -50%);
    width: 0px;
    height: 16px;
    overflow-x: hidden;
    left: 114px;
    top: 700px;
  }

  .LoadIng .laipao8 {
    position: absolute;
    transform: translate(-50%, 0);
    left: 50%;
    bottom: 25px;
  }

</style>
