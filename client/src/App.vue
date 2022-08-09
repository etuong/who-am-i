<template>
  <nav-bar />
  <div class="body-content hero is-fullheight">
    <home
      v-if="showHomeView"
      class="animate__animated"
      :class="TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)]"
    />
    <lobby v-if="showLobbyView" :currentPlayer="currentPlayer" />
  </div>
  <FooterComponent />
</template>

<script>
import { defineComponent } from "vue";
import FooterComponent from "@/components/Footer.vue";
import Home from "@/views/HomeView.vue";
import NavBar from "@/components/NavBar.vue";
import Lobby from "@/views/LobbyView.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    FooterComponent,
    Home,
    NavBar,
    Lobby,
  },
  data() {
    return {
      currentPlayer: undefined,
      showHomeView: true,
      showLobbyView: false,
      showGameView: false,
    };
  },
  methods: {
    showView(view) {
      this.showHomeView = false;
      this.showLobbyView = false;
      this.showGameView = false;
      switch (view) {
        case "Home":
          this.showHomeView = true;
          break;
        case "Lobby":
          this.showLobbyView = true;
          break;
        case "Game":
          this.showGameView = true;
          break;
        default:
      }
    },
  },
  sockets: {
    connected() {
      console.log("Application socket is connected!");
    },
    invalid_room() {
      this.$swal({
        icon: "error",
        title: "Oops...",
        text: "This room does not exist. Please check your URL or create a new room!",
      });
    },
    show_lobby() {
      this.showView("Lobby");
    },
    update_player(currentPlayer) {
      this.currentPlayer = currentPlayer;
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
  mounted() {
    const path = window.location.pathname.substring(1);
    if (path) {
      this.$socket.emit("check_room_validity", path);
    }
  },
});
</script>

<style scoped>
.body-content {
  flex: 1 0 auto;
  padding-top: 50px;
}
</style>
