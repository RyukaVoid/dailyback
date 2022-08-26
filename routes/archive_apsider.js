const express = require("express");
const router = express.Router();

router.post("/archive_apsider", (req, res, next) => {
    const conn = require("../dbConnector");
    conn.query(
        "UPDATE apsiders SET archived = ? WHERE id = ?",
        [
            req.body.archive,
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