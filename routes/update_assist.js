const express = require("express");
const router = express.Router();
const clients = require("../app");

router.post("/update_assist", (req, res) => {
    const conn = require("../dbConnector");
    conn.query(
        "UPDATE apsiders SET assisted = ? WHERE id = ?",
        [
            req.body.assist,
            req.body.id
        ],
        (err, result) => {
            if (err) throw err;

            [...clients.keys()].forEach((c) => {
                c.send(JSON.stringify({
                    action: "assisted-updated",
                    data: {
                        id: req.body.id,
                        assist: req.body.assist
                    }
                }));
            });

            res.status(200).json({
                status: "success",
                result: result
            })
        }
    );
});

module.exports = router;