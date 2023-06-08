const cst = {
    // Default config
    config: {
        deaf                : true,
        defaultVolume       : 50,
        maxVolume           : 100,
        autoLeave           : true,
        autoLeaveCD         : 30000,
        displayVoiceState   : true,
    },
    ytdlOptions: {
        filter          : 'audioonly',
        quality         : 'highestaudio',
        highWaterMark   : 1 << 27
    }
};

module.exports = cst;