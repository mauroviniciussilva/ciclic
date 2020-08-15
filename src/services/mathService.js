import axios from "axios";

export default {
  calcExpression(expression) {
    return axios.post("http://api.mathjs.org/v4/", { expr: expression });
  }
};
