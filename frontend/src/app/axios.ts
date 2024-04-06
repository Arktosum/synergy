import axios from "axios";
import { ORIGIN } from "./utils";

export default axios.create({
    baseURL : ORIGIN
})