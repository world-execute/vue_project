<template>
  <div id="app">
    <!--<transition-->
    <!--      mode="out-in"-->
    <!--      enter-active-class="animate__animated animate__fadeInLeft"-->
    <!--      leave-active-class="animate__animated animate__fadeOutRight"-->
    <!--&gt;-->
    <!--  <router-view></router-view>-->
    <!--</transition>-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'App'
}
</script>

<style>
#app{
  width: 100%;
  height: 100%;
}
</style>
