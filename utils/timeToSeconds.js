const timeToSeconds = (time) =>{
    const timeString = time.toLowerCase();
    let hrs = 0, mins = 0, secs = 0;

    if(/^\d+$/.test(timeString)){
        seconds = parseInt(timeString);
    }
    else if (/^\d+:\d+(\:\d+)?$/.test(timeString)) {
        const timeParts = timeString.split(":");
        const numParts = timeParts.length;

        if (numParts === 2) {
            mins = parseInt(timeParts[0]);
            secs = parseInt(timeParts[1]);
        } else if (numParts === 3) {
            hrs = parseInt(timeParts[0]);
            mins = parseInt(timeParts[1]);
            secs = parseInt(timeParts[2]);
        }
    }
    else {
        const regex = /(\d+)\s*(h|m|s)/g;
        let match;
        let valid = false; // Flag to track if any valid match is found

        while ((match = regex.exec(timeString)) !== null) {
            const value = parseInt(match[1]);

            if (match[2] === 'h') {
                hrs = value;
                valid = true;
            }
            else if (match[2] === 'm') {
                mins = value;
                valid = true;
            }
            else if (match[2] === 's') {
                secs = value;
                valid = true;
            }
        }

        // If no valid match is found, return false
        if (!valid) {
            return false;
        }
    }


    const totalSeconds = hrs * 3600 + mins * 60 + secs;
    return totalSeconds;
}

module.exports.timeToSeconds = timeToSeconds;