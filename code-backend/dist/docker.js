"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCodeInContainer = void 0;
const fs_1 = __importDefault(require("fs"));
const dockerode_1 = __importDefault(require("dockerode"));
const docker = new dockerode_1.default();
const runCodeInContainer = (filename, callback) => {
    const filepath = `/Users/mohitsankhla/Projects/code-backend/code/${filename}.js`;
    fs_1.default.readFile(filepath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            callback(err, null);
            return;
        }
        // Create a new container
        docker.createContainer({
            Image: "node:latest",
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            OpenStdin: false,
            Cmd: ["node", "-e", data], // Execute the code using Node.js
        }, (err, container) => {
            if (err || !container) {
                console.error("Error creating container:", err);
                callback(err, null);
                return;
            }
            // Start the container
            container.start((err, data) => {
                if (err) {
                    console.error("Error starting container:", err);
                    callback(err, null);
                    return;
                }
                // Wait for the container to finish
                container.wait((err, data) => {
                    if (err) {
                        console.log(err.message);
                        callback(err, null);
                        return;
                    }
                    container.logs({ stderr: true, stdout: true }, (err, result) => {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                            return;
                        }
                        container.remove((err) => {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                                return;
                            }
                            fs_1.default.unlink(filepath, (err) => {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                    return;
                                }
                                callback(null, result === null || result === void 0 ? void 0 : result.toString());
                            });
                        });
                    });
                });
            });
        });
    });
};
exports.runCodeInContainer = runCodeInContainer;
