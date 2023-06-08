const cst = {
    // Default config
    config: {
        deaf                : true,
        defaultVolume       : 80,
        maxVolume           : 100,
        autoLeave           : true,
        autoLeaveCD   : 5000,
        displayVoiceState   : true,
    },
    ytdlOptions: {
        filter          : 'audioonly',
        quality         : 'highestaudio',
        highWaterMark   : 1 << 27
    }
};

module.exports = cst;