// frontend/src/services/contactService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://portfolio-builder-online.onrender.com/api";

export const contactService = {
  sendMessage: (messageData) => 
    axios.post(`${API_URL}/contact/send`, messageData)
};