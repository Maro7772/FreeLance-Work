import axios from "axios";

const instance = axios.create({
  baseURL: "https://free-lance-work-jade.vercel.app"
});

export default instance;
