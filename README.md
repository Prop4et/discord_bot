## **Bot for playing music on discord**

### **Queue operations**
The queue is deleted only when the bot is disconnected from the channel, when the delete command is issued.
Elements are removed from the queue after being completely played, skipped or deleted
When elements are removed the queue shifts of a position from the deleted element, so after removing a show command is used to display the new order of the elements
- [ ] Remove, removes a track from the queue given its place inside the queue
- [x] Show, shows the elements in order inside the queue, TODO: show the whole queue
- [x] Shuffle, changes the order inside the queue in a pseudo random way
- [ ] Delete, deletes the whole queue

### **Single song operations**
- [x] Play, reproduce given track. 
    - [x] If the bot is not connected in the channel where the user is and the bot is not in use then the bot connects to the channel.
    - [x] If the track is not inside the queue it is added to the queue and reproduced following the queue order.
- [x] Pause, blocks the track at the current time a start operation restarts from the time at which the song was paused. If the song is paused for more than 5 minutes the bot 
disconnects
- [x] Resume, resumes the song from when it was paused
- [x] Skip, goes to the next track, if any
- [ ] Stop, blocks the track and goes back at the beginning a start operation restarts the song from the beginning. If the song is stopped for more than 5 minutes the bot disconnects (TBD)
- [ ] Restart, stop + play in a single command
- [x] Forward, forwards a number of seconds in the track, automatically resumes to play
- [x] Backward, backwards a number of seconds in the track, automatically resumes to play
### **Bot operations**
The bot automatically disconnects if it isn't playing any track for a minute after a connect operation
- [x] Connect, connects to a voice channel
- [x] Disconnect, disconnects from a voice channel