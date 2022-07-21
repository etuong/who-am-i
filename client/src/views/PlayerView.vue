<template>
  <div
    v-if="playerCards"
    class="player-selection"
    :class="{ 'white-cards': isMobile }"
  >
    <div class="card-container" id="card-panel">
      <card
        v-for="(card, index) in playerCards"
        class="animate__animated"
        :key="card"
        :isWhite="true"
        :text="card"
        @click="selectCard(index, card)"
        :hoverable="isMobile"
        :style="{ position: isMobile ? 'relative' : 'absolute' }"
      />
    </div>
    <div class="player-bar">
      <p>{{ message }}</p>
      <button
        :disabled="!enableConfirmationBtn"
        class="button is-success is-small"
        @click="submitSelection"
      >
        <strong>Select!</strong>
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Card from "../components/Card.vue";

export default defineComponent({
  name: "PlayerView",
  components: { Card },
  props: {
    currentPlayer: Object,
    isMobile: Boolean,
    playerMessage: String,
  },
  data() {
    return {
      enableConfirmationBtn: false,
      hasPlayerSelected: false,
      message: this.playerMessage,
      selected_card: [],
      playerCards: this.currentPlayer?.cards,
    };
  },
  methods: {
    setDefault() {
      this.nableConfirmationBtn = false;
      this.hasPlayerSelected = false;
      this.selected_card = [];
    },
    selectCard(id, card) {
      if (!this.hasPlayerSelected) {
        this.selected_card = [id, card];
        this.message = card;
        this.enableConfirmationBtn = true;
      }
    },
    submitSelection() {
      this.$socket.emit("white_card_submission", {
        roomId: this.currentPlayer.roomId,
        playerId: this.currentPlayer.id,
        selection: this.selected_card[1],
      });
      this.message = "Waiting on other players";
      this.enableConfirmationBtn = false;
      this.hasPlayerSelected = true;
      document.querySelector(".clicked-card").classList.add("selected-card");
    },
    attachCardStyle(selector) {
      $(selector).mousedown((e) => {
        if (!this.isMobile) {
          $(".clicked-card").css("z-index", "0");
          $(e.currentTarget).css("z-index", "100");
        }
        if (!this.hasPlayerSelected || this.isMobile) {
          $(".clicked-card").removeClass("clicked-card");
          $(e.currentTarget).addClass("clicked-card");
        }
      });
    },
    attachDraggable(selector) {
      $(selector)
        .draggable({
          stack: "div",
          containment: "parent",
        })
        .addClass("attached");
    },
    dropNewCards(selector) {
      // Randomly place white cards on the table
      var cards = document.querySelectorAll(selector);
      for (var card of cards) {
        $(card).css({
          left: Math.random() * ($("#card-panel").width() - $(card).width()),
          top: Math.random() * ($("#card-panel").height() - $(card).height()),
        });
      }
    },
  },
  sockets: {
    new_round() {
      this.setDefault();

      const usedCard = document.querySelector(".selected-card");
      usedCard.parentElement.removeChild(usedCard);

      $(".clicked-card").removeClass("clicked-card");
    },
  },
  mounted() {
    this.attachCardStyle(this.SELECTOR);

    if (!this.isMobile) {
      this.attachDraggable(this.SELECTOR);
      this.dropNewCards(".card-container .white-card");
    }
  },
  created() {
    this.SELECTOR = ".card-container .white-card:not(.attached)";
  },
  watch: {
    playerMessage(newMessage) {
      this.message = newMessage;
    },
    currentPlayer(newCurrentPlayer) {
      this.playerCards = newCurrentPlayer?.cards;
      this.$forceUpdate();
      setTimeout(() => {
        this.attachCardStyle(this.SELECTOR);

        if (!this.isMobile) {
          $(this.SELECTOR).addClass("animate__heartBeat");
          this.attachDraggable(this.SELECTOR);
        }
      }, 100);
    },
  },
});
</script>

<style lang="scss" scoped>
.player-selection {
  height: 100%;
  width: auto;
  position: relative;

  .card-container {
    padding: 5px 5px 40px 5px;
    height: 100%;
  }

  .clicked-card {
    border: 0.15em solid black;
  }

  .selected-card {
    border: 0.15em solid red;
  }

  .white-cards {
    width: 100%;
    overflow-y: auto;
    flex: 1;
    padding: 10px 0;
    .white-card {
      margin: 0 auto;
    }
  }

  .player-bar {
    width: 100%;
    background-color: black;
    color: white;
    font-size: 15px;
    padding: 5px;
    z-index: 10000;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    .button {
      margin-left: auto;
    }
  }
}
</style>
