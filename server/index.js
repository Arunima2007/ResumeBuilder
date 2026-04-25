const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoDB = require('./config/db');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const resumeRoutes = require('./routes/resume.route'); // ✅ Add this if you have it
const analysisRoutes = require('./routes/analysis.route'); // 🔥 NEW - Analysis routes
const app = express();

//dotenv config
dotenv.config();

//database config   
mongoDB();

app.use(express.json());
//middlewares
app.use(cors());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes); // ✅ Add this if you have resume routes
app.use('/api/analysis', analysisRoutes); // 🔥 NEW - Analysis API

//middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.send('🚀 Resume Builder Server is running successfully!');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Resume Builder API',
    analysis: 'Available at /api/analysis',
    timestamp: new Date().toISOString()
  });
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Server is working on http://localhost:${process.env.PORT}`);
    console.log(`📊 Analysis API: http://localhost:${process.env.PORT}/api/analysis`);
});