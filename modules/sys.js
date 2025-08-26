const exec = require("./exec");
const fs = require("fs")
const path = require("path")

/**
 * Restarts the i2 service
 * 
 * @returns {string|null} - Returns true if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.sys.restartI2Service(); // Restart the i2 service
 * console.log(command);  // Output will be true or `null` if there is an error.
 * 
 */
async function restartI2Service() {
    try {
        const restart = await exec("restartI2Service(\"r=1\")")
        return true;
    } catch(err) {
        console.log("Error while restarting i2 service: ", err)
        return null
    }
}

/**
 * Restarts process on the i2
 * @param {string} processName - Process name (Ex. I2jPipeline) 
 * @returns {string|null} - Returns true if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.sys.restartProcess("I2jPipeline"); // Restart Pipeline
 * console.log(command);  // Output will be true or `null` if there is an error.
 * 
 */
async function restartProcess(processName) {
    try {
        const restart = await exec(`restartProcess("ProcessName=${processName}")`)
        return true;
    } catch(err) {
        console.log("Error while restarting i2 process: ", err)
        return null
    }
}

/**
 * Returns MachineProductCfg as XML 
 * @returns {string|null} - Returns MachineProductCfg.xml if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = i2.sys.getMPC(); // Gets machine product config
 * console.log(command);  // Output will be true or `null` if there is an error.
 * 
 */
function getMPC() {
    try {
        const config = fs.readFileSync(path.join("C:/Program Files (x86)/TWC/i2/Managed/Config/MachineProductCfg.xml"))
        return config;
    } catch(err) {
        console.log("Error while getting machineproductcfg: ", err)
        return null
    }
}

module.exports = {restartI2Service,restartProcess,getMPC};

