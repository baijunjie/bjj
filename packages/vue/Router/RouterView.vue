<!--
router 中需要一个 <router-view> 模板
但是如果要使用字符串模板，则必须加入运行时编译代码，这会导致应用代码体积增大
因此使用外部组件的方式，便于让 webpack 进行预编译
-->
<template>
  <router-view></router-view>
</template>
