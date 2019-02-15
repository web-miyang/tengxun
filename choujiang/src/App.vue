<template>
  <div id="app">
    <!--<transition name="move" mode="out-in"><router-view></router-view></transition>-->
    <router-view></router-view>
  </div>

</template>

<script>

  export default {
    name: 'app',
    data() {
      return {
      }
    },
    components: {
    }
  }
</script>

<style>
  * {
    margin: 0px;
    padding: 0px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    background-color: #e6e6e6;
  }
  /*.move-enter-active,.move-leave-active{*/
    /*transition: opacity .5s;*/
  /*}*/
  /*.move-enter,.move-leave{*/
    /*opacity: 0;*/
  /*}*/

</style>
