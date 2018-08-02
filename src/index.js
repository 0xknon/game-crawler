

import express from "express";
// import match from "./match";
// import result from "./result";
// import summary from "./summary";
import Twitch from "./Twitch";


const router = express.Router();

// router.use("/match", match);
// router.use("/result", result);
// router.use("/summary", summary);
router.use("/Twitch", Twitch);

//todo add this to development / staging only

export default router;