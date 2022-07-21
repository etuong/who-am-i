<template>
  <div class="hello"></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style scoped></style>
