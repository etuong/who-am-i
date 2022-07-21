<template>
  <div class="black-card-container">
    <card :isWhite="false" :text="currentBlackCard" />
  </div>
  <div class="czar-selections" v-if="playerSelections.length > 1">
    <div class="prev-selection">
      <card :isWhite="true" :text="playerSelections[czarPrevSelectionIndex]" />
    </div>
    <div class="current-selection">
      <card :isWhite="true" :text="playerSelections[czarCurrSelectionIndex]" />
    </div>
    <div class="next-selection">
      <card :isWhite="true" :text="playerSelections[czarNextSelectionIndex]" />
    </div>

    <a v-if="amICurrentCzar" class="prev" @click="changeSelection(-1)"
      >&#10094;</a
    >
    <a v-if="amICurrentCzar" class="next" @click="changeSelection(1)"
      >&#10095;</a
    >
  </div>
  <div class="czar-bar" v-if="amICurrentCzar">
    <p>{{ message }}</p>
    <button
      :disabled="!readyToSelect"
      class="button is-success is-small"
      @click="submitSelection"
    >
      <strong>Select!</strong>
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Card from "../components/Card.vue";

export default defineComponent({
  name: "CzarView",
  components: { Card },
  props: {
    amICurrentCzar: Boolean,
    currentBlackCard: String,
    czarMessage: String,
    playerSelections: Array,
    roomId: String,
  },
  data() {
    return {
      czarCurrSelectionIndex: 0,
      czarNextSelectionIndex: 1 || 0,
      czarPrevSelectionIndex: this.playerSelections.length - 1,
      message: this.czarMessage,
      readyToSelect: false,
    };
  },
  methods: {
    setDefault() {
      this.readyToSelect = false;
      this.czarCurrSelectionIndex = 0;
      this.czarNextSelectionIndex = 1 || 0;
      this.czarPrevSelectionIndex = this.playerSelections.length - 1;
    },
    changeSelection(iteration) {
      let length = this.playerSelections.length;

      const updateSelection = (index) => {
        index = index + iteration;

        if (index < 0) {
          index = length - 1;
        } else if (index === length) {
          index = 0;
        }

        return index;
      };

      this.$socket.emit("slide_player_selections", {
        czarPrevSelectionIndex: updateSelection(this.czarPrevSelectionIndex),
        czarCurrSelectionIndex: updateSelection(this.czarCurrSelectionIndex),
        czarNextSelectionIndex: updateSelection(this.czarNextSelectionIndex),
        roomId: this.roomId,
      });
    },
    submitSelection() {
      this.$socket.emit("czar_selection", {
        czarSelection: this.playerSelections[this.czarCurrSelectionIndex],
        roomId: this.roomId,
      });
    },
  },
  sockets: {
    slide_player_selections(data) {
      this.czarPrevSelectionIndex = data.czarPrevSelectionIndex;
      this.czarCurrSelectionIndex = data.czarCurrSelectionIndex;
      this.czarNextSelectionIndex = data.czarNextSelectionIndex;
    },
    new_round() {
      this.setDefault();
    },
  },
  watch: {
    czarMessage(newMessage) {
      this.message = newMessage;
    },
    playerSelections(newPlayerSections) {
      if (newPlayerSections.length > 0) {
        this.czarPrevSelectionIndex = newPlayerSections.length - 1;
        this.readyToSelect = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.black-card-container {
  margin-top: auto;
  margin-bottom: auto;
  height: 250px;
}

.czar-selections {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform-origin: bottom;
  animation: flyup 0.5s;
  position: relative;
  margin-bottom: auto;
  .white-card {
    margin-bottom: -70%;
    animation: none;
  }
}

.prev-selection,
.next-selection {
  filter: blur(4px);
  transform: scale(0.8);
  .white-card {
    cursor: default;
  }
}

.current-selection .white-card {
  cursor: default;
  border: 0.15em solid black;
}

.prev,
.next {
  cursor: pointer;
  z-index: 999;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: black;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.next {
  margin-left: 205px;
}

.prev {
  margin-right: 205px;
}

@keyframes flyup {
  0% {
    transform: translateX(100vh);
  }
}

.czar-bar {
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
</style>
