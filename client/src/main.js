import 'animate.css';
import jquery from "jquery";
import "jquery-ui-dist/jquery-ui";
import { createApp } from "vue";
import VueSocketIO from "vue-3-socket.io";
import App from "./App.vue";
import "./styles/index.scss";

window.$ = window.jQuery = jquery;

const connection =
  process.env.NODE_ENV === "development" ? "http://localhost:8081" : "https://cards-for-humanity.herokuapp.com/";
const app = createApp(App);
app.use(
  new VueSocketIO({
    debug: false,
    connection,
  })
);
app.mount("#app");
