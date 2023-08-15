# Video player component

Video player is quite a complex component, so here is a rundown of all the parts

# Composable parts
These parts can be used to build any shape of a video player.
 - `/atoms`- any ui element that controls the player. (Seekbar, Pause button, quality selection, etc)
 - `/base` - base components that are used to build a player. Like the main container

# internal parts
These parts are internally used, they aren't exported. Do not use them outside of player internals.
- `/display` - display interface, abstraction on how to actually play the content (e.g Video element, HLS player, Standard video element, etc)
- `/internals` - Internal components that are always rendered on every player.
- `/utils` - miscellaneous logic
- `/hooks` - hooks only used for video player
- `~/src/stores/player` - state for the video player. Should only be used by internal parts
