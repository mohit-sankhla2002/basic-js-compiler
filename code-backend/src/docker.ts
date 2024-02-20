import fs from "fs";
import Docker from "dockerode";

const docker = new Docker();

export const runCodeInContainer = (filename: string, callback: Function) => {
  const filepath = `/Users/mohitsankhla/Projects/code-backend/code/${filename}.js`;
  fs.readFile(filepath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      callback(err, null);
      return;
    }

    // Create a new container
    docker.createContainer(
      {
        Image: "node:latest",
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: false,
        Cmd: ["node", "-e", data], // Execute the code using Node.js
      },
      (err, container) => {
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
                fs.unlink(filepath, (err) => {
                  if (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                  }
                  callback(null, result?.toString());
                });
              });
            });
          });
        });
      }
    );
  });
};
