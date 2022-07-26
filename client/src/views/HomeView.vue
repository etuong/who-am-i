<template>
  <section class="section">
    <div class="container">
      <div class="mb-6 pb-3 is-multiline">
        <div class="column is-12 is-9-desktop mx-auto has-text-centered">
          <h2 class="mb-4 is-size-1 is-size-3-mobile has-text-weight-bold">
            Who Am I?
          </h2>
          <p class="subtitle has-text-grey">
            A guessing game where players use yes or no questions to guess the
            identity of a famous person or character!
          </p>
          <p class="has-text-grey mb-5">
            Questions are based upon the characteristics of a person or animal
            everyone will be able to identify. This game works well with any
            size group, however the larger the group, the more fun the game
            becomes.
          </p>
          <p class="has-text-grey mb-5 author-plead">
            This web app was designed and built by
            <a
              href="https://www.ethanuong.com"
              target="_blank"
              rel="noreferrer"
            >
              Ethan Uong</a
            >. If you are a developer and would like to contribute to this
            project, please visit the
            <a
              href="https://github.com/etuong/chat-with-me"
              target="_blank"
              rel="noreferrer"
            >
              Github repository</a
            >. Thank you!
          </p>
        </div>
        <div class="form-login is-centered">
          <input
            class="form-control"
            v-model="name"
            type="text"
            placeholder="Enter your name"
            maxlength="32"
            required
          />

          <button class="button is-danger" @click="createPrivateRoom">
            Create Private Room
          </button>
        </div>
      </div>
      <div class="columns is-multiline">
        <div class="column is-12 is-4-desktop">
          <icon-text title="Setup">
            <p>
              To start the game, someone needs to create a room. A special link
              will be created to share with friends. In the lobby waiting room,
              each player needs to write down a name for another player to
              guess. The game begins when every player is ready.
            </p>
          </icon-text>
          <icon-text title="House Rules and Tips">
            <ul>
              <li>Do not cheat!</li>
              <li>
                Start by asking broad questions and gradually be more specific
              </li>
              <li>Be nice, be respectful, and have fun!</li>
            </ul>
          </icon-text>
        </div>
        <div class="column is-12 is-4-desktop">
          <img
            class="mx-auto mt-0-widescreen is-block image"
            alt="Heart Card"
            src="../assets/question.png"
          />
        </div>
        <div class="column is-12 is-4-desktop">
          <icon-text title="Game Play">
            <ol>
              <li>
                Each player tries to guess their character by only asking Yes or
                No questions to gain clues
              </li>
              <li>
                You continue asking questions if you ask with Yes as the answer
              </li>
              <li>Your turn ends if your question yields a No answer</li>
              <li>
                If it's not your turn to guess, you still participate by
                answering
              </li>
              <li>The player that first guesses their character wins</li>
              <li>
                It is recommended to use a teleconference software like Zoom to
                chat.
              </li>
            </ol>
          </icon-text>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import IconText from "../components/IconText.vue";

export default defineComponent({
  name: "HomeView",
  components: { IconText },
  data() {
    return { name: "" };
  },
  methods: {
    createPrivateRoom() {
      if (this.name.length < 1) {
        this.$emit("showToast", "Name cannot be empty!", "is-danger");
        return;
      }

      this.$socket.emit("create_new_room", {
        name: this.name,
      });
    },
  },
  sockets: {},
});
</script>

<style lang="scss" scoped>
.author-plead {
  font-size: 14px;
}

.form-login {
  width: 300px;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  gap: 10px;

  .form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;

    &:focus {
      border-color: #66afe9;
      outline: 0;
      box-shadow: inset 0 0 2px #66afe9;
    }
  }

  button {
    width: 100%;
  }
}

ul {
  list-style: disc;
}

ol,
ul {
  padding-left: 20px;
}

.is-medium {
  width: 160px;
}

.section {
  padding: 0em;
}

.columns {
  margin: 5px;
}
</style>
