const express = require("express");
const router = express.Router();

router.post("/update_assist", (req, res) => {
    const conn = require("../dbConnector");
    conn.query(
        "UPDATE apsiders SET assisted = ? WHERE id = ?",
        [
            req.body.assist,
            req.body.id
        ],
        (err, result) => {
            console.log("Update apsider", req.body.apsde);
            if (err) throw err;
            res.status(200).json({
                status: "success",
                result: result
            })
        }
    );
});

module.exports = router;