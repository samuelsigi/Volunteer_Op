const mongoose = require('mongoose');

// Define the schema for an opportunity
const opportunitySchema = new mongoose.Schema({
  title: {
    type: String
  },
  organization: {
    type: String
  },
  location: {
    type: String
  },
  duration: {
    type: String
  },
  type: {
    type: String,
    enum: ['onsite', 'remote'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'ongoing'],
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create and export the model
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

// Add a new opportunity
const addOpportunity = async (opportunity) => {
  try {
    // Validate price
    if (isNaN(opportunity.price)) {
      throw new Error('Price must be a valid number');
    }

    const newOpportunity = new Opportunity(opportunity);
    await newOpportunity.save();
    console.log('Opportunity added:', newOpportunity);
  } catch (error) {
    console.error('Error adding opportunity:', error);
    throw error; // Propagate error for further handling if needed
  }
};

// Get opportunities with filters and pagination
const getOpportunities = async (filters = {}, page = 1, limit = 10) => {
  try {
    let query = {};

    // Filter by category
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.location) {
      query.location = filters.location; // Assuming `location` is a field in the Opportunity model
    }


    // Filter by price range
    if (!isNaN(filters.minPrice) && !isNaN(filters.maxPrice)) {
      query.price = { $gte: Number(filters.minPrice), $lte: Number(filters.maxPrice) };
    }
    // Filter by condition
    if (filters.condition) {
      query.condition = filters.condition;
    }

    // Pagination setup
    const skip = (page - 1) * limit;
    const opportunities = await Opportunity.find(query)
      .skip(skip)
      .limit(limit);

      return Array.isArray(opportunities) ? opportunities : [];
  } catch (error) {
    console.error('Error retrieving opportunities:', error);
    throw error; // Propagate error for further handling if needed
  }
};

// Get an opportunity by ID
const getOpportunityById = async (id) => {
  try {
    // Validate the ID format (MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Opportunity ID format');
    }

    // Find the opportunity by ID
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    return opportunity;
  } catch (error) {
    console.error('Error retrieving opportunity by ID:', error);
    throw error; // Propagate error for further handling if needed
  }
};
const editOpportunity = async (id, updatedData) => {
  try {
    // Validate the ID format (MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Opportunity ID format');
    }

    // Update the opportunity
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id, 
      updatedData, 
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedOpportunity) {
      throw new Error('Opportunity not found');
    }

    console.log('Opportunity updated:', updatedOpportunity);
    return updatedOpportunity;
  } catch (error) {
    console.error('Error updating opportunity:', error);
    throw error; // Propagate error for further handling if needed
  }
};

module.exports = {
  addOpportunity,
  getOpportunities,
  getOpportunityById,
  editOpportunity
};