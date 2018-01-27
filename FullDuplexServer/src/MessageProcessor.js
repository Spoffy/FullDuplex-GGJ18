"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageProcessor {
    processMessage(message) {
        console.log(message.author.username, ":", message.content);
    }
}
exports.MessageProcessor = MessageProcessor;
//# sourceMappingURL=MessageProcessor.js.map