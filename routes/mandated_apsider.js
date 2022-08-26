const express = require("express");
const router = express.Router();

router.post("/mandated_apsider", (req, res, next) => {
    const conn = require("../dbConnector");
    conn.query(
        "UPDATE apsiders SET mandated = ? WHERE mandated = ?",
        [
            0,
            1
        ],
        (err, result) => {
            if (err) throw err;
        }
    );
    
    conn.query(
        "UPDATE apsiders SET mandated = ? WHERE id = ?",
        [
            1,
            req.body.id
        ],
        (err, result) => {
            if (err) throw err;
            res.status(200).json({
                status: "success",
                result: result
            })
        }
    );
});

module.exports = router;