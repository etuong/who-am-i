<template>
  <Transition>
    <div class="slideIn" v-if="open">
      <h1>Player: {{ playerName }}</h1>
      <div class="list">
        <ul>
          <div
            class="pair-item"
            v-for="({ black, white }, index) in pairs"
            :key="index"
          >
            <li><b>B: </b>{{ black }}</li>
            <li><b>W: </b>{{ white }}</li>
          </div>
        </ul>
      </div>
      <button class="close-btn" @click="open = false">X</button>
    </div>
  </Transition>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "VictoryBoardModal",
  props: {
    selectedPlayer: Object,
  },
  data() {
    return {
      open: false,
      playerName: "",
      pairs: [],
    };
  },
  methods: {},
  watch: {
    selectedPlayer(newSelectedPlayer) {
      this.pairs = newSelectedPlayer.winningCards;
      this.playerName = newSelectedPlayer.name;
      this.open = true;
    },
  },
});
</script>

<style scoped>
.slideIn {
  max-width: 600px;
  padding: 3em;
  position: absolute;
  overflow: auto;
  z-index: 100;
  top: 0;
  left: 0;
  background: #eee;
  height: 100%;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
}
.v-enter-active,
.v-leave-active {
  transition: left 1s ease;
}

.v-enter-from,
.v-leave-to {
  left: -100%;
}

.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5em;
}

button {
  padding: 0.5em 1em;
  border-radius: 3em;
  font-size: 1.1em;
}

.list {
  color: #2c4878;
}

.pair-item {
  padding: 0.75em;
  border-bottom: 1px solid #dbdbdb;
}

h1 {
  font-size: 2em;
}
</style>
