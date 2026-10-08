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

# ✨ Features

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
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │
                               │ REST API
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
                               │
                               ▼
                         Gmail SMTP
```

---

# 📂 Project Structure

```text
portfolio-builder/
│
├── frontend/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🤖 AI Resume Parsing

The application provides AI-powered resume parsing.

### Workflow

```text
Upload Resume
      │
      ▼
PDF/Text Extraction
      │
      ▼
Gemini AI
      │
      ▼
Extract Resume Information
      │
      ▼
Populate Portfolio Form
      │
      ▼
User Reviews & Saves
```

The AI can help extract information such as:

- Full Name
- Email
- Phone
- About
- Skills
- GitHub
- LinkedIn
- Education
- Projects
- Experience

---

# ☁️ Cloudinary Integration

Cloudinary is used for cloud-based file and image storage.

### Used for

- Profile images
- Portfolio images
- Resume files
- Other uploaded assets

Instead of storing large files directly on the backend server, files can be uploaded to Cloudinary and their URLs stored in MongoDB.

---

# 📊 Portfolio Analytics

The dashboard provides portfolio statistics.

| Analytics | Description |
|---|---|
| Total Portfolios | Number of portfolios created |
| Total Views | Number of portfolio views |
| Resume Downloads | Number of resume downloads |
| Messages Received | Number of contact messages |
| GitHub Clicks | Number of GitHub link clicks |

---

# 🔍 Portfolio Search

Users can search for publicly available portfolios.

### Search Workflow

```text
Search Portfolio
       │
       ▼
Find Matching Portfolio
       │
       ▼
Display Portfolio
       │
       ▼
Open Live Portfolio
```

This makes it possible to discover and view public portfolios directly through the application.

---

# 🌍 Public Portfolio

Users can share their portfolio publicly.

### Example

```text
https://your-domain.com/portfolio/username
```

A public portfolio can contain:

- Profile
- About
- Skills
- Education
- Projects
- Experience
- Resume
- GitHub
- LinkedIn
- Contact Section

---

# 🔐 Authentication

The application uses JWT-based authentication.

### Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Backend Authentication
 │
 ▼
JWT Token
 │
 ▼
Store Token
 │
 ▼
Authenticated API Requests
```

Passwords are protected using bcrypt hashing.

---

# 📧 Contact Me

Visitors can contact a portfolio owner through the Contact section.

### Workflow

```text
Visitor
   │
   ▼
Contact Form
   │
   ├── Name
   ├── Email
   └── Message
   │
   ▼
Backend API
   │
   ▼
Nodemailer
   │
   ▼
Portfolio Owner Email
```

The visitor's email is also used as the reply-to address.

---

# 🔌 API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Portfolio

```text
GET    /api/portfolio
GET    /api/portfolio/:id
POST   /api/portfolio
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id
```

## Contact

```text
POST /api/portfolio/contact/:id
```

## AI

```text
POST /api/ai/parse-resume
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/thejagadeshwaran/portfolio-builder.git
```

## 2. Go to Project

```bash
cd portfolio-builder
```

---

# 💻 Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
CONTACT_FROM=your_email@gmail.com
```

Start backend:

```bash
npm start
```

or:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Never upload your `.env` file to GitHub.

Add this to `.gitignore`:

```gitignore
.env
.env.local
node_modules/
uploads/
dist/
```

Never expose:

- MongoDB credentials
- JWT secret
- Cloudinary API secret
- Gemini API key
- SMTP password
- Google App Password

---

# 📦 Required Services

### MongoDB Atlas

Used as the main database.

### Cloudinary

Used for image and file storage.

### Google Gemini API

Used for AI-powered resume parsing.

### Gmail SMTP

Used for contact message email delivery.

### Vercel

Used for frontend deployment.

### Render

Used for backend deployment.

---

# 🚀 Deployment

## Frontend

The React frontend is deployed using:

```text
Vercel
```

### Live Frontend

```text
https://portfolio-builder-mu-hazel.vercel.app/
```

## Backend

The Node.js + Express backend is deployed using:

```text
Render
```

### Live Backend

```text
https://portfolio-builder-online.onrender.com/
```

---

# 🌐 Production Architecture

```text
                     INTERNET
                         │
                         ▼
             ┌─────────────────────┐
             │       Vercel        │
             │   React Frontend    │
             └──────────┬──────────┘
                        │
                        │ REST API
                        ▼
             ┌─────────────────────┐
             │       Render        │
             │   Node + Express    │
             └──────────┬──────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
     ┌─────────┐   ┌──────────┐   ┌──────────┐
     │ MongoDB │   │Cloudinary│   │ Gemini AI│
     │  Atlas  │   │          │   │          │
     └─────────┘   └──────────┘   └──────────┘
                        │
                        ▼
                  Gmail SMTP
```

---

# 🛡️ Security

The application includes:

- JWT Authentication
- Password Hashing
- Protected API Routes
- Environment Variables
- CORS Configuration
- Input Validation
- Secure Cloudinary Credentials
- Secure SMTP Credentials

---

# 🧪 Testing

Before deployment, test:

```text
✓ Register
✓ Login
✓ Logout
✓ Create Portfolio
✓ Edit Portfolio
✓ Delete Portfolio
✓ Upload Profile Image
✓ Upload Resume
✓ AI Resume Parsing
✓ Public Portfolio
✓ Portfolio Search
✓ Portfolio Views
✓ Resume Download
✓ GitHub Click Tracking
✓ Contact Message
✓ Email Delivery
```

---

# 🐛 Common Issues

## CORS Error

Make sure the production frontend URL is allowed by the backend CORS configuration.

```text
https://portfolio-builder-mu-hazel.vercel.app
```

## Contact Email Not Working

Check the Render environment variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
CONTACT_FROM=your_email@gmail.com
```

For Gmail, use a **Google App Password**, not your normal Gmail password.

## MongoDB Connection Error

Check:

```env
MONGO_URI=your_mongodb_connection_string
```

Also make sure your MongoDB Atlas network access allows the deployed backend to connect.

## Cloudinary Error

Check:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Make sure all three values are correct.

## AI Resume Parsing Error

Check:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Also make sure the configured Gemini model is available for your API account and that the backend is using the correct Google GenAI configuration.

---

# 📈 Future Improvements

Possible future features:

- 🎨 Multiple Portfolio Templates
- 🌙 Dark / Light Mode
- 📄 More Resume Templates
- 📊 Advanced Analytics Dashboard
- ⭐ Portfolio Rating System
- 💬 Real-Time Messaging
- 🔔 Notifications
- 👥 Portfolio Collaboration
- 🧑‍💼 Recruiter Dashboard
- 🔎 Advanced Portfolio Search
- 📱 Mobile App
- 🤖 AI Portfolio Suggestions
- 📝 AI Resume Improvement
- 🌐 Custom Portfolio Domains

---

# 🎯 Project Goals

The main goals of this project are:

1. Make portfolio creation simple.
2. Reduce the time required to build a professional portfolio.
3. Use AI to automatically extract resume information.
4. Provide public portfolio sharing.
5. Provide useful portfolio analytics.
6. Allow recruiters and visitors to discover portfolios.
7. Provide a complete full-stack development experience.

---

# 💡 What I Learned

Through this project, I worked with:

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- JWT Authentication
- bcrypt
- Cloudinary
- Nodemailer
- Google Gemini API
- File Uploads
- PDF Processing
- API Integration
- CORS
- Environment Variables
- Vercel Deployment
- Render Deployment
- MongoDB Atlas
- Git & GitHub

---

# 📊 Project Highlights

| Category | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT + bcrypt |
| AI | Google Gemini API |
| File Storage | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git + GitHub |

---

# 👨‍💻 Author

## Jagadeshwaran J

**Full-Stack Developer**

### GitHub

https://github.com/thejagadeshwaran

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is created for learning, development, and portfolio purposes.

---

# 🚀 Portfolio Builder

**Build your portfolio. Showcase your skills. Get discovered.**

### Create → Customize → Use AI → Share → Analyze

---

## ⭐ Thank You

Thank you for checking out **Portfolio Builder**!

If you have any suggestions or improvements, feel free to contribute to the project.

**Keep building. Keep learning. Keep improving. 🚀**
