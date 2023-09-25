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
/**
 * Imports
 */
const core = __importStar(require("@actions/core"));
const inputHelper = __importStar(require("./input"));
const commitMessageChecker = __importStar(require("./checker"));
/**
 * Main function
 */
async function main() {
    try {
        const args = await inputHelper.getInputs();
        if (args.messages.length === 0) {
            core.info(`No commits found in the payload, skipping check.`);
            return;
        }
        await commitMessageChecker.checkCommitMessages(args);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error);
        }
        else {
            throw error; // re-throw the error unchanged
        }
    }
}
/**
 * Main entry point
 */
main().catch((err) => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsb0RBQXNDO0FBQ3RDLHFEQUF1QztBQUN2QyxnRUFBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsSUFBSTtJQUNqQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFM0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQzlELE9BQU87U0FDUjtRQUVELE1BQU0sb0JBQW9CLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxNQUFNLEtBQUssQ0FBQyxDQUFDLCtCQUErQjtTQUM3QztLQUNGO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMifQ==