import fs from "fs";
const customLog = (message) => {
  const logFilePath = "log.txt";
  const date = new Date()
    .toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
    .split(" ")[0];

  const time = new Date()
    .toLocaleString("sv-SE", { timeZone: "Europe/Istanbul" })
    .split(" ")[1]
    .slice(0, -3);

  const logMessage = `${date + " - " + time} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("An error occurred while adding log:", err);
    } else {
      console.log("Log added successfully.");
    }
  });
};

export default customLog;
