<template>
  <section class="hero animate__animated animate__fadeIn">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <p class="mb-3">
              This table lists all the name cards that other players need to
              guess! Yours is blurred out for obvious reason. When it's your
              turn, press the red button if you asked a No question to end your
              turn or the green button if you successfully made a correct guess.
            </p>
            <table
              class="table is-striped is-hoverable is-fullwidth is-bordered"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Card</th>
                  <th class="has-text-centered">Turn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ethan</td>
                  <td>Happy</td>
                  <td class="has-text-centered">&#x2714;</td>
                </tr>
                <tr>
                  <td>Ethan</td>
                  <td>Happy</td>
                  <td class="flex">
                    <button
                      class="button is-danger is-small game-ctl-btn"
                      @click="createPrivateRoom"
                    >
                      End Turn
                    </button>
                    <button
                      class="button is-success is-small game-ctl-btn"
                      @click="handleVictory"
                    >
                      I Win!
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="column">
            <div class="container">
              <textarea
                class="notepad textarea"
                placeholder="Use this notepad to take notes!"
                @input="handleTextArea"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "GameView",
  props: {
    msg: String,
  },
  data() {
    return {};
  },
  methods: {
    handleTextArea(event) {
      const bullet = "\u2022";
      const newLength = event.target.value.length;
      const characterCode = event.target.value.substr(-1).charCodeAt(0);

      if (characterCode === 10) {
        event.target.value = `${event.target.value}${bullet} `;
      } else if (newLength === 1) {
        event.target.value = `${bullet} ${event.target.value}`;
      }
    },
    handleVictory() {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#49c78e",
        cancelButtonColor: "#FF3860 ",
        confirmButtonText: "Yes, I guessed right!",
        cancelButtonText: "Just kidding!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal({
            title: "Congratulations!",
            text: "Please spectate the remaining of the game",
            icon: "success",
            confirmButtonColor: "#49c78e",
          });
        }
      });
    },
  },
});
</script>

<style scoped>
.notepad {
  font-size: 18px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  width: 100%;
  height: 500px;
  resize: none;
}

td.flex {
  display: flex;
  justify-content: space-evenly;
}

.game-ctl-btn {
  width: 60px;
}
</style>
