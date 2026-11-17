function isEndingReady() {
	const orbList = ["Mem_Sldr", "Mem_Prt", "Mem_Cwd"]
	
	for (const orb of orbList) {
		if (findItemInInventory(orb) <= -1) return false;
	}

	return true;
}

function getEndingState() {
	const memoryList = ["Mem_Cwd", "Mem_Gnrl", "Mem_Prt", "Mem_Sldr"]

	for (const memory of memoryList) {
		const memoryStates = State.variables.memoryStates.memories;
		if (memoryStates[memory] <= -1) return "Merchant";
	}

	return "Hunter";
}

let endingReadyHolder = false;


$(document).on(":passageend", () => {
    const p = State.variables.player;
    if (!p) return;

		// Exists because twine likes breaking my references ---

    // Rebuild uid map from current inventory since twine likes breaking this
    const byUid = {};
    for (const item of p.inventory) {
			if (item) byUid[item.uid] = item;
    }

    // Relink equipped weapon to slot 6 since twine likes breaking this
    p.equippedWeapon = p.inventory[6] || null;

    // Relink prepared items by uid since twine likes breaking this
    p.preparedItems = p.preparedItems
			.map(item => item ? byUid[item.uid] : null)
			.filter(x => x);

    // Relink status sources by uid since twine likes breaking this
    for (const status of p.playerStatus) {
			if (status.source && byUid[status.source.uid]) {
				status.source = byUid[status.source.uid];
			}
    }

		// ---

		createQuestLogUI();

		if (State.variables.openingFinished && passage() != "CombatScreen" && passage() != "DialogueScreen") writeAutosave();

		if ((!isEndingReady() && !endingReadyHolder) || !State.variables.player) return;

		if (!endingReadyHolder) {
			UI.alert(`A trumpet bellows throughout the land from the center island!`);
			questLogAPI.addToQuestLog("end_game", "A very large trumpet sound blew its way from the center island.");
			endingReadyHolder = true;
		}
		else if (!isEndingReady() && passage().includes(State.variables.currentMap)) {
			endingReadyHolder = false;
		}
});

$(window).on('beforeunload', function() {
	if (State.variables.openingFinished && passage() != "CombatScreen" && passage() != "DialogueScreen") writeAutosave();
});

Macro.add('resetGeneralDeathState', {
	handler: function() {
		loadAutosave("TheGreatIllusion_BeforeViselliDeath");
	}
});

setup.getNPCVal = function(NPCName, type, variable=false) {
	const NPC = NPCs[NPCName];

	switch(type) {
		case "flag":
			return NPC.flags[variable];
		case "name":
			return NPC.getName?.(NPC, variable) ?? NPC.name;
	}

	return null;
}

setup.isEndingReady = isEndingReady;

setup.getPlayerVal = function(type, attribute) {
	const player = State.variables.player;

	switch(type) {
		case "inventory":
			const item = allItems[attribute];
			
			return player.inventory?.some(invItem => invItem?.name === item.name) || false;
		case "hostiles":
			return !!hostileLocs[attribute];
		case "getEnding":
			const context = interactives["FinalPillar"].locations;
			const endingCheck = context["IndexPillar"][0] && context["MiddlePillar"][0] && context["RingPillar"][0] && context["PinkyPillar"][0];

			if (endingCheck) return getEndingState();
			
			return null;
	}
}