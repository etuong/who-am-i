<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <img src="../assets/logo.png" class="logo" />
      <a class="navbar-item site-title" href="#">Who Am I?</a>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
  props: { },
  methods: {},
});
</script>

<style scoped>
.navbar {
  padding: 0px 15px;
  z-index: 0;
}

.navbar-brand {
  width: 100%;
}

.logo {
  width: 50px;
  height: 50px;
  max-height: auto;
}

.navbar-item.site-title {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  color: black;
  font-size: larger;
}
</style>
