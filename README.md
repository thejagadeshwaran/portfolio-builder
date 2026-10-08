# 🚀 Portfolio Builder

A modern **Full-Stack Portfolio Builder** that allows users to create, customize, manage, and share professional portfolios online.

The application includes **JWT authentication, AI-powered resume parsing, Cloudinary image/file uploads, portfolio analytics, public portfolio sharing, search, and contact messaging**.

---

## 🌐 Live Demo

### Frontend
https://portfolio-builder-mu-hazel.vercel.app/

### Backend API
https://portfolio-builder-online.onrender.com/

---

## ✨ Features

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 👤 User Profile Management
- 📝 Create & Edit Portfolios
- 🎨 Portfolio Customization
- 📱 Responsive Portfolio Design
- 📄 Resume Upload
- 🤖 AI Resume Parsing
- ☁️ Cloudinary File/Image Upload
- 🔍 Portfolio Search
- 🌍 Public Portfolio Sharing
- 📊 Portfolio Analytics
- 👀 Portfolio View Tracking
- 📥 Resume Download Tracking
- 📨 Contact Message System
- 📧 Email Notifications
- 🔗 GitHub Click Tracking
- 💾 MongoDB Database
- 🔒 Password Hashing with bcrypt
- 🚀 Vercel Frontend Deployment
- 🚀 Render Backend Deployment

---

# 🛠️ Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Multer

## AI & Cloud

- Google Gemini API
- Cloudinary

## Deployment

- Vercel
- Render
- MongoDB Atlas

---

# 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │       Render         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │  MongoDB   │   │ Cloudinary │   │ Gemini API │
       │   Atlas    │   │   Storage  │   │     AI     │
       └────────────┘   └────────────┘   └────────────┘
