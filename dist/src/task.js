"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviver = void 0;
function Reviver(key, value) {
    if (key === "" && Array.isArray(value)) {
        return value;
    }
    switch (key) {
        case "id":
            if (isNaN(value)) {
                throw new Error("Error File format...");
            }
            return value;
        case "task":
            if (!(typeof value === "string")) {
                throw new Error("Error File format...");
            }
            return value;
        case "done":
            if (!(typeof value === "boolean")) {
                throw new Error("Error File format...");
            }
            return value;
        default:
            if (!isNaN(parseInt(key, 10))) {
                return value;
            }
            throw new Error("Error File format...");
    }
}
exports.Reviver = Reviver;
