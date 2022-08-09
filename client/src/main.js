import "animate.css";
import { createApp } from "vue";
import VueSocketIO from "vue-3-socket.io";
import App from "./App.vue";
import "./styles/index.scss";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const connection =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "https://who-am-i-webgame.herokuapp.com/";
const app = createApp(App);
app.use(
  new VueSocketIO({
    debug: false,
    connection,
  })
);
app.use(VueSweetalert2);
app.mount("#app");
