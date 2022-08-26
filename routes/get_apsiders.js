const express = require("express");
const router = express.Router();

router.get("/get-apsiders", (req, res, next) => {
    const conn = require("../dbConnector");
    conn.query(
        "Select * from apsiders",
        (err, result) => {
            if (err) throw err;
            res.status(200).json({
                status: "success",
                length: result?.length,
                result: result
            })
        }
    );
});

module.exports = router;