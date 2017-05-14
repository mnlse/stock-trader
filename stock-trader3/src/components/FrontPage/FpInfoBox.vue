<template>
  <div class="fpb-box">
    <slot></slot>
  </div>
</template>

<script>

</script>

<style lang="scss">
.fpb-box {
  position: absolute;
  padding: 1.5vw;
  background-color: rgba(255,255,255,0.8);
  opacity: 1;
  top: 50%;
  transform: translateY(-50%);
  transition-property: opacity, transform;
  transition: 0.7s;
}
.fpb-box-cont {
  position: relative;
  height: 100vh;
}
.box-enter {
  padding: 1.5vw;
  transform: translateY(-75%);
  opacity: 0;
}

.box-enter-active {
}

.box-leave {
}

.box-leave-active {
  transform: translateY(-10%);
  opacity: 0;
  transition: 0.5s;
}
</style>
