"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommitMessages = void 0;
const core = __importStar(require("@actions/core"));
/**
 * Checks commit messages given by args.
 *
 * @param     args messages, pattern and error message to process.
 * @returns   void
 */
async function checkCommitMessages({ messages, patternRe, error }) {
    if (messages.length === 0) {
        core.info("No messages to check");
        return;
    }
    core.info(`Checking commit messages against: ${String(patternRe)}`);
    // core.info(`Messages is ${messages.length} lines`);
    // messages.forEach((msg, idx) => {
    // core.info(`Messages[idx] = ${msg}`);
    // });
    const result = messages.every((message) => {
        if (!patternRe.test(message)) {
            core.info(`failed: ${message}`);
            return false;
        }
        return true;
    });
    if (!result) {
        throw new Error(error);
    }
}
exports.checkCommitMessages = checkCommitMessages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGVja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXNDO0FBR3RDOzs7OztHQUtHO0FBQ0ksS0FBSyxVQUFVLG1CQUFtQixDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQW9CO0lBQ3hGLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2xDLE9BQU87S0FDUjtJQUVELElBQUksQ0FBQyxJQUFJLENBQUMscUNBQXFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEUscURBQXFEO0lBQ3JELG1DQUFtQztJQUNuQyx1Q0FBdUM7SUFDdkMsTUFBTTtJQUVOLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUVoQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQztBQXpCRCxrREF5QkMifQ==