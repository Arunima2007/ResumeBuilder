# 📊 AI Resume Builder & Analysis Platform

An intelligent, full-stack web application that helps users **create, customize, analyze, and optimize resumes** using AI-powered insights. Featuring a premium dark-mode glassmorphic user interface, interactive templates, and deep resume strength analysis.

---

## 🎨 Design & Aesthetic
The application features a modern, premium **dark-theme glassmorphism interface**:
- **Ambient Glow Blobs**: Moving background gradients that bring the viewport to life.
- **Interactive Shining Cards**: Border and drop shadow highlights that dynamically glow brighter when hovered.
- **Micro-animations**: Seamless, hardware-accelerated page transitions and sliding button states powered by **Framer Motion**.
- **Highly Responsive Layout**: Beautifully optimized for mobile, tablet, and desktop screens.

---

## 🚀 Key Features

### 🧠 AI Resume Intelligence & ATS Scoring
- Deep evaluation of resume sections powered by **Google Gemini AI**.
- Real-time ATS match rating calculated against target job descriptions.
- Auto-extracts missing technical keywords, highlights resume weaknesses, and offers actionable, sentence-by-sentence improvement suggestions.

### ✍️ Section-by-Section Resume Builder
- **Personal Details**: Input contact info, location, and social links.
- **Education**: Add detailed listings of university degrees, percentages, school boards, and CGPA metrics.
- **Experience**: Structured company logs with multi-line description bullets.
- **Projects**: Log title, tech stack description, and links with clickable indicators.
- **Skills & Achievements**: Segmented by Programming Languages, Web Technologies, Databases, Frameworks, and extracurricular achievements.

### 📈 Smart Completion Tracker
- Sidebar completion indicator showing form completion status.
- Evaluates actual user-entered text content (trimming spaces and skipping empty templates) rather than simple list additions.

### 📄 Interactive PDF Templates
- **Template 1**: A creative layout complete with social badge logos (GitHub, LeetCode, Codeforces, CodeChef) and sidebars.
- **Template 2**: A structured, single-column corporate resume layout.
- High-fidelity PDF rendering with standard margins, proper print spacing, and local download options.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite build system)
- **Redux Toolkit** (global state management)
- **Redux Persist** (local state persistence)
- **Material UI (MUI)** (custom dark theme engine)
- **Framer Motion** (page transitions & animation)
- **HTML2PDF.js / HTML2Canvas / jsPDF** (PDF compiling)
- **React Toastify** (success/error alerts)

### Backend
- **Node.js**
- **Express.js** (API framework)
- **MongoDB Atlas & Mongoose** (NoSQL database)
- **Firebase Auth SDK** (secure Google Authentication validation)
- **Google Gen AI SDK** (Gemini AI integration)

---

## 📂 Project Structure
```bash
ResumeBuilder/
│
├── client/                     # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── assets/             # Images and template screenshots
│   │   ├── components/         # Sub-forms (Profile, Projects) & layout templates
│   │   ├── pages/              # Main routing views (Landing, Auth, Profile)
│   │   ├── redux/              # Redux slices (user, extraDetails)
│   │   ├── styles/             # Global CSS variables & component-specific stylings
│   │   ├── App.jsx             # Theme config & route wrapping
│   │   └── main.jsx
│   └── package.json
│
└── server/                     # Backend Application (Express.js API)
    ├── controllers/            # API Route logic controllers (AI analysis, user auth)
    ├── models/                 # Mongoose schemas (ResumeData, User)
    ├── routes/                 # Express API routes
    ├── index.js                # App entry point & middleware configurations
    └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Arunima2007/ResumeBuilder.git
cd ResumeBuilder
```

### 2️⃣ Backend Setup
Navigate to the `server/` directory:
```bash
cd server
```

Install backend dependencies:
```bash
npm install
```

Create a `.env` file inside the `server/` directory and configure the environment variables:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend API server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3️⃣ Frontend Setup
Open a new terminal session and navigate to the `client/` directory:
```bash
cd client
```

Install frontend dependencies:
```bash
npm install
```

Create a `.env` file (or `.env.local`) inside the `client/` directory and specify the backend API URL:
```env
VITE_API_URL=http://localhost:8000/api
```

Start the Vite local development server:
```bash
npm run dev
```

Build the optimized production bundle:
```bash
npm run build
```

---

## 🔒 Security Rules & Rules of Engagement
- User sessions are verified using Google Firebase ID Tokens which are sent to the Node.js backend for JWT exchange.
- MongoDB collections use schema-level validation to prevent unauthorized updates.
