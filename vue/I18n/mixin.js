export default {
  beforeCreate () {
    const { namespace } = this.$options
    if (namespace) {
      this.T = this.$i18n.getT(namespace)
    }
  }
}
