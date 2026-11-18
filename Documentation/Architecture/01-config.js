// Previously held path of the images used in the game for testing. Emptied out after it became unnecessary.
setup.imageBase = "";

// Overriding the games default save features, I'm implementing a custom save system.
Config.saves.isAllowed = function() { return false; };

// Config.history exists as part of the default save system. "Disabled" so it doesn't cause problems with the custom save system.
Config.history.controls = false; 
Config.history.maxStates = 1;

// No longer needed to enable/disable debug mode, that is handled by a macro now.
let debugMode = false;