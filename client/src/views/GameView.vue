<template>
  <div class="is-fixed-top message-bar">
    <p>{{ message }}</p>
  </div>
  <section class="section animate__animated animate__fadeIn">
    <winner-modal @handleNextRound="handleNextRound" />
    <splitpanes class="default-theme">
      <pane :size="65" v-if="!amICurrentCzar">
        <player-view
          :currentPlayer="currentPlayer"
          :playerMessage="playerMessage"
          :isMobile="isMobile"
        />
      </pane>

      <pane v-if="!isMobile || amICurrentCzar" :size="35">
        <div class="czar-container">
          <status :czarName="currentCzar.name" />
          <czar-view
            :playerSelections="playerSelections"
            :currentBlackCard="currentBlackCard"
            :amICurrentCzar="amICurrentCzar"
            :czarMessage="czarMessage"
            :roomId="currentPlayer && currentPlayer.roomId"
          />
        </div>
      </pane>
    </splitpanes>
  </section>
</template>

<script>
import "splitpanes/dist/splitpanes.css";
import { defineComponent } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import CzarView from "./CzarView.vue";
import PlayerView from "./PlayerView.vue";
import Status from "../components/Status.vue";
import WinnerModal from "../components/WinnerModal.vue";

export default defineComponent({
  name: "PlayView",
  components: {
    CzarView,
    CzarView,
    Pane,
    PlayerView,
    Splitpanes,
    Status,
    WinnerModal,
  },
  props: {
    currentPlayer: Object,
  },
  data() {
    return {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      amICurrentCzar: false,
      currentCzar: "",
      currentBlackCard: "",
      message: "",
      playerMessage: "",
      czarMessage: "",
      playerSelections: [],
    };
  },
  methods: {
    setDefault() {
      this.amICurrentCzar = false;
      this.currentCzar = "";
      this.currentBlackCard = "";
      this.message = "";
      this.playerMessage = "Please choose a white card to fill in the blank";
      this.czarMessage =
        "Please wait for the other players to select their white card";
      this.playerSelections = [];
    },
    handleNextRound() {
      this.$socket.emit("next_round", {
        roomId: this.currentPlayer.roomId,
        playerId: this.currentPlayer.id,
      });
    },
  },
  sockets: {
    update_playground(data) {
      this.currentCzar = data.currentCzar;
      this.currentBlackCard = data.currentBlackCard;
      this.amICurrentCzar = this.currentPlayer.name === data.currentCzar.name;
      this.message = `${this.amICurrentCzar ? "You" : data.currentCzar.name} ${
        this.amICurrentCzar ? "are" : "is"
      } the current Czar.`;
    },
    czar_chooses(data) {
      this.playerSelections = data.playerSelections;
      this.message = `All players have selected a white card. Czar ${this.currentCzar.name} will now choose their favorite!`;
      this.playerMessage = `Waiting on Czar ${this.currentCzar.name} to select their favorite response`;
      this.czarMessage = "Please select your favorite answer!";
    },
    new_round() {
      this.setDefault();
    },
  },
  mounted() {
    this.setDefault();
  },
});
</script>

<style lang="scss" scoped>
.section {
  padding: 32px 0 0 0;
  height: 100%;
}

.message-bar {
  width: 100%;
  background-color: black;
  color: white;
  font-size: 15px;
  padding: 5px;
  z-index: 10000;
  position: fixed;
}

.czar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 25px 10px 40px 10px;
  height: 100%;
}
</style>
