const http = require('http');
const authController = require('./controller/AuthController');
const opportunityController = require('./controller/OpportunityController');
const { isAuthenticated } = require('./middleware/AuthMiddleware');
const connectDB = require('./config/db'); // Import the db.js

// Connect to the database
connectDB(); // Establish MongoDB connection

// Create server
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Content-Type', 'application/json'); // Set response header for JSON response

  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No content
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/auth/register') {
    // Register route
    authController.registerUser(req, res);
  } else if (req.method === 'POST' && req.url === '/api/auth/login') {
    // Login route
    authController.loginUser(req, res);
  } else if (req.method === 'POST' && req.url === '/api/auth/opportunities') {
    // Protected opportunity creation route
    isAuthenticated(req, res, () => {
      opportunityController.createOpportunity(req, res);
    });
  } else if (req.method === 'GET' && req.url.startsWith('/api/opportunities-list')) {
    // Opportunity list route
    opportunityController.listOpportunities(req, res);
  } else if (req.method === 'DELETE' && req.url.startsWith("/api/auth/opportunities")) {
    // Delete opportunity route
    isAuthenticated(req, res, () => {
      
      const id = req.url.split('/').pop(); // Extract the opportunity ID from the URL
      opportunityController.removeOpportunity(req,res,id);
    });
  } else if (req.method === 'PUT' && req.url.startsWith("/api/auth/opportunities")) {
    // Delete opportunity route
    isAuthenticated(req, res, () => {
      const OpportunityId = req.url.split('/').pop(); // Extract the opportunity ID from the URL
      opportunityController.editOpportunity(req,res,OpportunityId);
    });
  }else {
    // Handle 404 Not Found
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}).listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
