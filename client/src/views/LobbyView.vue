<template>
  <section class="hero animate__animated animate__fadeIn">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title is-1">Hello, {{ currentPlayer?.name }}!</h1>
            <p class="is-5 mt-5">
              Please type in a name for another player to guess
            </p>

            <form @submit.prevent="sendGuessingName">
              <input
                class="guessing-name-input"
                v-model="guessing_name"
                type="text"
                autocomplete="off"
                placeholder="Enter a character for someone else to guess"
                maxlength="40"
                minlength="1"
                required
              />
              <br />
              <input
                type="submit"
                class="button is-success mt-1 is-light guess-btn"
                :disabled="currentPlayer?.ready"
              />
            </form>

            <h2 class="waiting-title is-5 mt-5">
              Let's wait for other players
            </h2>
            <h2 class="is-5">
              We need at least 2 players to start. As soon as all players are
              ready, anyone can press the Start button to start playing! Note
              that new players cannot join when the game is in session.
            </h2>
            <button
              class="button is-success is-light"
              @click="setGameReady"
              :class="{ pulse: playersData?.isGameReady }"
              :disabled="!playersData?.isGameReady"
            >
              <strong>Start!</strong>
            </button>

            <h2 class="invite-title">Invite your friends!</h2>
            <div class="invite-bar">
              <div class="invite-input">
                <input
                  class="invite-field"
                  type="text"
                  readonly=""
                  :value="hyperlink"
                />
                <div class="invite-overlay">
                  Hover over me to see the invite link!
                </div>
              </div>
              <button
                class="button is-danger invite-copy-button is-light"
                @click="copyToClipBoard"
              >
                Copy
              </button>
            </div>
          </div>

          <div class="column">
            <div class="container">
              <div
                v-if="playersData && playersData.players"
                class="
                  list
                  has-hoverable-list-items has-visible-pointer-controls
                "
              >
                <div
                  v-for="(player, index) in playersData.players"
                  :key="index"
                  class="list-item"
                >
                  <div
                    class="list-item-title"
                    :data-letters="`${player.name.charAt(0).toUpperCase()}`"
                  ></div>
                  <div class="list-item-content">
                    <div class="list-item-title">{{ player.name }}</div>
                    <div
                      class="list-item-description"
                      :class="{ flash: !player.ready }"
                    >
                      {{ player.ready ? "Ready" : "Not ready" }}
                    </div>
                  </div>
                </div>
              </div>
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
  name: "LobbyView",
  components: {},
  props: {
    currentPlayer: Object,
  },
  data() {
    return {
      playersData: undefined,
      guessing_name: "",
    };
  },
  methods: {
    copyToClipBoard() {
      const hyperlink = window.location.origin + this.currentPlayer?.roomId;
      navigator.clipboard.writeText(hyperlink);
    },
    sendGuessingName() {
      this.$socket.emit("player_wrote_guess", {
        guessing_name: this.guessing_name,
        player: this.currentPlayer,
      });
    },
    setGameReady() {
      this.$socket.emit("game_ready", this.currentPlayer.roomId);
    },
  },
  sockets: {
    update_preparation(data) {
      this.playersData = data;
    },
  },
  computed: {
    hyperlink() {
      return window.location.origin + this.currentPlayer?.roomId;
    },
  },
});
</script>

<style lang="scss" scoped>
.section {
  padding: 0 1.5rem;
}

.column {
  border-left: 1px solid #dbdbdb;
}

.guessing-name-input {
  width: 280px;
  height: 32px;
}

.guess-btn {
  font-weight: 700;
}

[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 1em;
  width: 2.5em;
  height: 2.5em;
  line-height: 2.5em;
  text-align: center;
  border-radius: 50%;
  border: 1px solid black;
  background: transparent;
  vertical-align: middle;
  margin-right: 1em;
  color: black;
}

.flash {
  color: red;
  animation: blinker 2s linear infinite;
}

.waiting-title {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: larger;
}

.invite-title {
  text-align: center;
  font-size: 35px;
  margin-top: 30px;
}

.invite-bar {
  display: flex;
  width: 100%;
  margin: auto;

  .invite-input {
    position: relative;
    display: flex;
    width: 100%;

    &:hover .invite-overlay {
      opacity: 0;
    }

    .invite-field,
    .invite-overlay {
      font-size: 18px;
      background-color: #fff;
    }

    .invite-overlay {
      position: absolute;
      pointer-events: none;
      opacity: 1;
      left: 2px;
      right: 2px;
      top: 2px;
      bottom: 2px;
      text-align: center;
      line-height: 28px;
      color: #d70040;
    }

    .invite-field {
      flex: 1 1 auto;
      height: 32px;
      border: 1px solid #d3d3d3;
      border-radius: 2px 0 0 2px;
      line-height: 32px;
      text-align: center;
    }
  }

  .invite-copy-button {
    flex: 0 0 auto;
    height: 32px;
    border-left: 0;
    border-radius: 0 2px 2px 0;

    &:hover {
      background: #d2042d;
    }
  }
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.pulse {
  animation: pulse-animation 1s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 222, 89, 0.636);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(23, 154, 29, 0.2);
  }
}

@media only screen and (max-width: 450px) {
  .invite-title {
    font-size: 26px;
  }

  .invite-bar {
    width: 100%;
    .invite-input {
      .invite-field,
      .invite-overlay {
        font-size: 14px;
      }
    }
  }
}
</style>
