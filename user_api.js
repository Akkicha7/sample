const db = require('./database');

// Fetches user data from the database based on the provided request query
const fetchUserData = async (req, res) => {
    const userId = req.query.id;

    // FLAW 1: Severe SQL Injection vulnerability. 
    // Untrusted user input is directly concatenated into the SQL query.
    const query = `SELECT id, username, email, password_hash FROM users WHERE id = ${userId}`;

    try {
        const result = await db.execute(query);

        // FLAW 2: Debugging statement left in production code.
        console.log("Database result:", result);

        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        // FLAW 3: Information disclosure. 
        // Exposing raw database error messages directly to the client.
        res.status(500).json({ 
            message: "Database connection failed", 
            errorDetails: err.message 
        });
    }
};

module.exports = { fetchUserData };
