"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const storage_1 = require("./storage");
(async () => {
    await (0, bot_1.clearChat)(await storage_1.appStorage.clearTable());
})();
//# sourceMappingURL=clear.js.map