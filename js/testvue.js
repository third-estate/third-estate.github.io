var calculation = new Vue({
  el: '#computedValue',
  data: {
    height: 4000
  },
  computed: {
    doubled: function() {
      console.log("doubling");
      return this.height * 2;
    }
  },
  methods: {
    squared: function() {
      console.log("squaring");
      return Math.pow(this.height, 2);
    }
  }
})
