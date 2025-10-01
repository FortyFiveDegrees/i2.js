const exec = require("./exec");

/**
 * Format date to i2 startTime
 * 
 * @param {Date} time - The flavor/theme name (excluding .xml and SD for JR units) on the i2
 * @returns {string|null} - Returns formatted date if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const startTime = i2.playlistManager.formatStart(new Date()); // Returns date as i2 start time
 * console.log(command);  // Output will be the command output or `null` if there is an error.
 * // Example reponse: 02/05/2025 12:14:00:00
 */
function formatStart(time) {
    const date = new Date(time);
    const pad = (num, size) => num.toString().padStart(size, '0');
    const month = pad(date.getUTCMonth() + 1, 2);
    const day = pad(date.getUTCDate(), 2);
    const year = date.getUTCFullYear();
    const hours = pad(date.getUTCHours(), 2);
    const minutes = pad(date.getUTCMinutes(), 2);
    const seconds = pad(date.getUTCSeconds(), 2);
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}:00`;
}

/**
 * Fully automated playlist handle with 6 arguments.
 * 
 * @param {string} flavor - The flavor/theme name (excluding .xml and SD for JR units) on the i2
 * @param {number} duration - The duration of the playlist in seconds
 * @param {string} id - Playlist ID (ex. ldl3, 4, sidebar2)
 * @param {string|null} tag - Optional, TAG used for LOT8s backgrounds
 * @param {number|null} delay - Delay of playlist start from command sent in seconds
 * @param {Object|null} cancelInfo - Information of playlist to cancel (can be multiple)
 * @param {Object|null} startInfo - Information of playlists to start on playlist duration complete (can be multiple)
 * @returns {Promise<string|null>} - Returns the output of the command if successful, `null` if it fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.playlistManager.handlePlaylist("domestic/V", 1950, "4", "domesticAds/TAG3631", 10, [{"id": "ldl3"},{"id": "sidebar2"}], ["id": "ldl3", "flavor": "domestic/ldlE", "duration": 72000]); // This sends a request to the i2 for a 65s Enhanced LOT8s with pid 4, logo tag domesticAds/TAG3631, delay of 10s for radar cuts, and a cancellation of ldl3 and sidebar2.
 * console.log(command);  // Output will be "Successfully handled playlist" or `null` if there is an error.
 */
async function handlePlaylist(flavor, duration, id, tag, delay, cancelInfo, startInfo) {
    const loadCommand = `loadPres("Flavor=${flavor},Duration=${duration},PresentationId=${id}${(tag !== null&&tag !== undefined&&tag!==0&&tag!=="0") ? `,Logo=${tag}` : ""}")`;
    let time = new Date();
    if (delay !== null) {
        time.setSeconds(time.getSeconds() + delay + 2);
    }
    const runCommand = `runPres("PresentationId=${id},StartTime=${formatStart(time)}")`;

    const cancelCommands = [];
    const startCommands = [];
    if (cancelInfo !== null && cancelInfo !== undefined) {
        cancelInfo.forEach(c => {
            const cancelTime = new Date(time.getTime());
            cancelCommands.push(`cancelPres("PresentationId=${c.id},StartTime=${formatStart(cancelTime)}")`);
        });
    }

    if (startInfo !== null && startInfo !== undefined) {
        startInfo.forEach(c => {
            const startTime = (new Date / 1) + ((duration / 30) * 1000) + ((delay * 1000) + 2000)
            startCommands.push([`loadPres("Flavor=${c.flavor},Duration=${c.duration},PresentationId=${c.id}")`, `runPres("PresentationId=${c.id},StartTime=${formatStart(new Date(startTime))}")`]);
        });
    }

    try {
        const load = await exec(loadCommand);
        
        for (let cancelCommand of cancelCommands) {
            await exec(cancelCommand);
        }

        if (delay !== null) {
            setTimeout(async () => {
                await exec(runCommand);
                setTimeout(async () => {
                    startCommands.forEach(async c => {
                        const load = await exec(c[0])
                    })
                }, (duration / 30 - 25) * 1000)
                setTimeout(async () => {
                    startCommands.forEach(async c => {
                        const run = await exec(c[1])
                    })
                }, (duration / 30 - 10) * 1000);
            }, 5000);
        } else {
            await exec(runCommand);
		setTimeout(async () => {
                    startCommands.forEach(async c => {
                        const load = await exec(c[0])
                    })
                }, ((duration / 30) - 25) * 1000)
                setTimeout(async () => {
                    startCommands.forEach(async c => {
                        const load = await exec(c[1])
                    })
                }, 5000);
        }

        return "Successfully handled playlist.";
    } catch (err) {
        console.log(`Error occurred while handling playlist: `, err);
        return null;
    }
}

/**
 * loadRunPres command (Unrecommended)
 * 
 * @param {string} flavor - The flavor/theme name (excluding .xml and SD for JR units) on the i2
 * @param {number} duration - The duration of the playlist in seconds
 * @param {string} id - Playlist ID (ex. ldl3, 4, sidebar2)
 * @param {string|null} tag - Optional, TAG used for LOT8s backgrounds
 * @returns {Promise<string|null>} - Returns command output if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.playlistManager.loadRunPres("domestic/Azul", 1800, "4", null); // This sends a request to the i2 for a 60s Azul with pid 4.
 * console.log(command);  // Output will be the command output or `null` if there is an error.
 */
async function loadRunPres(flavor, duration, id, tag) {
    const command = `loadRunPres("Flavor=${flavor},Duration=${duration},PresentationId=${id}${(tag != null&&tag!==0) ? `,Logo=${tag}` : ""})`
    const loadRun = await exec(command)
    return loadRun;
}

/**
 * loadPres command (loads, not runs)
 * 
 * @param {string} flavor - The flavor/theme name (excluding .xml and SD for JR units) on the i2
 * @param {number} duration - The duration of the playlist in seconds
 * @param {string} id - Playlist ID (ex. ldl3, 4, sidebar2)
 * @param {string|null} tag - Optional, TAG used for LOT8s backgrounds
 * @returns {Promise<string|null>} - Returns command output if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.playlistManager.loadPres("domestic/Azul", 1800, "4", null); // This sends a request to the i2 for a 60s Azul with pid 4.
 * console.log(command);  // Output will be the command output or `null` if there is an error.
 */
async function loadPres(flavor, duration, id, tag) {
    const command = `loadPres("Flavor=${flavor},Duration=${duration},PresentationId=${id}${(tag != null&&tag!==0) ? `,Logo=${tag}` : ""}")`
    const load = await exec(command)
    return load;
}

/**
 * runPres command (runs only loaded playlists, not generates)
 * 
 * @param {string} id - The presentation id (ex. ldl3)
 * @param {string|null} startTime - The start time in i2 format
 * @returns {Promise<string|null>} - Returns command output if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.playlistManager.runPres(4); // Run playlist id 4
 * console.log(command);  // Output will be the command output or `null` if there is an error.
 */
async function runPres(id, startTime) {
    const command = `runPres("PresentationId=${id}${(startTime !== null && startTime !== undefined) ? `,StartTime=${startTime}` :""}")`
    const run = await exec(command)
    return run;
}

/**
 * runPres command (runs only loaded playlists, not generates)
 * 
 * @param {string} id - The presentation id (ex. ldl3)
 * @param {string|null} startTime - The start time in i2 format
 * @returns {Promise<string|null>} - Returns command output if successful, returns `null` if fails.
 * 
 * @example
 * // Require module
 * const i2 = require('i2.js');
 * 
 * const command = await i2.playlistManager.cancelPres(4); // Cancel playlist id 4
 * console.log(command);  // Output will be the command output or `null` if there is an error.
 */
async function cancelPres(id, startTime) {
    const command = `cancelPres("PresentationId=${id}${(startTime !== null && startTime !== undefined) ? `,StartTime=${startTime}` :""}")`
    const run = await exec(command)
    return run;
}

module.exports = {handlePlaylist,loadRunPres,loadPres,runPres,cancelPres,formatStart};

