<template>
  <victory-board-modal :selectedPlayer="selectedPlayer" />
  <table class="table is-striped is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Pick Card?</th>
        <th>View Winning Cards</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(player, index) in playersStatus" :key="index">
        <td>{{ player.name }}</td>
        <td>{{ player.winningCards.length }}</td>
        <td v-if="czarName === player.name">
          <h3>Czar</h3>
        </td>
        <td v-else>
          <input
            type="checkbox"
            :checked="player.cardSelected"
            class="switch is-rounded is-outlined is-success"
          />
          <label class="switch-label"></label>
        </td>
        <td>
          <button
            class="victory-button jb-modal"
            data-target="sample-modal"
            type="button"
            :disabled="player.winningCards.length < 1"
            @click="handleVictoryBoardClick(player)"
          >
            <span class="icon">&#128065;</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { defineComponent } from "vue";
import VictoryBoardModal from "@/components/VictoryBoardModal.vue";

export default defineComponent({
  name: "Status",
  components: {
    VictoryBoardModal,
  },
  props: { czarName: String },
  data() {
    return {
      playersStatus: undefined,
      openPlayerVictoryBoard: false,
      selectedPlayer: undefined,
    };
  },
  methods: {
    handleVictoryBoardClick(selectedPlayer) {
      this.selectedPlayer = { ...selectedPlayer };
    },
  },
  sockets: {
    update_game_status(data) {
      this.playersStatus = data;
    },
  },
});
</script>

<style lang="scss" scoped>
.table {
  font-size: 14px;
  border-bottom: 1px solid black;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  td {
    padding: 0.3em 0.75em;
  }
}

.switch[type="checkbox"] + label {
  cursor: default;
}

.switch-label {
  display: inline !important;
}

.victory-button {
  font-size: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
}
</style>
