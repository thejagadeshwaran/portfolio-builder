# 🚀 Portfolio Builder

A full-stack Portfolio Builder web application that enables users to create, edit, manage, and share professional portfolios online.

## 🌐 Live Demo

### Frontend (Vercel)
https://portfolio-builder-navy-eight.vercel.app/

### Backend (Render)
https://portfolio-builder-jxjx.onrender.com

---

## 📌 Features

✅ User Registration & Login (JWT Authentication)  
✅ Secure Protected Routes  
✅ Create & Edit Portfolio  
✅ Public Portfolio Sharing  
✅ Profile Image Upload  
✅ Resume Upload  
✅ Skills, Education & Projects Section  
✅ Portfolio Search by Username  
✅ Portfolio Analytics (View Count)  
✅ Responsive UI Design  

---

## 🛠 Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (File Upload)

### Database
- MongoDB Atlas
- Mongoose

---

## 📂 Project Structure

```text
Portfolio_Builder/
│── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│
│── backend/
│   ├── routes/
│   ├── models/
│   ├── uploads/
│   ├── server.js
```

---

## 🔐 Authentication

Implemented secure authentication using **JWT (JSON Web Token)**:

- Register User
- Login User
- Protected Routes
- Logout Functionality

---

## 📷 File Uploads

Users can upload:

- Profile Image
- Resume PDF

Files are stored in:

```text
backend/uploads/
```

The file URL is stored in **MongoDB Atlas**.

---

## 🌐 REST API Endpoints

### Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
```

### Portfolio APIs

```http
POST   /api/portfolio/save
GET    /api/portfolio/user/:username
GET    /api/portfolio/search/:username
PUT    /api/portfolio/view/:username
PUT    /api/portfolio/update/:id
DELETE /api/portfolio/delete/:id
POST   /api/portfolio/upload-resume
POST   /api/portfolio/upload-profile
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/thejagadeshwaran
```

### Install Frontend

```bash
cd frontend
npm install
npm start
```

### Install Backend

```bash
cd backend
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file inside backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🎯 Future Improvements

- Cloudinary Image Storage
- Multiple Portfolio Themes
- Dark Mode
- Better Analytics Dashboard
- Portfolio PDF Export

---

## 👨‍💻 Author

### Jagadeshwaran J

**GitHub**  
https://github.com/thejagadeshwaran

**LinkedIn**  
https://www.linkedin.com/in/thejagadeshwaran/

**Portfolio Builder Live**  
Frontend: https://portfolio-builder-navy-eight.vercel.app/  
Backend: https://portfolio-builder-jxjx.onrender.com

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!