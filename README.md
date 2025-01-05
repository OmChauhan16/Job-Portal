# Job Portal (MERN Stack)

A feature-rich Job Portal application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
The application enables employers to post job listings and job seekers to find and apply for their desired roles seamlessly.

## Features

### For Job Seekers:
- User registration and login.
- Browse job listings by category, location, and skills.
- Apply to jobs with a personalized profile and resume.

### For Employers:
- Employer registration and login.
- Post job openings with detailed descriptions.
- Manage job postings (edit, delete, or close jobs).
- View applications for each job listing.

### General Features:
- Responsive and user-friendly UI.
- Authentication and authorization (JWT-based).
- Secure storage of user data.
- RESTful API for seamless client-server communication.
- Database management using MongoDB.

## Tech Stack

### Frontend:
- React.js with functional components and hooks.
- Redux for state management.
- Tailwind CSS for styling.

### Backend:
- Node.js with Express.js for server-side logic.
- MongoDB for database management.
- JWT for authentication.
- Multer for file uploads (resumes, profile pictures).

## Installation

### Prerequisites:
- Node.js installed on your machine.
- MongoDB set up locally or using a cloud provider (e.g., MongoDB Atlas).

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/job-portal.git
   cd job-portal
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` folder.
   - Add the following variables:
     ```env
     PORT=8000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

4. Start the application:
   - Start the backend server:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm run dev
     ```

5. Open the application in your browser at `http://localhost:8000`.

## Folder Structure

```
job-portal/
├── frontend/        # React application
├── backend/         # Express server
├── README.md        # Documentation
└── .gitignore       # Git ignore file
```


Happy Coding!
