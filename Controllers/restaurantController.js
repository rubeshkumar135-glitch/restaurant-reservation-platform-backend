import Restaurant from "../Models/restaurantSchema.js";

// Create Restaurant
export const createRestaurant = async (req, res) => {
  try {
    const body = req.body;

    const photoUrls = req.files ? req.files.map((file) => file.path) : [];

    const restaurant = new Restaurant({
      name: body.name,
      description: body.description,

      location: {
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
      },

      contact: {
        phone: body.phone,
        email: body.email,
      },

      cuisineTypes: body.cuisineTypes,
      priceRange: body.priceRange,
      capacity: body.capacity,
      photos: photoUrls,
      owner: req.user.id,
    });

    await restaurant.save();

    res.status(201).json({
      message: "Restaurant created successfully!",
      restaurant,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Restaurants of Logged-in Owner
export const getOwnerRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      owner: req.user._id,
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search Restaurant
export const getAllRestaurants = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      const lower = search.toLowerCase();

      const numberMatch = lower.match(/\d+/);
      const numberValue = numberMatch ? Number(numberMatch[0]) : null;

      let andConditions = [];
      let orConditions = [];

      // 🔍 TEXT SEARCH
      orConditions.push(
        { name: { $regex: lower, $options: "i" } },
        { "location.city": { $regex: lower, $options: "i" } },
        { cuisineTypes: { $regex: lower, $options: "i" } }
      );

      // ⭐ RATING FILTER
      if (numberValue && numberValue <= 5) {
        andConditions.push({ averageRating: { $gte: numberValue } });
      }

      // 📝 REVIEW COUNT FILTER
      if (numberValue && numberValue > 5) {
        andConditions.push({ totalReviews: { $gte: numberValue } });
      }

      // 💰 PRICE FILTER
      if (
        lower.includes("low") ||
        lower.includes("cheap") ||
        lower.includes("budget")
      ) {
        andConditions.push({ priceRange: "low" });
      }

      if (lower.includes("medium") || lower.includes("mid")) {
        andConditions.push({ priceRange: "medium" });
      }

      if (
        lower.includes("high") ||
        lower.includes("expensive") ||
        lower.includes("costly")
      ) {
        andConditions.push({ priceRange: "high" });
      }

      query = {
        $and: [
          ...(orConditions.length ? [{ $or: orConditions }] : []),
          ...andConditions,
        ],
      };
    }

    // 🔥 FETCH RESTAURANTS + OWNER
    const restaurants = await Restaurant.find(query)
      .populate("owner", "name email phone")
      .lean();

    // 🔥 ADD REVIEWS + RATING
    const finalData = await Promise.all(
      restaurants.map(async (r) => {

        const reviews = await Review.find({ restaurant: r._id })
          .populate("user", "name")
          .limit(2); // preview only

        const totalReviews = await Review.countDocuments({
          restaurant: r._id,
        });

        const avg =
          reviews.reduce((acc, cur) => acc + cur.rating, 0) /
          (reviews.length || 1);

        return {
          ...r,
          reviews,
          totalReviews,
          averageRating: avg.toFixed(1),
        };
      })
    );

    res.json(finalData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Search Restaurants
export const searchRestaurants = async (req, res) => {
  try {
    const { query } = req.query;

    const restaurants = await Restaurant.find({
      name: { $regex: query, $options: "i" },
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Restaurant Profile
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email",
    );

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
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    restaurant.name = req.body.name || restaurant.name;
    restaurant.description = req.body.description || restaurant.description;

    if (req.body.location) {
      restaurant.location = {
        ...restaurant.location,
        ...req.body.location,
      };
    }

    if (req.body.contact) {
      restaurant.contact = {
        ...restaurant.contact,
        ...req.body.contact,
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
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Upload Restaurant Photos
export const uploadPhotos = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    const images = req.files.map((file) => file.path);

    restaurant.photos.push(...images);

    await restaurant.save();

    res.json({
      message: "Photos uploaded successfully",
      photos: restaurant.photos,
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
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await restaurant.deleteOne();

    res.json({
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
