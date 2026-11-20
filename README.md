# Smart Home Platform

**Full-stack IoT smart home system featuring a Node.js backend, MongoDB data layer, user authentication, and an interactive web dashboard.**

---

## Project Overview

This repository contains a complete smart home application that demonstrates the software side of a connected living environment. Users can authenticate, interact with devices, and monitor actions through a modern web interface backed by a RESTful API and persistent storage.

The project showcases practical full-stack skills applied to an IoT domain: backend architecture, data modeling, authentication, and frontend integration.

---

## Key Features

- User registration and authentication
- Device / action management via backend API
- Persistent storage with MongoDB
- Interactive frontend dashboard (HTML / CSS / JavaScript)
- Login flow and protected routes
- Modular backend structure (models, routes, configuration)

---

## Architecture

```
┌──────────────────┐     REST API      ┌──────────────────┐
│  Frontend        │ ◄───────────────► │  Node.js Backend │
│  (HTML/JS/CSS)   │                   │  (Express)       │
└──────────────────┘                   └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │  MongoDB         │
                                       │  (Users, Actions)│
                                       └──────────────────┘
```

**Main components:**
- `backend/` — Express server, models (User, Action), configuration
- Frontend pages (`index.html`, login, CSS, JS)
- Environment-based configuration

---

## Technologies

| Layer       | Stack                          |
|-------------|--------------------------------|
| Backend     | Node.js, Express, MongoDB      |
| Frontend    | HTML5, CSS3, JavaScript        |
| Database    | MongoDB                        |
| Auth        | Custom user model + sessions / tokens (as implemented) |
| Tools       | Git, npm                       |

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- MongoDB instance (local or Atlas)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Sfaxihoussem2/Smarthome-project.git
cd Smarthome-project/backend

# Install dependencies
npm install

# Configure environment variables (see .env.js or create .env)
# Then start the server
npm start
# or
nodemon
```

Open the frontend pages in a browser (or serve them statically) and point API calls to your backend URL.

> **Note:** `node_modules` is currently committed in this repository. For production or clean development, it is recommended to add it to `.gitignore` and reinstall dependencies locally.

---

## Project Structure (simplified)

```
Smarthome-project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Action.js
│   ├── .env.js
│   └── ...
├── css/
├── js/
├── login/
├── index.html
└── README.md
```

---

## Future Improvements

- Add real device communication layer (MQTT / WebSocket bridge to ESP32 nodes)
- Role-based access control and better security practices
- Real-time dashboard updates
- Docker Compose setup for easy local deployment
- Remove committed `node_modules` and add proper `.gitignore`
- Unit and integration tests

---

## Author

**Houssem Eddine Sfaxi**  
Embedded Systems & IoT Engineer  
[GitHub](https://github.com/Sfaxihoussem2) · [Portfolio](https://sfaxihoussem2.github.io/My-portfolio/) · [LinkedIn](https://www.linkedin.com/in/houssem-sfaxi-3272a9280)

---

## License

Portfolio and educational project. Feel free to explore and adapt with attribution.
