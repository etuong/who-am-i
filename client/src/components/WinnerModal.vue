<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
      :click-to-close="false"
      :drag="true"
    >
      <span class="modal__title">Congratulations, {{ winner }}!</span>
      <span class="modal__subtitle">You've won this round.</span>
      <div class="modal__content">
        <card :isWhite="false" :text="blackCard" />
        <card :isWhite="true" :text="whiteCard" />
      </div>
      <button
        class="button is-success is-medium next-round-btn"
        @click="handleNextRound"
      >
        <strong>Next Round</strong>
      </button>
    </vue-final-modal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { $vfm, VueFinalModal, ModalsContainer } from "vue-final-modal";
import Card from "./Card.vue";

export default defineComponent({
  name: "WinnerModal",
  components: {
    VueFinalModal,
    ModalsContainer,
    Card,
  },
  props: {},
  data() {
    return {
      showModal: false,
      winner: "",
      blackCard: "",
      whiteCard: "",
    };
  },
  methods: {
    handleNextRound() {
      this.showModal = !this.showModal;
      this.$emit("handleNextRound");
    },
  },
  sockets: {
    winner_announced(data) {
      this.winner = data.name;
      this.blackCard = data.black;
      this.whiteCard = data.white;
      this.showModal = true;
    },
  },
});
</script>

<style lang="scss" scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}

:deep(.modal-content) {
  width: 400px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 2px solid black;
  border-radius: 1rem;
  background: #fff;
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.modal__subtitle {
  font-size: 1.2rem;
  text-align: center;
  margin: 10px 0px;
}

.modal__content {
  display: flex;
}

.dark-mode div:deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}

.next-round-btn {
  width: 150px;
  margin: 15px auto;
}
</style>