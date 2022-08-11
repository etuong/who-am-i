<template>
  <nav-bar :playerName="currentPlayer && currentPlayer.name" />
  <div class="body-content hero is-fullheight">
    <home
      v-if="showHomeView"
      @showToast="showToast"
      class="animate__animated"
      :class="TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)]"
    />
    <lobby v-if="showLobbyView" :currentPlayer="currentPlayer" />
    <game
      v-if="showGameView"
      :currentPlayer="currentPlayer"
      @showHome="showHome"
    />
  </div>
  <FooterComponent />
</template>

<script>
import { defineComponent } from "vue";
import FooterComponent from "@/components/Footer.vue";
import Home from "@/views/HomeView.vue";
import NavBar from "@/components/NavBar.vue";
import Lobby from "@/views/LobbyView.vue";
import Game from "@/views/GameView.vue";
import { useRoute } from "vue-router";
import { toast } from "bulma-toast";

export default defineComponent({
  components: {
    FooterComponent,
    Home,
    NavBar,
    Lobby,
    Game,
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
    showToast(message, type, duration = 3500) {
      toast({
        message,
        type,
        duration: duration,
        position: "bottom-right",
        animate: { in: "fadeIn", out: "fadeOut" },
      });
    },
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
    showHome() {
      this.showView("Home");
    },
    async registerPlayer() {
      let name = await this.getName();
      const { pathname, search } = window.location;
      const path = pathname + search;
      this.$socket.emit("join_room", {
        id: path,
        name,
      });
    },
    async getName() {
      const name = await this.$swal({
        title: "Enter your name",
        input: "text",
        showCancelButton: false,
        allowOutsideClick: false,
        inputPlaceholder: "Your name is...",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
        inputValidator: (value) => {
          if (!value) {
            return "You need to have a name!";
          }
        },
      });

      return name.value;
    },
  },
  sockets: {
    connected() {
      console.log("Application socket is connected!");
    },
    room_exists() {
      this.showView("Lobby");
      this.registerPlayer();
    },
    player_name_exist() {
      this.showToast(
        "This name has been taken. Please choose another name!",
        "is-danger"
      );
      this.registerPlayer();
    },
    show_lobby() {
      this.showView("Lobby");
    },
    game_start() {
      this.showView("Game");
    },
    player_disconnect(quitter) {
      this.showToast(`Player ${quitter} has left the room`, "is-warning");
    },
    game_in_session() {
      this.showToast("Looks like the game has started!", "is-danger");
    },
    guess_right(name) {
      this.showToast(`${name} guessed their card correctly!`, "is-success");
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
    const { pathname, search } = window.location;
    const path = pathname + search;
    this.$socket.emit("check_room_validity", path);
  },
});
</script>

<style scoped>
.body-content {
  flex: 1 0 auto;
  padding-top: 50px;
}
</style>
