# Dream Dentist Server

This is the **backend API** for the Dream Dentist application, built with Node.js, Express, and MongoDB. It provides RESTful endpoints for authentication, appointments, patients, treatments, and financial management.

---

## 🚀 Features
- User authentication (JWT, bcrypt)
- Role-based access control (patient, dentist, receptionist, admin)
- Appointment scheduling and management
- Patient records and treatment tracking
- Financial transactions and reporting
- Input validation and error handling
- Modular controllers, routes, and middleware

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- Bcrypt.js
- JSON Web Tokens (JWT)

---

## ⚡ Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/mydreamdentistapp.git
cd mydreamdentistapp/server
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret:
```sh
cp .env.example .env
```

**Example .env:**
```
MONGO_URI=mongodb://localhost:27017/dreamdentist
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Run the server
```sh
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure
```
server/
├── controllers/      # API logic
├── middleware/       # Auth & error middleware
├── models/           # Mongoose schemas
├── routes/           # Express routes
├── services/         # Business logic
├── utils/            # Utilities
├── validators/       # Input validation
├── app.js            # Express app setup
├── server.js         # Entry point
└── ...
```

---

## 🧪 Scripts
- `npm run dev` — Start server with nodemon (development)
- `npm start` — Start server (production)
- `npm test` — Run tests (if available)

---

## 🔑 API Overview
- `POST   /api/auth/register` — Register a new user
- `POST   /api/auth/login` — Login and receive JWT
- `GET    /api/auth/profile` — Get current user profile
- `GET    /api/appointments` — List appointments
- `POST   /api/appointments` — Create appointment
- ...and more (see routes/)

---

## 📝 License
MIT 