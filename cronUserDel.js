const db = require("./utils/db");

(async () => {
    console.log("cronjob called");
    await db.deleteAllUsers();
    process.exit();
})();
