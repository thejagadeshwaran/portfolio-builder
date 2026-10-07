// frontend/src/services/aiService.js

import axios from "axios";

// ========================================
// API CONFIGURATION
// ========================================

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

// ========================================
// PARSE RESUME USING BACKEND AI API
// ========================================

export const parseResume = async (file) => {
  // ========================================
  // VALIDATE FILE
  // ========================================

  if (!file) {
    throw new Error(
      "Please select a resume PDF."
    );
  }

  if (file.type !== "application/pdf") {
    throw new Error(
      "Please upload a PDF file."
    );
  }

  // ========================================
  // OPTIONAL FILE SIZE CHECK
  // 10 MB maximum
  // ========================================

  const MAX_FILE_SIZE =
    10 * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Resume file must be smaller than 10 MB."
    );
  }

  // ========================================
  // CREATE FORM DATA
  // ========================================

  const formData = new FormData();

  formData.append(
    "resume",
    file
  );

  // ========================================
  // SEND TO BACKEND
  // ========================================

  try {
    console.log(
      "========================================"
    );

    console.log(
      "📄 AI RESUME PARSING STARTED"
    );

    console.log(
      "========================================"
    );

    console.log(
      "File name:",
      file.name
    );

    console.log(
      "File type:",
      file.type
    );

    console.log(
      "File size:",
      file.size,
      "bytes"
    );

    console.log(
      "Backend URL:",
      `${API_URL}/ai/parse-resume`
    );

    const response =
      await axios.post(
        `${API_URL}/ai/parse-resume`,
        formData,
        {
          // IMPORTANT:
          // Do NOT manually set
          // Content-Type here.
          //
          // Browser automatically adds:
          // multipart/form-data
          // + boundary
          timeout: 120000,
        }
      );

    // ========================================
    // SUCCESS
    // ========================================

    console.log(
      "========================================"
    );

    console.log(
      "✅ AI RESPONSE RECEIVED"
    );

    console.log(
      "========================================"
    );

    console.log(
      "Response:",
      response.data
    );

    // ========================================
    // VALIDATE RESPONSE
    // ========================================

    if (!response.data) {
      throw new Error(
        "Backend returned an empty response."
      );
    }

    return response;

  } catch (error) {

    // ========================================
    // AXIOS ERROR
    // ========================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ AI RESUME PARSING FAILED"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Error:",
      error
    );

    // ========================================
    // SERVER RESPONSE
    // ========================================

    if (error.response) {

      console.error(
        "HTTP Status:",
        error.response.status
      );

      console.error(
        "Server Response:",
        error.response.data
      );

      const serverMessage =
        error.response.data?.message ||
        error.response.data?.error;

      if (serverMessage) {
        throw new Error(
          serverMessage
        );
      }
    }

    // ========================================
    // NETWORK ERROR
    // ========================================

    if (error.request && !error.response) {

      console.error(
        "❌ Backend server is not responding."
      );

      throw new Error(
        "Cannot connect to backend. Make sure the backend server is running on port 5000."
      );
    }

    // ========================================
    // NORMAL ERROR
    // ========================================

    throw error;
  }
};