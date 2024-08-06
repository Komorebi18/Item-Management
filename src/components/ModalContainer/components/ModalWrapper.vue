<!-- 本组件为每个弹窗外包组件，仅提供布局--水平垂直居中 -->
<template>
  <div id="modal-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped>
#modal-wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: fixed;
  z-index: 3000;
}
</style>
