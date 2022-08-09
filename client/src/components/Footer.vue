<template>
  <footer class="section border-top">
    <div class="is-flex-tablet is-justify-content-end">
      <p>
        Created by
        <a
          className="github"
          href="https://github.com/etuong/who-am-i"
          target="_blank"
          >Ethan Uong</a
        >
        👨‍💻
      </p>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterComponent",
});
</script>

<style scoped>
.border-top {
  border-top: 1px solid #dee2e6;
  padding: 10px;
}

footer {
  flex-shrink: 0;
  padding: 5px 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
