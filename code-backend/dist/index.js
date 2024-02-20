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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const bodyParser = require("body-parser");
const code_1 = require("./code");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
function convertTextToJS(text) {
    var jsCode = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    return jsCode;
}
app.post("/code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(401).json({ message: "Code not found" });
        }
        try {
            const cleanCode = convertTextToJS(code);
            console.log(cleanCode);
            const output = yield (0, code_1.runCode)(cleanCode);
            res.status(200).json({ output: output });
        }
        catch (error) {
            res.status(401).json({ error: error });
        }
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${3000}`);
});
