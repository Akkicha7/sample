const db = require('./database');
const logger = require('./logger');

// Securely fetches user data based on the provided user ID
const fetchUserData = async (req, res) => {
    // 1. Input Validation: Ensure the ID is a valid positive integer
    const userId = parseInt(req.query.id, 10);
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ error: "Invalid user ID provided." });
    }

    // 2. Parameterized Query: Completely neutralizes SQL Injection risks.
    // Note: We also deliberately exclude the password_hash from the SELECT statement.
    const query = `SELECT id, username, email FROM users WHERE id = $1`;

    try {
        // Passing the user input as a separate parameter array
        const result = await db.query(query, [userId]);

        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (err) {
        // 3. Secure Error Handling: Log the actual error for developers, 
        // but return a generic, safe message to the client to prevent data leakage.
        logger.error(`Database error fetching user ${userId}:`, err.message);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

module.exports = { fetchUserData };
