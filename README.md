# 🦷 Dream Dentist App

A modern, full-stack dental practice management web application. Built with React (Vite) for the frontend and Node.js/Express/MongoDB for the backend. Features include appointment scheduling, patient management, treatment tracking, and financials—all in a clean, responsive UI.

---

## 📦 Monorepo Structure

```
MyDreamDentistApp/
├── client-vite/   # React frontend (Vite, Tailwind CSS)
├── server/        # Node.js/Express backend (MongoDB)
├── tools/         # Utility scripts
├── docker-compose.yml
├── README.md      # (this file)
└── ...
```

---

## ✨ Features
- User authentication (JWT, roles)
- Appointment calendar & management
- Patient records & registration
- Treatment & billing modules
- Responsive, modern UI (Tailwind CSS)
- Dockerized for easy deployment

---

## 🚀 Quick Start

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/mydreamdentistapp.git
cd mydreamdentistapp
```

### 2. Start the backend (server)
```sh
cd server
npm install
cp .env.example .env # Edit .env as needed
npm run dev
```

### 3. Start the frontend (client)
```sh
cd ../client-vite
npm install
cp .env.example .env # Edit API URL if needed
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend:  [http://localhost:5000](http://localhost:5000)

---

## 🐳 Docker Compose (optional)
To run both client and server with Docker:
```sh
docker-compose up --build
```

---

## 📚 Documentation
- [client-vite/README.md](client-vite/README.md) — Frontend details
- [server/README.md](server/README.md) — Backend details

---

## 📝 License
MIT
