const pool = require('../db');

// Display list of wishes for a user
exports.getWishlist = async (req, res) => {
    // Remember to validate user here
    try {
        const userId = req.params.userId;
        const query = 'SELECT * FROM wish WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        const wishlist = result.rows;
        
        res.status(200).json(wishlist);

    } catch (err) {
        console.error('Error fetching user wishlist', err.message);
    }
};

// Add a wish to wishlist
exports.addWish = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;

        const query = 'INSERT INTO wish (user_id, restaurant_id, wish_comment, wish_priority) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [userId, restaurantId, data.wish_comment, data.wish_priority];
        const result = await pool.query(query, values);
        const newWish = result.rows[0];

        res.status(201).json(newWish);

    } catch (err) {
        console.error("Error creating new wish", err.message);
    }
};