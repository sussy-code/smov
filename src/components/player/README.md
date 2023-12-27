# Video player component

Video player is quite a complex component, so here is a rundown of all the parts

# Composable parts
These parts can be used to build any shape of a video player.
 - `/atoms`- any ui element that controls the player. (Seekbar, Pause button, quality selection, etc)
 - `/base` - base components that are used to build a player. Like the main container

# internal parts
These parts are internally used, they aren't exported. Do not use them outside of player internals.

### `/display`
The display interface, abstraction on how to actually play the content (e.g Video element, chrome casting, etc)
 - It must be completely separate from any react code
 - It must not interact with state, pass async data back with events

### `/internals`
Internal components that are always rendered on every player.
 - Only components that are always present on the player instance, they must never unmount

### `/utils`
miscellaneous logic, put anything that is unique to the video player internals.

### `/hooks`
Hooks only used for video player.
 - only exception is usePlayer, as its used outside of the player to control the player

### `~/src/stores/player`
State for the video player.
 - Only parts related to the video player may utilize the state
