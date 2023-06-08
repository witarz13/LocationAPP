<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <myLocation/>
</template>

<script>
import myLocation from './components/myLocation'

export default {
  name: 'App',
  components: {
    myLocation
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
