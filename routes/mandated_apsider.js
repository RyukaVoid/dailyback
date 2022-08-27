const express = require("express");
const router = express.Router();
const clients = require("../app");

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

            conn.query(
                "SELECT * FROM apsiders WHERE id = ?",
                [
                    req.body.id
                ],
                (error, apsiders) => {
                    if (error) throw error;
                    [...clients.keys()].forEach((c) => {
                        c.send(JSON.stringify({
                            action: "mandated-updated",
                            apsider: apsiders[0],
                        }));
                    });
                }
            );

            res.status(200).json({
                status: "success",
                result: result
            })
        }
    );
});

module.exports = router;