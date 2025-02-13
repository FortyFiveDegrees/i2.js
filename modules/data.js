const exec = require("./exec");

/**
 * Store data onto the i2
 * @param {string} filePath - Direct path to file
 * @param {boolean} priority - Is this priority data?
 * @returns {string|null} - Returns true if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.data.storeData("C:/i2/Localscan/temp/BERecord.i2m"); // Restart Pipeline
 * console.log(command);  // Output will be true or `null` if there is an error.
 * 
 */
async function storeData(filePath, priority) {
    try {
        const dataStore = await exec(`store${priority == true ? "Priority" : ""}Data("File=${filePath}")`)
        return true;
    } catch(err) {
        console.log("Error while storing i2 data: ", err)
        return null
    }
}

/**
 * Store image (like Radar) onto the i2
 * @param {string} filePath - Direct path to file
 * @param {boolean} priority - Is this priority image?
 * @param {string} extension - File extension (.tiff, .tif, .bfg)
 * @param {string} issueTime - i2 Issue Time
 * @param {string} imageType - Radar, Map, etc.
 * @param {string} location, US, HI, AK, PR 
 * @returns {string|null} - Returns true if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.data.storeImage("C:/i2/Localscan/temp/radar.tiff", true, ".tiff", "02/05/2025 14:15:00", "Radar", "US"); // Restart Pipeline
 * console.log(command);  // Output will be true or `null` if there is an error.
 * 
 */
async function storeImage(filePath, priority, extension, issueTime, imageType, location) {
    try {
        const dataStore = await exec(`store${priority == true ? "Priority" : ""}Image("File=${filePath},IssueTime=${issueTime},Location=${location},imageType=${imageType},FileExtension=${extension}")`)
        return true;
    } catch(err) {
        console.log("Error while storing i2 image: ", err)
        return null
    }
}

module.exports = {storeData, storeImage};