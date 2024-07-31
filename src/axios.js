import axios from "axios";
// urls
const instance = axios.create({
  //baseURL: "https://dynamicapi.thecbt.live/api/v1/",
  //baseURL: "https://dc-api.thecbt.live/api/v1/", //our live link
  //baseURL: "http://192.168.100.33:4000/api/v1/",
  baseURL: "https://dynamicbackend.thecbt.live/api/v1/", // client
});
export default instance;
