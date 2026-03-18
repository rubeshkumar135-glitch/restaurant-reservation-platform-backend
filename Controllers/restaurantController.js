import Restaurant from "../Models/restaurantSchema.js";



export const createRestaurant = async (req, res) => {
  try {

    const body = req.body;

    const photoUrls = req.files
      ? req.files.map(file => file.path)
      : [];

    const restaurant = new Restaurant({

      name: body.name,
      description: body.description,

      // ✅ FIXED STRUCTURE
      location: {
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode
      },

      contact: {
        phone: body.phone,
        email: body.email
      },

      cuisineTypes: body.cuisineTypes,
      priceRange: body.priceRange,
      capacity: body.capacity,
      photos: photoUrls,
      owner: req.user.id

    });

    await restaurant.save();

    res.status(201).json({
      message: "Restaurant created successfully!",
      restaurant
    });

  } catch (error) {

    console.error("CREATE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};


// Get Restaurants of Logged-in Owner
export const getOwnerRestaurants = async (req, res) => {
  try {

    const restaurants = await Restaurant.find({
      owner: req.user._id
    });

    res.json(restaurants);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// // ✅ Get ALL Restaurants (User Dashboard)
// export const getAllRestaurants = async (req, res) => {
//   try {

//     const restaurants = await Restaurant.find()
//       .populate("owner", "name");

//     res.status(200).json(restaurants);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const getAllRestaurants = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
          { cuisineTypes: { $regex: search, $options: "i" } }
        ]
      };
    }

    const restaurants = await Restaurant.find(query)
      .populate("owner", "name");

    res.json(restaurants);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ Search Restaurants
export const searchRestaurants = async (req, res) => {
  try {

    const { query } = req.query;

    const restaurants = await Restaurant.find({
      name: { $regex: query, $options: "i" }
    });

    res.json(restaurants);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get Restaurant Profile
export const getRestaurant = async (req, res) => {
  try {

    const restaurant = await Restaurant.findById(req.params.id)
      .populate("owner", "name email");

    res.json(restaurant);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update Restaurant
export const updateRestaurant = async (req, res) => {
  try {

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    if (restaurant.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    restaurant.name = req.body.name || restaurant.name;
    restaurant.description = req.body.description || restaurant.description;

    if (req.body.location) {
      restaurant.location = {
        ...restaurant.location,
        ...req.body.location
      };
    }

    if (req.body.contact) {
      restaurant.contact = {
        ...restaurant.contact,
        ...req.body.contact
      };
    }

    if (req.body.cuisineTypes) {
      restaurant.cuisineTypes = req.body.cuisineTypes;
    }

    if (req.body.priceRange) {
      restaurant.priceRange = req.body.priceRange;
    }

    if (req.body.photos) {
      restaurant.photos = req.body.photos;
    }

    if (req.body.capacity) {
      restaurant.capacity = req.body.capacity;
    }

    await restaurant.save();

    res.json({
      message: "Restaurant updated successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};



// Upload Restaurant Photos
export const uploadPhotos = async (req, res) => {
  try {

    const restaurant = await Restaurant.findById(req.params.id);

    const images = req.files.map(file => file.path);

    restaurant.photos.push(...images);

    await restaurant.save();

    res.json({
      message: "Photos uploaded successfully",
      photos: restaurant.photos
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Restaurant
export const deleteRestaurant = async (req, res) => {

  try {

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    // Owner authorization
    if (restaurant.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await restaurant.deleteOne();

    res.json({
      message: "Restaurant deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};