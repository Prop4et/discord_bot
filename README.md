## **Bot for playing music on discord**

### **Queue operations**
The queue is deleted only when the bot is disconnected from the channel, when the delete command is issued.
Elements are removed from the queue after being completely played, skipped or deleted
When elements are removed the queue shifts of a position from the deleted element, so after removing a show command is used to display the new order of the elements
- [ ] Add, enqueue track
- [ ] Remove, removes a track from the queue given its place inside the queue
- [ ] Show, shows the elements in order inside the queue
- [ ] Shuffle, changes the order inside the queue in a pseudo random way
- [ ] Delete, deletes the whole queue
- [ ] Skip, reproduces the next track in the queue

### **Single song operations**
- [ ] Play, reproduce given track. 
    - [x] If the bot is not connected in the channel where the user is and the bot is not in use then the bot connects to the channel.
    - [x] If the track is not inside the queue and the queue is empty it is added to the queue and immediately reproduced.
    - [ ] If there is an existing queue it is deleted and a new one is created with this track as the first element. 
- [ ] Pause, blocks the track at the current time a start operation restarts from the time at which the song was paused. If the song is paused for more than a minute the bot disconnects
- [ ] Stop, blocks the track and goes back at the beginning a start operation restarts the song from the beginning. If the song is stopped for more than a minute the bot disconnects
- [ ] Restart, stop + play in a single command
- [ ] Forward, forwards a number of seconds in the track
- [ ] Backward, backwards a number of seconds in the track
### **Bot operations**
The bot automatically disconnects if it isn't playing any track for a minute after a connect operation
- [x] Connect, connects to a voice channel
- [x] Disconnect, disconnects from a voice channel