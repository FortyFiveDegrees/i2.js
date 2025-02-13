const { exec } = require("child_process");

/**
 * Executes a given command using the i2's built-in exec.
 * 
 * @param {string} command - The command to be executed on the i2.
 * @returns {Promise<string|null>} - Returns the output of the command if successful, `null` if it fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.exec('loadRunPres("Flavor=domestic/Azul,Duration=1800,PresentationId=4")'); // This sends a request to the i2 for a 60s Azul with pid 4.
 * console.log(command);  // Output will be the command output or `null` if there is an error.
 */
async function i2exec(command) {
    const fullCommand = `"C:/Program Files (x86)/TWC/i2/exec.exe" -async ${command}`;
    try {
        const { stdout, stderr } = await execPromise(fullCommand);
        if (stderr) {
            console.log(`Error occurred: `, stderr);
            return null;
        }
        return stdout;
    } catch (err) {
        console.log(`Error occurred while sending i2Exec CMD: `, err);
        return null;
    }
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

module.exports = i2exec;