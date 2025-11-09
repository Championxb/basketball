<template>
  <div class="popBody">
    <el-button @click="getShow" type="primary">弹窗</el-button>
    <pop ref="pop" pop-width="1000px" pop-height="600px">
      dsfsdfsd
    </pop>
  </div>
</template>

<script>

import pop from './pop.vue'

export default {
  data() {
    return {}
  },
  components: {pop},
  computed: {},
  mounted() {
    // this.getShow()
  },
  methods: {
    getShow() {
      this.$refs.pop.getShow()
    }
  },
}
</script>

<style lang="scss" scoped>
.popBody {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
