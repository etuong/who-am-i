<template>
  <div
    :class="isWhite ? 'white-card' : 'black-card'"
    @mouseenter="handleHover"
    @mouseleave="handleHover"
    :style="[
      hoverable
        ? {
            position: 'relative',
            'margin-bottom': [offset === 0 ? '-160px' : -(170 - offset) + 'px'],
          }
        : { 'margin-bottom': '0' },
    ]"
  >
    <p>{{ text }}</p>
    <div className="card-logo">
      <img src="../assets/logo.png" alt="card logo" />
      <span>Cards For Humanity</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Card",
  props: {
    hoverable: Boolean,
    isWhite: Boolean,
    text: String,
  },
  data() {
    return { offset: 0 };
  },
  methods: {
    handleHover(event) {
      let eventName = event.type;

      if (eventName === "mouseenter") {
        let text = event.target.querySelector(`p`);
        let offset = text.offsetHeight;
        this.offset = offset + 10;
      } else if (eventName === "mouseleave") {
        this.offset = 0;
      }
    },
  },
});
</script>

<style scoped>
.white-card,
.black-card {
  position: relative;
  cursor: grab;
  font-weight: 700;
  padding: 13px;
  height: 225px;
  width: 163px;
  border-radius: 12px;
  border: 1px solid black;
  box-sizing: border-box;
  user-select: none;
  margin: 0px auto;
}

.white-card {
  background-color: white;
}

.black-card {
  background-color: black;
  color: white;
  text-align: left;
  box-sizing: border-box;
}

.card-logo {
  position: absolute;
  display: flex;
  align-items: center;
  font-size: 6px;
  bottom: 10px;
  left: 15px;
}

.card-logo img {
  height: 14px;
  margin-right: 3px;
}
</style>
