// controllers/opportunityController.js
const opportunityModel = require('../model/OpportunityModel');
const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');

// List opportunities with filters and pagination
const listOpportunities = async (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const filters = {
    category: urlParams.get('category'),
    minPrice: parseInt(urlParams.get('minPrice')),
    maxPrice: parseInt(urlParams.get('maxPrice')),
    condition: urlParams.get('condition')
  };

  const page = parseInt(urlParams.get('page')) || 1;
  const limit = parseInt(urlParams.get('limit')) || 10;

  try {
  const opportunities = await opportunityModel.getOpportunities(filters, page, limit);
  
  //console.log('Fetched Opportunities:', opportunities);
  if (Array.isArray(opportunities)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(opportunities));
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Invalid data format: opportunities should be an array.',
      error: 'Invalid data',
    }));
  }
} catch (error) {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Error retrieving opportunities', error: error.message }));
}
};

// Create new opportunity
const createOpportunity = async (req, res) => {
let body = '';

// Gather the raw body data
req.on('data', chunk => {
  body += chunk.toString();
});

req.on('end', async () => {
  try {
    const opportunityData = JSON.parse(body);

    // Validate required fields
    const { title, organization, location, duration, type, price, condition, category } = opportunityData;
    if (!title || !organization || !location || !duration || !type || !price || !condition || !category) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Missing required fields' }));
    }

    // Create new opportunity using the model
    await opportunityModel.addOpportunity(opportunityData);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Opportunity created successfully' }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error', error: error.message }));
  }
});
};
const removeOpportunity = async (req, res, opportunityId) => {
  // Validate ID presence
  if (!opportunityId) {
    console.log("Opportunity ID is missing");
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Opportunity ID is required' }));
  }

  // Validate ID format (MongoDB ObjectId)
  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    console.log("Invalid Opportunity ID format:", opportunityId);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid Opportunity ID format' }));
  }

  try {
    // Find the opportunity by ID
    const opportunity = await opportunityModel.getOpportunityById(opportunityId);

    // If the opportunity is not found
    if (!opportunity) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Opportunity not found' }));
    }

    // Delete the opportunity
    await opportunity.deleteOne();

    // Success response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Opportunity deleted successfully' }));
  } catch (error) {
    console.error('Error deleting opportunity:', error);

    // Internal server error response
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Error deleting opportunity', error: error.message }));
  }
};
// Edit an existing opportunity
const editOpportunity = async (req, res, opportunityId) => {
  let body = '';

  // Gather the raw body data
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const updatedData = JSON.parse(body);

      // Validate ID presence
      if (!opportunityId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Opportunity ID is required' }));
      }

      // Validate ID format (MongoDB ObjectId)
      if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid Opportunity ID format' }));
      }

      // Perform the update
      const updatedOpportunity = await opportunityModel.editOpportunity(opportunityId, updatedData);

      // Success response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Opportunity updated successfully', data: updatedOpportunity }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error updating opportunity', error: error.message }));
    }
  });
};




module.exports = {
listOpportunities,
createOpportunity,
removeOpportunity,
editOpportunity
};


