<template>
  <div class="start">
    <div class="str">{{strshow}}</div>
    
  </div>
</template>
<script>
export default {
  name: 'start',
  data () {
    return {
      str: [
        'hello',
        '别眨眼',
        'everybody',
        '大家',
        '晚上好',
        '今天',
        '我们',
        '相聚',
        '在一起',
        '举办',
        '一场',
        '迎新',
        '联欢会',
        '今天',
        '不仅有',
        '精彩的节目',
        '还有',
        '丰厚的礼品'
      ],
      strshow: ''
    }
  },
  mounted () {
    this.show()
  },
  methods: {
    show() {
      var that = this
      var index = 0
      var timer = setInterval(() => {
        that.strshow = that.str[index]
        if(index >= (that.str.length - 1)) {
          // clearInterval(timer)
          index = 0
        } else {
          index ++
        }
      }, 500)
    }
  }
}
</script>
<style scoped>
  .start {width: 100%;height: 100%;position: relative;}
  .str {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 2rem;font-weight: 900;}
</style>
