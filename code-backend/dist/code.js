"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const docker_1 = require("./docker");
const writeFileAsync = util_1.default.promisify(fs_1.default.writeFile);
const runCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = Date.now().toString();
    const filePath = `/Users/mohitsankhla/Projects/code-backend/code/${filename}.js`;
    try {
        // Write code to file
        yield writeFileAsync(filePath, code);
        // Run code in container
        return new Promise((resolve, reject) => {
            (0, docker_1.runCodeInContainer)(filename, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve(result || '');
            });
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.runCode = runCode;
