<template>
  <a class="sidebar-option" v-bind:href="url"> <i :class="icon"></i> {{ text }}</a>
</template>

<script>
export default {
  props: ['url', 'text', 'icon']
}
</script>

<style lang="scss" scoped>
$vh: 93vh;
.sidebar-option {
    padding-top: 20px;
    margin-left: 30px;
    color:  #0D4CB8;
    text-decoration: none;
    display: block;
}
</style>
