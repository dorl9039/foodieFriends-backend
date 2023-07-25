const pool = require('../db');

// Get a wish
exports.getWish = async (req, res) => {
    try {
        const wishId = req.params.wishId

        const query = 'SELECT * FROM wish WHERE wish_id = $1';
        const values = [wishId];
        const result = await pool.query(query, values);
        const wish = result.rows[0];

        res.status(200).json(wish);

    } catch (err) {
        console.error(err.message)
    }
};

exports.editWish = async (req, res) => {
    try {
        const wishId = req.params.wishId;
        const { wish_comment, wish_priority } = req.body;
        let query = 'UPDATE wish SET ';
        const values = [];

        if (wish_comment !== undefined) {
            query += `wish_comment = $${values.length + 1}`;
            values.push(wish_comment);
        } 
        if (wish_priority !== undefined) {
            if (values.length > 0) {
                query += ', ';
            }
            query += `wish_priority = $${values.length + 1}`;
            values.push(wish_priority);
        }

        query += ` WHERE wish_id = $${values.length + 1}`;
        values.push(wishId);

        await pool.query(query, values);

        res.status(200).json(`Wish ${wishId} successfully updated`);
    } catch (err) {
        console.error(err.message);
    }
};


exports.deleteWish = async (req, res) => {
    try {
        const wishId = req.params.wishId;
        const query = 'DELETE FROM wish WHERE wish_id = $1';
        const values = [wishId];
        await pool.query(query, values);

        res.status(200).json(`Wish ${wishId} successfully deleted`);

    } catch (err) {
        console.error(err.message);
    }
}