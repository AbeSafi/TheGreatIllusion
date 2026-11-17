// ----- SAVE SYSTEM ----- //

function deepJSONStringify(data) {
	return JSON.parse(JSON.stringify(data));
}

// Items //
function serializeItem(item) {
    if (!item) return null; // If empty slot, return empty slot (null)

		// Grab item
    const template = allItems[item.templateKey];
    const delta = {};

		// Only save changed data, save into delta
    for (const field of ["isPrepared", "amount", "equipped", "defense"]) {
        if (item[field] !== undefined && item[field] !== template[field]) {
            delta[field] = item[field];
        }
    }

    return { uid: item.uid, key: item.templateKey, delta };
}

function deserializeItem(entry, uidMap) {
	if (!entry) return null; // If empty slot, return empty slot (null)

	const item = allItems[entry.key].dup(); // Clone item
	item.uid = entry.uid; // Store saved uid into item
	Object.assign(item, entry.delta);  // Apply the saved data in delta
	uidMap[entry.uid] = item;  // Register the item

	return item;
}

// Player //
function serializePlayer(player) {
	return {
		name: player.name,
		equippedWeapon: player.equippedWeapon ? player.equippedWeapon.uid : null,
		armor: player.armor,
		respawnLocation: player.respawnLocation,
		skills: [...player.skills],
		inventory: player.inventory.map(serializeItem),
		preparedItems: player.preparedItems.map(item => item ? item.uid : null),
		playerStatus: player.playerStatus.map(status => ({
			name: status.name,
			duration: status.duration,
			source: status.source ? status.source.uid : null,
		}))
	};
}

function deserializePlayer(data, uidMap) {
	const player = new PlayerClass(data.name, null);

	player.inventory = data.inventory.map(entry => deserializeItem(entry, uidMap));
	player.preparedItems = data.preparedItems
		.map(uid => uid ? uidMap[uid] : null)
		.filter(x => x);
	player.equippedWeapon = data.equippedWeapon ? uidMap[data.equippedWeapon] : null;
	player.armor = data.armor;
	player.respawnLocation = data.respawnLocation;
	player.skills = [...data.skills];
	player.playerStatus = data.playerStatus.map(status => ({
		name: status.name,
		duration: status.duration,
		source: status.source ? uidMap[status.source] : null
	}));

	return player;
}

// Enemies //

function serializeHostileLocs() {
	return { ... hostileLocs };
}

function deserializeHostileLocs(data) {
	for (const key in hostileLocs) delete hostileLocs[key];
	Object.assign(hostileLocs, data);
}

function serializeHostileLocsVersion() {
	return hostileLocsVersion;
}

function deserializeHostileLocsVersion(data) {
	hostileLocsVersion = data;
}

function serializeEnemyRewardsMap() {
	return deepJSONStringify(enemyRewardsMap);
}

function deserializeEnemyRewardsMap(data) {
    for (const key in enemyRewardsMap) delete enemyRewardsMap[key];
    Object.assign(enemyRewardsMap, data);
}

// Memories //

function serializeMemoryStates() {
    return deepJSONStringify(State.variables.memoryStates);
}

function deserializeMemoryStates(data) {
    State.variables.memoryStates = data;
}

// Map //

function serializeLootSpawnChart() {
    return lootSpawnChart.map(entry => ({ ...entry }));
}

function deserializeLootSpawnChart(data) {
    lootSpawnChart.length = 0;
    lootSpawnChart.push(...data.map(entry => ({ ...entry })));
}

function serializeMapRegions() {
	const out = {};
	
	// Walk through every map
	for (const mapName in mapRegions) {
		const map = mapRegions[mapName];
		if (!map) continue; // Skip null map

		// Walk through every region per map
		out[mapName] = {};
		for (const regionName in map) {
			out[mapName][regionName] = {
				neighbors: [...map[regionName].neighbors] // Store neighbor data for regions
			};
		}
	}

	return out;
}

function deserializeMapRegions(data) {
	// Walk through very map
	for (const mapName in data) {
		const map = mapRegions[mapName];
		if (!map) continue; // Skip null map

		// Walk through every region per map
		for (const regionName in data[mapName]) {
			const region = map[regionName];
			if (!region) continue;
			
			
			region.neighbors.length = 0; // Remove old neighbor data
			region.neighbors.push(...data[mapName][regionName].neighbors); // Replace with saved data
		}
	}
}

// NPCs ///

function mergeFlags(target, source) {
	for (const key in source) {
		const sourceValue = source[key];
		const targetValue = target[key];
		
		// If the source is an array
		if (Array.isArray(sourceValue)) {
			target[key] = [...sourceValue];
		}
		// If both values are objects
		else if (sourceValue 
						 && typeof sourceValue === "object"
						 && targetValue
						 && typeof targetValue === "object"
						 && !Array.isArray(targetValue)) {

      mergeFlags(targetValue, sourceValue); // merge their nested values
		}
		else {
			target[key] = sourceValue;
		}
	}
}

function serializeNPCs() {
	const out = {};
	
	// Walk through every npc
	for (const npcId in NPCs) {
		const npc = NPCs[npcId];

		// Store name, currDialogue, and all flags
		out[npcId] = {
			name: npc.name,
			currDialogue: npc.currDialogue,
			flags: deepJSONStringify(npc.flags),
		};
	}

	return out;
}

function deserializeNPCs(data) {
	for (const npcId in data) {
		const npc = NPCs[npcId];
		/* Skip npc if null. Not needed now but
		it's future proofing incase I change something about the code. */
		if (!npc) continue;

		// Get saved NPC data, add to current game session
		const saved = data[npcId];
		npc.name = saved.name;
		npc.currDialogue = saved.currDialogue;
		mergeFlags(npc.flags, saved.flags);
	}
}

// Interactives //

function serializeUnclaimed(unclaimed) {
	const out = {};

	// Walk through each unclaimed reward
	for (const passage in unclaimed) {
		out[passage] = [...unclaimed[passage]]; // Place unclaimed rewards into data
	}

	return out;
}

function deserializeUnclaimed(data) {
    const out = {};

		// Walk through each unclaimed reward
    for (const passage in data) {
        out[passage] = new Set(data[passage]); // Place saved unclaimed rewards into game
    }
    return out;
}

/* 
It's done this way because each interactive is unique, 
I didn't think to store the mutable data in a 'flags' object soon enough.*/
function serializeInteractives() {
	return {
		LockedBasicChest: {
			locations: deepJSONStringify(interactives.LockedBasicChest.locations)
		},
		ExitDoor: {
			locations: deepJSONStringify(interactives.ExitDoor.locations)
		},
		EssencePillar: {
			locations: deepJSONStringify(interactives.EssencePillar.locations),
			rewards: deepJSONStringify(interactives.EssencePillar.rewards)
		},
		ShipWheel: {
			locations: deepJSONStringify(interactives.ShipWheel.locations),
			stageTwoComplete: deepJSONStringify(interactives.ShipWheel.stageTwoComplete)
		},
		ShipWheel2: {
			locations: deepJSONStringify(interactives.ShipWheel2.locations)
		},
		LockedPirateChest: {
			locations: deepJSONStringify(interactives.LockedPirateChest.locations),
			rewards: deepJSONStringify(interactives.LockedPirateChest.rewards)
		},
		ItemPickup: {
			locations: deepJSONStringify(interactives.ItemPickup.locations),
			rewards: deepJSONStringify(interactives.ItemPickup.rewards)
		},
		FinalPillar: {
			locations: deepJSONStringify(interactives.FinalPillar.locations)
		},
		Brazier: {
			locations: deepJSONStringify(interactives.Brazier.locations),
			unclaimed: serializeUnclaimed(interactives.Brazier.unclaimed)
		},
		redemptionPillars: {
			locations: deepJSONStringify(interactives.redemptionPillars.locations),
			activated: interactives.redemptionPillars.activated
		}
	}; 
}

/* See serialized function for why its implemented this way */
function deserializeInteractives(data) {
    if (data.LockedBasicChest) {
        interactives.LockedBasicChest.locations = deepJSONStringify(data.LockedBasicChest.locations);
    }
    if (data.ExitDoor) {
        interactives.ExitDoor.locations = deepJSONStringify(data.ExitDoor.locations);
    }
    if (data.EssencePillar) {
        interactives.EssencePillar.locations = deepJSONStringify(data.EssencePillar.locations);
        interactives.EssencePillar.rewards   = deepJSONStringify(data.EssencePillar.rewards);
    }
    if (data.ShipWheel) {
        interactives.ShipWheel.locations = deepJSONStringify(data.ShipWheel.locations);
        interactives.ShipWheel.stageTwoComplete = data.ShipWheel.stageTwoComplete;
    }
    if (data.ShipWheel2) {
        interactives.ShipWheel2.locations = deepJSONStringify(data.ShipWheel2.locations);
    }
    if (data.LockedPirateChest) {
        interactives.LockedPirateChest.locations = deepJSONStringify(data.LockedPirateChest.locations);
        interactives.LockedPirateChest.rewards   = deepJSONStringify(data.LockedPirateChest.rewards);
    }
    if (data.ItemPickup) {
        interactives.ItemPickup.locations = deepJSONStringify(data.ItemPickup.locations);
        interactives.ItemPickup.rewards   = deepJSONStringify(data.ItemPickup.rewards);
    }
    if (data.FinalPillar) {
        interactives.FinalPillar.locations = deepJSONStringify(data.FinalPillar.locations);
    }
    if (data.Brazier) {
        interactives.Brazier.locations = deepJSONStringify(data.Brazier.locations);
        interactives.Brazier.unclaimed = deserializeUnclaimed(data.Brazier.unclaimed);
    }
    if (data.redemptionPillars) {
        interactives.redemptionPillars.locations = deepJSONStringify(data.redemptionPillars.locations);
        interactives.redemptionPillars.activated = data.redemptionPillars.activated;
    }

    interactives.ShipWheel.outerContainerRef = null;
}

// Quest Log //

function serializeQuestLog() {
	return {
		finished: deepJSONStringify(questLogAPI.logFinished),
		unfinished: deepJSONStringify(questLogAPI.logUnfinished),
	}; 
}

function deserializeQuestLog(data) {
	questLogAPI.replaceQuestLog(data.finished, data.unfinished);
}

// Twine Variables //

const EXCLUDED_TWINE_VARS = new Set([
	// Already saved 
	"player",           
	"memoryStates",      
	"steps",             
	"wheelActive",       
	"wheelRotNum",       
	"caveOpen",         

	// Never should be saved, should be reset per-load (Transient)
	"currentCombat",
	"currentEnemy",      
	"combatLocation",    
	"activeNPC",         
	"dialogueLocation",  
	"gameState",         
	"currentMap",        
	"playerPos",
	"currentScene",

	// Never used, but I'm scared to delete and cause problems
	"respawnLocation", 
]);

function serializeTwineVars() {
	const out = {};
	
	// Walk through all state variables
	for (const key in State.variables) {
		if (EXCLUDED_TWINE_VARS.has(key)) continue; // Skip if its on blacklist

		const value = State.variables[key];

		if (value === undefined) continue;
		if (typeof value === "function") continue;

		out[key] = deepJSONStringify(value); // Save twine var
	}

	return out;
}

function deserializeTwineVars(data) {
	for (const key in State.variables) {
		if (EXCLUDED_TWINE_VARS.has(key)) continue; // Skip if its on blacklist
		delete State.variables[key];
	}

	for (const key in data) {
		State.variables[key] = deepJSONStringify(data[key]); // Restore saved vars
	}
}

// Save Aggregators //

function createSaveData() {
	return {
		player: serializePlayer(State.variables.player),
		steps: State.variables.steps,
		memoryStates: serializeMemoryStates(),
		wheelActive: State.variables.wheelActive,
		wheelRotNum: State.variables.wheelRotNum,
		caveOpen: State.variables.caveOpen,
		questLog: serializeQuestLog(),
		hostileLocs: serializeHostileLocs(),
		hostileLocsVersion: serializeHostileLocsVersion(),
		enemyRewardsMap: serializeEnemyRewardsMap(),
		lootSpawnChart: serializeLootSpawnChart(),
		mapRegions: serializeMapRegions(),
		NPCs: serializeNPCs(),
		interactives: serializeInteractives(),
		twineVars: serializeTwineVars()
	}
}



function loadSaveData(data) {
	const uidMap = {};
	// Load player data
	State.variables.player = deserializePlayer(data.player, uidMap);
	UIBar.stow();

	// Update nextItemUid based on items in player's inventory
	_nextItemUid = Math.max(
		...Object.keys(uidMap).map(u => parseInt(u.slice(1)) + 1),
		0
	);

	State.variables.steps = data.steps;
	deserializeMemoryStates(data.memoryStates);
	State.variables.wheelActive = data.wheelActive;
	State.variables.wheelRotNum = data.wheelRotNum;
	State.variables.caveOpen = data.caveOpen;

	deserializeQuestLog(data.questLog)
	deserializeHostileLocs(data.hostileLocs);
	deserializeHostileLocsVersion(data.hostileLocsVersion)
	deserializeEnemyRewardsMap(data.enemyRewardsMap);
	deserializeLootSpawnChart(data.lootSpawnChart);
	deserializeMapRegions(data.mapRegions);
	deserializeNPCs(data.NPCs);
	deserializeInteractives(data.interactives);
	
	deserializeTwineVars(data.twineVars);

	State.variables.currentCombat = null;
	State.variables.currentEnemy = null;
	State.variables.combatLocation = "";
	State.variables.activeNPC = "";
	State.variables.dialogueLocation = "";
	State.variables.gameState = "default";

	const mapAndPosition = getMapAndPosition(State.variables.player.respawnLocation);
	if (mapAndPosition) {
		State.variables.currentMap = mapAndPosition.map;
		State.variables.playerPos = mapAndPosition.position;
	}
	else {
		console.warn("Player location not found! Rerouting to starting location.")
		State.variables.currentMap = "Palm";
		State.variables.playerPos = {x: 2, y: 8};
	}

	return State.variables.player.respawnLocation;
}

function exportSave() {
	if (!State.variables.player) {
		UI.alert("No game in progress!");
		return;
	}

	try {
		const saveData = createSaveData();
		const jsonText = JSON.stringify(saveData, null, 2);

		const blob = new Blob([jsonText], {type: "application/json"});
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = generateSaveFile();
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		setTimeout(() => URL.revokeObjectURL(url), 1000);

		console.log("Save downloaded", link.download);
	} catch (err) {
		console.error("Export failed:", err);
		UI.alert("Failed to download save:\n" + err.message);
	}
}

function importSave() {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json,application/json";

	input.addEventListener("change", (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
			let parsed;
			try {
				parsed = JSON.parse(ev.target.result);
			} catch (err) {
				UI.alert("Not a valid save.")
				console.error("Json parse failed:", err);
				return;
			}

			try {
				validateSaveShape(parsed);
			} catch (err) {
				UI.alert("Save file missing required data:\n" + err.message);
				console.error("Save validation failled:", err);
				return;
			}

			if (State.variables.player && !window.confirm(
				"Destroy current progress and load save?",
				"Load Save"
			)) return;

			try {
				const targetPassage = loadSaveData(parsed);
				Engine.play(targetPassage);
			} catch (err) {
				console.error("Load failed:", err);
				UI.alert(
					"Issue when loading save file. Game state may be inconsistent."
				);
			}
		}

		reader.onerror = () => {
			UI.alert("Failed to read file");
		}

		reader.readAsText(file);
	});

	input.click();
}

function generateSaveFile() {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
                  `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const playerName = (State.variables.player?.name || "Unknown")
			.replace(/[^a-zA-Z0-9_-]/g, "");  // strip anything OS-unfriendly
    return `TheGreatIllusion_${playerName}_${stamp}.json`;
}

function validateSaveShape(data) {
    if (!data || typeof data !== "object") {
			throw new Error("Save file root is not an object.");
    }

    const requiredTopLevel = [
			"player", "memoryStates",
			"hostileLocs", "enemyRewardsMap", "lootSpawnChart",
			"mapRegions", "NPCs", "interactives", "twineVars",
    ];

    for (const key of requiredTopLevel) {
			if (data[key] === undefined) {
				throw new Error(`Missing required section: "${key}"`);
			}
    }

    if (!data.player || typeof data.player !== "object") {
			throw new Error('Section "player" is malformed.');
    }

    if (!Array.isArray(data.player.inventory)) {
			throw new Error('Player inventory is not an array.');
    }
}

function restartGame() {
    if (!window.confirm("Delete all autosaved data? Go back and manually save if you want to keep your data.")) return;
		clearAutosave();
    Engine.restart();
}

// Autosaving functionality // (Looking at you Munzir, wouldn't have to exist if you weren't such an ipad kid)

const AUTOSAVE_KEY = "TheGreatIllusion_autosave";

function writeAutosave(customKey) {
	if (!State.variables.player) return;
	try {
		const jsonText = JSON.stringify(createSaveData());
		localStorage.setItem(customKey ?? AUTOSAVE_KEY, jsonText);
	} catch (err) {
		console.warn("Autosave failed:", err);
	}
}

function readAutosave(customKey) {
	try {
		const raw = localStorage.getItem(customKey ?? AUTOSAVE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch (err) {
		console.warn("Could not read autosave:", err);
		return null;
	}
}

function clearAutosave(customKey) {
	try {
		localStorage.removeItem(customKey ?? AUTOSAVE_KEY);
	} catch (err) {}
}

function loadAutosave(customKey) {
	const data = readAutosave(customKey);
	if (!data) {return;}

	try {
		validateSaveShape(data);
		const targetPassage = loadSaveData(data);
		Engine.play(targetPassage);
	} catch (err) {
		console.error("Autosave load failed:", err);
		UI.alert("Autosave is corrupted.");
	}
}

function hasAutosave(customKey) {
	return !!readAutosave(customKey);
}

setup.exportSave = exportSave;
setup.importSave = importSave;
setup.restartGame = restartGame;
setup.loadAutosave = loadAutosave;
setup.hasAutosave  = hasAutosave;