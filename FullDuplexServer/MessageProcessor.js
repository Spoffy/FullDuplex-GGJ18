"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageProcessor = (function () {
    function MessageProcessor() {
    }
    MessageProcessor.prototype.processMessage = function (message) {
        console.log(message.author, message.content);
    };
    return MessageProcessor;
}());
exports.MessageProcessor = MessageProcessor;
//# sourceMappingURL=MessageProcessor.js.map