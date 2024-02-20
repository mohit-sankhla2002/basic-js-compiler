import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser = require('body-parser');
import { runCode } from './code';
config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

function convertTextToJS(text: string) {
    var jsCode = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    return jsCode;
}

app.post("/code", async (req, res) => {
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(401).json({ message:"Code not found" });
        }
        try {
            const cleanCode = convertTextToJS(code);
            console.log(cleanCode);
            const output = await runCode(cleanCode);
            res.status(200).json({ output: output });
        } catch (error) {
            res.status(401).json({ error: error });
        }
    } catch (error: any) {
        console.log(error.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${3000}`);
});