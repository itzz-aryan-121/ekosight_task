# Task Board - Project README

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (run locally or use a cloud instance like MongoDB Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Set up environment variables**

   - Create `.env` files in both `backend/` and `frontend/` folders as needed.
   - For example, in `backend/.env`:
     ```
     MONGODB_URI=mongodb://localhost:27017/taskboard
     JWT_SECRET=your_secret_key
     ```

3. **Install dependencies**

   - **Backend**
     ```bash
     cd backend
     npm install
     ```

   - **Frontend**
     ```bash
     cd ../frontend
     npm install
     ```

4. **Run the backend server**
   ```bash
   cd backend
   npm run dev
   # or: npm start
   ```

5. **Run the frontend app**
   ```bash
   cd ../frontend
   npm run dev
   # or: npm start
   ```

6. **Access the application**

   - By default, open your browser at: `http://localhost:3000`

### Deployment (Vercel)

- The project is set up for deployment on Vercel (see `vercel.json`).
- To deploy, connect your Git repository to Vercel and set environment variables in the Vercel dashboard.

---

## Architecture Explanation

### Overview

This project is a full-stack Task Board (kanban) application with a **React** frontend and a **Node.js (Express)** backend. Data persistence is managed through **MongoDB**.

- **Frontend (`frontend/`)**  
  Built with React, using modern hooks (`useState`, `useEffect`, etc.), React Router for navigation, and custom components for forms and UX/UI. Authentication state and user context are managed with React Context API. UI feedback uses a custom toast system styled for a modern appearance.

- **Backend (`backend/`)**
  Node/Express REST API serving authentication and task board data. User authentication is handled via JWT tokens, and secured endpoints check for valid users. CORS is enabled for frontend-backend communication.

- **Database**
  MongoDB collections for Users, Boards, and Cards (Tasks). Relationships are referenced by ObjectId, e.g. each board maintains a list of card IDs and users.

### Data Flow

1. **User Authentication:**  
   User registration and login are handled by the backend via JWT. Tokens are stored as HTTP-only cookies to maintain session and security.

2. **Board Management:**  
   Authenticated users can create boards, invite others, and manage their own set of boards. Each board contains an ordered list of cards (tasks).

3. **Card Operations:**  
   Creating, updating, moving, and deleting cards on a board is performed with RESTful API endpoints, updating MongoDB accordingly.

---

## Database Schema Explanation

### User

```js
{
  _id: ObjectId,
  name: String,
  email: String,       // unique
  password: String,    // hashed
  boards: [ObjectId],  // references Board._id
  createdAt: Date,
  updatedAt: Date
}
```

- Each user has a unique email and a hashed password.
- `boards` contains ObjectIds referencing the boards the user is a member of.

### Board

```js
{
  _id: ObjectId,
  name: String,
  members: [ObjectId],      // references User._id
  cards: [ObjectId],        // ordered, references Card._id
  createdBy: ObjectId,      // User._id
  createdAt: Date,
  updatedAt: Date
}
```

- `members` are users invited to collaborate.
- `cards` holds all cards associated with this board (ordering matters for kanban).
- `createdBy` references the user who made the board.

### Card

```js
{
  _id: ObjectId,
  boardId: ObjectId,      // references Board._id
  title: String,
  description: String,
  status: String,         // e.g., "todo", "in-progress", "done"
  assignee: ObjectId,     // references User._id
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

- Each card (task) belongs to a board.
- Contains details like title, description, status, and optionally an assignee and due date.

---

**In summary:**  
- **Users** can create and join **Boards**.
- Each **Board** can have multiple **Cards** (tasks).
- Permissions and access are managed by the backend, ensuring only authorized users interact with boards/tasks.

For further details, see the source files in `frontend/` and `backend/`. Contributions and bug reports are welcome!

