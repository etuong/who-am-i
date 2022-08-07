<template>
  <nav-bar />
  <div class="body-content">
    <home
      v-if="showHomeView"
      class="animate__animated"
      :class="TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)]"
    />
    <lobby v-if="showLobbyView" />
  </div>
  <FooterComponent />
</template>

<script>
import { defineComponent } from "vue";
import FooterComponent from "@/components/Footer.vue";
import Home from "@/views/HomeView.vue";
import NavBar from "@/components/NavBar.vue";
import Lobby from "@/views/LobbyView.vue";

export default defineComponent({
  components: {
    FooterComponent,
    Home,
    NavBar,
    Lobby,
  },
  data() {
    return { showHomeView: false, showLobbyView: true };
  },
  methods: {},
  sockets: {
    connected() {
      console.log("Application socket is connected!");
    },
  },
  created() {
    this.TRANSITIONS = [
      "animate__backInLeft",
      "animate__backInRight",
      "animate__bounceIn",
      "animate__fadeInTopLeft",
      "animate__fadeIn",
      "animate__rotateInDownLeft",
      "animate__zoomIn",
    ];
  },
});
</script>

<style scoped>
.body-content {
  flex: 1 0 auto;
  padding-top: 50px;
}
</style>
