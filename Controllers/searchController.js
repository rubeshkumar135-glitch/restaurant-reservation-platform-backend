import Restaurant from "../Models/restaurantSchema.js";

export const searchRestaurants = async (req, res) => {
    try {
        const { cuisine, location, priceRange, dietary, ambiance, feature} = req.query;

        let filter = {};

        // Cuisine filter
        if (cuisine) {
            filter.cuisineTypes = { $in: cuisine.split(",") };
        }

        // Location filter
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        // Price filter
        if (priceRange) {
            filter.priceRange = priceRange;
        }

        // Dietary restriction
        if (dietary) {
            filter.dietaryoptions = { $in: dietary.split(",") };
        }

        // Ambiance
        if (ambiance) {
            filter.ambiance = { $in: ambiance.split(",") };
        }

        // Special fesrtures
        if (feature) {
            filter.feature = { $in: feature.split(",") };
        }

        const restaurants = await Restaurant.find(filter);

        res.status(200).json({
            count: restaurants.length,
            restaurants,
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}