# AI Career Coach

AI Career Coach is a full-stack resume and job-description analyzer. Users can upload a PDF resume, paste a target job description from any career field, and receive a Gemini-powered analysis with a match score, detected role, skill gaps, keyword gaps, resume improvement suggestions, and interview questions.

## Features

- User registration and login with JWT
- Protected dashboard routes
- PDF resume upload and text extraction
- Gemini AI analysis for different career fields, not only software engineering
- Rule-based fallback analyzer when Gemini is not configured or temporarily unavailable
- Resume/job match score
- Detected job title, career field, and seniority level
- Matched skills, missing skills, and missing keywords
- Practical resume improvement suggestions
- Role-specific interview questions
- Saved analysis history in MongoDB
- Delete saved analyses
- Daily analysis limit to reduce API abuse
- Safer input length limits for deployed usage
- Modern animated responsive frontend UI
- Downloadable PDF analysis reports

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- multer
- pdf-parse
- Gemini API through backend REST calls

## Project Structure

```txt
ai-career-coach/
  client/
    src/
      components/
      pages/
      services/
      App.jsx
      App.css
      main.jsx
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    index.js
  README.md
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

MAX_ANALYSES_PER_DAY=10
MAX_RESUME_TEXT_CHARS=18000
MAX_JOB_DESCRIPTION_CHARS=12000
MAX_EXTRACTED_TEXT_CHARS=27000
```

Create a `.env` file inside the `client` folder only when you deploy or use a different backend URL:

```env
VITE_API_URL=http://localhost:5000/api
```

For deployment, set `VITE_API_URL` to your deployed backend API URL.

## Installation

Install backend dependencies:

```bash
cd server
npm install
```

Start the backend:

```bash
npm run dev
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

Start the frontend:

```bash
npm run dev
```

## API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

### Resume

```txt
POST /api/resume/upload
```

### Analysis

```txt
POST /api/analysis/analyze
GET /api/analysis/history
DELETE /api/analysis/:id
```

## Security Notes

- Do not commit `.env` files.
- Keep `GEMINI_API_KEY`, `MONGO_URI`, and `JWT_SECRET` only on the backend.
- The app limits file size, job description length, resume text length, and daily analyses per user.
- Uploaded PDFs are parsed from memory and not stored as PDF files.
- The frontend renders user content as normal React text, not raw HTML.

## Future Improvements

- Add password reset
- Add job application tracker
- Add resume version tracking
- Add admin analytics dashboard
- Add production-grade rate limiting by IP
- Add deployment to Render/Railway + Vercel

## Author

Youssef Al Hajj Chehade
