const exec = require("./exec");

/**
 * Send a starbundle to the i2
 * @param {string} filePath - Direct path to starbundle zip file
 * @returns {string|null} - Returns true if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.bundle.send("C:/starbundle.zip"); // Restart Pipeline
 * console.log(command);  // Output will be true or `null` if there is an error.
 * 
 */
async function send(filePath) {
    try {
        const restart = await exec(`stageStarBundle(File=${filePath})`)
        return true;
    } catch(err) {
        console.log("Error while staging star bundle: ", err)
        return null
    }
}

module.exports = {send};