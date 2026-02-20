# BleepBloop

BleepBloop is a real-time web chat application built with a Spring Boot backend and a React frontend. It features instant messaging using WebSockets, user authentication, and online status tracking, all backed by a PostgreSQL database.

## Features

### Core Functionality
*   **Real-Time Messaging:** Instant, bi-directional communication between clients and the server using WebSockets protocol (STOMP via SockJS).
*   **Private Chat Support:** Users can send direct, private messages to specific connected users.
*   **User Authentication:** Built-in user registration and login endpoints to secure access to the chat.
*   **Online User Tracking:** Live updates of currently connected users for active presence tracking.
*   **Public Key Management:** Support for storing and communicating public cryptographic keys for users upon login, facilitating client-side encryption workflows.

### Backend (Spring Boot)
*   **Spring WebSockets:** Manages full-duplex communication channels.
*   **Spring Data JPA:** Simplifies data access, persistence, and ORM mapping.
*   **Spring Security:** Handles secure access and authentication.
*   **PostgreSQL:** Robust relational database for reliable storage.

### Frontend (React)
*   **React 19 & Vite:** Modern, fast React framework utilizing Vite for lightning-fast Hot Module Replacement (HMR).
*   **TailwindCSS:** Utility-first CSS framework for rapid, responsive UI development.
*   **React Router Dom:** For declarative client-side routing.
*   **StompJS & SockJS-client:** Robust handling of web socket connections and messaging protocols.

---

## Prerequisites

Before running the project locally, ensure you have the following installed:
*   **Java 17** (or above)
*   **Node.js** (v18 or above recommended)
*   **Docker** (and Docker Compose) to easily spin up the database.
*   **Maven** (Included in the project wrapper, but a local installation provides better system integration).

---

## Setup & Run Instructions

### 1. Database Setup

BleepBloop requires a PostgreSQL database. You can start one instantly using the provided `docker-compose.yml` file.

Open a terminal in the root directory and run:
```bash
docker-compose up -d
```
This runs a PostgreSQL 15 container exposing port 5432 with default database credentials configured in the application.

### 2. Backend Setup (Spring Boot)

The application uses the Maven wrapper, so you don't need a global maven installation. The backend is configured to run on port 8081 to avoid common port conflicts.

From the root project terminal, run the following commands to compile and start the backend:
```bash
# Windows
.\mvnw clean compile
.\mvnw spring-boot:run

# Mac/Linux
./mvnw clean compile
./mvnw spring-boot:run
```
The server will start at `http://localhost:8081`.

### 3. Frontend Setup (React)

The frontend project is located in the `frontend` folder. It uses Vite as the development server.

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the app:
```bash
cd frontend
npm install
npm run dev
```
Vite will start the development server on `http://localhost:5173`. Open this URL in your browser to access the application.

## API & WebSocket Endpoints Highlights
*   **REST Authentication:** `http://localhost:8081/api/auth/login` and `/signup`
*   **Available Users:** `http://localhost:8081/api/auth/users`
*   **WebSocket Connection:** `http://localhost:8081/ws`
*   **Message Broker Destinations:** `/topic/public`, `/topic/users`, `/queue/messages`, and `/app/chat.sendPrivateMessage`
