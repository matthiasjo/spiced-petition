const db = require("./utils/db");

(async () => {
    await db.deleteAllUsers();
    process.exit();
})();
