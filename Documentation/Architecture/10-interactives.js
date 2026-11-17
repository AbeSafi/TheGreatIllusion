const interactives = {
	"LockedBasicChest": {
		locations: {"Gym_0_1": true},
		key: "StandardUnlock",
		unlockChest: function(context, index) {
			
			const link = createLink('unlocked chest', () => {
				const player = State.variables.player;
				const success = addItemToInventory("exitKey");
				const self = this;

				if (success >= 0) {
					const itemIdx = (index !== -1) ? index : player.inventory.findIndex(item => item.effect == "StandardUnlock");
					context.textContent = 'Key picked up.';
					if (itemIdx !== -1) player.inventory[itemIdx] = null;
					self.locations = self.locations[passage()] = false;
				}
				else {
					link.textContent = `Inventory Full. Make some space and try again.`;
				}
			});
		
			context.innerHTML = '';
			new Wikifier(context, `Successfully `);
			context.appendChild(link);
			context.appendChild(document.createTextNode('!'));
		},
		attemptUse: function(item, index, context) {
			const container = context.container;

				if (item.effect == this.key || !this.needItem) {
						this.locations[passage()][0] = false;
						this.unlockChest(container, index);
				}
				else {
					UI.alert(`${item.name} doesn't do anything`);
				}

				return false;
		},
		attemptInteract: function(container) {
			this.unlockChest(container, -1);
		}
	},
	"ExitDoor": {
		locations: {"Dgn3": true},
		key: "ExitDemo",
		attemptUse: function(item, _1, _2) {
			if (item.effect == this.key || this.status) {
					Engine.play("DebugGym");
			}
			else {
				UI.alert(`${item.name} doesn't do anything`);
			}

			return false;
		}
	},
	"EssencePillar": {
		locations: {
			"OldHouse1": [false, "Mem_MD"],
			"OldHouse2": [false, "Mem_Dg"],
			"OldHouse3": [false, "Mem_Cwd"],
			"WatchTower": [false, "Mem_Fr"],
			"Colosseum": [false, "Mem_Ppl"],
			"CourtRoom": [false, "Mem_Jge"],
			"Gallows": [false, "Mem_Vctm"],
			"Moose": [false, "Mem_Mse"],
			"Bodies": [false, "Mem_Bds"],
			"Thumb_0_7": [false, "Mem_Chld"],
			"Index_9_0": [false, "Mem_Grd"]
		},
		rewards: {
			"Mem_MD" : [],
			"Mem_Dg": [],
			"Mem_Cwd": ["Mem_Cwd"],
			"Mem_Fr": [],
			"Mem_Ppl": [],
			"Mem_Jge": [],
			"Mem_Vctm": [],
			"Mem_Mse": [],
			"Mem_Bds": [],
			"Mem_Chld": [],
			"Mem_Grd": []
		},
		runPreliminaryLogic: function(action="add") {
			const currLocation = this.locations[passage()];
			console.log(currLocation);
			if (!currLocation) return;

			const pillarDescriptions = {
				"OldHouse1": `${State.variables.player.name} found a pillar in the basement of a ruined house.`,
				"OldHouse2": `${State.variables.player.name} found a second pillar in the basement of a ruined house.`,
				"WatchTower": `${State.variables.player.name} found a pillar at the top of a watchtower.`,
				"Colosseum": `${State.variables.player.name} found a pillar in the center of a colosseum.`,
				"CourtRoom": `${State.variables.player.name} found a pillar inside of a court room.`,
				"Gallows": `${State.variables.player.name} found a pillar hung in a gallow site.`,
				"Moose": `${State.variables.player.name} found a pillar in a barren segment of land.`,
				"Bodies": `${State.variables.player.name} found a second pillar in a barren segment of land.`,
				"Thumb_0_7": `${State.variables.player.name} found a pillar wrapped in the arms of a child's corpse.`
			}
			const currPillarText = pillarDescriptions[passage()]

			console.log(currPillarText);
			if (!currPillarText) return;
			
			if (action == "add") questLogAPI.addToQuestLog(passage(), currPillarText);
			else questLogAPI.removeFromQuestLog(passage());
		},
		giveRewards: function(item, container) {
			const player = State.variables.player;
			const inventory = player.inventory;
			let rewardList = this.rewards[item];
			
			for (let i = 0; i < rewardList.length; ++i) {
				if (rewardList[i] == null) continue;
				
				const currIndex = i;

				const rewardLink = createLink(`An @{item} lays beside the pillar.`, (_, textElem, linkElem) => {
					const given = addItemToInventory(rewardList[currIndex]);

					if (given === -1) {
						linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
						textElem.innerHTML = "";
						textElem.appendChild(linkElem);
						return;
					}

					disableLink(linkElem);
					textElem.innerHTML = `${player.name} picked up ${inventory[given].name}`;
					rewardList[currIndex] = null;
				});

				container.appendChild(rewardLink);
				container.appendChild(document.createElement('br'));
			}
		},
		attemptUse: function(item, index, context) {
			const pillarContext = this.locations[passage()];
			
			if (item.effect == pillarContext[1]) {
				context.container.innerHTML = "";
				setMemoryStates(pillarContext[1], 1);
				
				pillarContext[0] = true;

				removeItemFromInventory(index);
				this.attemptInteract(context.container);
			}
			else {
				context.link.textContent = "There is only a silence. Nothing happens.";
				context.container.innerHTML = "";
				context.container.appendChild(context.link);
			}
		},
		attemptInteract: function(container) {
			const pillarContext = this.locations[passage()];

			const link = createLink(`The orb radiates a peaceful light, @{beckoning} ${State.variables.player.name} to place a hand on it.`, () => {
				const sceneName = passage() + "Scene";
				this.runPreliminaryLogic("remove");
				State.variables.currentScene = sceneName;
				Engine.play("SceneTransition");
			});
			
			container.appendChild(link);
			container.appendChild(document.createElement('br'));
			this.giveRewards(pillarContext[1], container);
		}
	},
	"ShipWheel": {
		locations: {
			"LightTower": [false, "GCEnergy"],
		},
		directions: {
			"WheelRot0": "north",
			"WheelRot1": "east",
			"WheelRot2": "south",
			"WheelRot3": "west"
		},
		stageTwoComplete: false,
		outerContainerRef: null,
		attemptUse: function(item, index, context) {
			const interactState = this.locations[passage()];

			if (interactState[1] !== item.effect){
				const failText = "The item doesn't fit, the wheel doesn't react.";

				context.link.textContent = failText;
				context.container.innerHTML = "";
				context.container.appendChild(document.createElement('br'));
				context.container.appendChild(context.link);
				context.container.appendChild(document.createElement('br'));
				context.container.appendChild(document.createElement('br'));

				return;
			}
			
			interactState[0] = true;
			State.variables.wheelActive = 1;
			State.variables.wheelRotNum = "WheelRot0";
			removeItemFromInventory(index);

			context.container.innerHTML = "";
			
			this.attemptInteract(context.container);
		},
		attemptInteract: function(container) {
			let innerContainer = $('#innerContainer');
			let containerExists = false;

			if (innerContainer.length === 0) {innerContainer = $('<span id="innerContainer"></span>')[0]}
			else {innerContainer = innerContainer[0]; containerExists = true; innerContainer.innerHTML = '';}
			this.outerContainerRef = container;
	
			const spokePos = this.directions[State.variables.wheelRotNum];
			let baseText = `The king spoke sways with life, pointing generally ${spokePos}. `;
			baseText += (this.stageTwoComplete) 
								  ? `Both green crystals infuse their energy into the rest of the wheel, glowing brilliantly.\n\n`
									: `A green glow weakly spreads from the crystal to the rest of the wheel, the second @{hole} remains distinctly dark.`;
			const fullText = (this.stageTwoComplete) ? baseText : `<<interaction "ShipWheel2">>` + baseText + `<</interaction>>\n`;

			const wheelLink = createLink(`@{Grab} the wheel.\n`, () => {
				Engine.play(State.variables.wheelRotNum);
			})

			$(innerContainer).wiki(fullText);
			innerContainer.appendChild(wheelLink);

			if (!containerExists) {
				container.appendChild(document.createElement('br'));
				container.appendChild(innerContainer);
				container.appendChild(document.createElement('br'));
			}
		}
	},
	"ShipWheel2": {
		locations: {
			"LightTower": [false, "GCEnergy"] //n interactionHelper
		},
		attemptUse: function(item, index, _context) {
			const interactState = this.locations[passage()];

			if (interactState[1] !== item.effect) return;

			removeItemFromInventory(index);

			State.variables.wheelActive = 2;
			interactState[0] = true;
			interactives.ShipWheel.stageTwoComplete = true;
			interactives.ShipWheel.attemptInteract(interactives.ShipWheel.outerContainerRef);
		}
	},
	"LockedPirateChest": {
		locations: {"Hole": [false, "prt_key"]},
		rewards: {
			"prt_key": ["Mem_Prt"]
		},
		giveRewards: function(item, container) {
			const player = State.variables.player;
			const inventory = player.inventory;
			let rewardList = this.rewards[item];
			
			for (let i = 0; i < rewardList.length; ++i) {
				if (rewardList[i] == null) continue;
				
				const currIndex = i;

				const rewardLink = createLink(`A @{memory} lays inside an open chest.`, (_, textElem, linkElem) => {
					const given = addItemToInventory(rewardList[currIndex]);

					if (given === -1) {
						linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
						textElem.innerHTML = "";
						textElem.appendChild(linkElem);
						return;
					}

					disableLink(linkElem);
					textElem.innerHTML = `${player.name} picked up ${inventory[given].name}`;
					rewardList[currIndex] = null;
					NPCs["Pirate"].flags.memoryFound = true;
					NPCs["General"].flags.infoData.giant_hole.value = 1;
				});

				container.appendChild(rewardLink);
				container.appendChild(document.createElement('br'));
			}
		},
		attemptUse: function(item, _index, context) {
			const interactState = this.locations[passage()];
			
			if (item.effect == interactState[1]) {
				this.attemptInteract(context.container);

				interactState[0] = true;
			}
			else {
				context.link.textContent = "It doesn't work. The chest is still locked firmly shut.";
				context.container.innerHTML = "";
				context.container.appendChild(context.link);
			}
		},
		attemptInteract: function(container) {
			const interactState = this.locations[passage()];

			container.innerHTML = "";
			this.giveRewards(interactState[1], container);
		}
	},
	"ItemPickup": {
		locations: {"Well": [true, "green orb"]},
		rewards: {
			"Well": "Mem_Cwd"
		},
		attemptInteract: function(container, bodyText) {
			const player = State.variables.player;
			const inventory = player.inventory;
			let item = this.rewards[passage()];

			if (item == null) {
				container.remove();
				return;
			}
			
			const rewardLink = createLink(bodyText, (_, textElem, linkElem) => {
				const given = addItemToInventory(item);

				if (given === -1) {
					linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
					textElem.innerHTML = "";
					textElem.appendChild(linkElem);
					return;
				}

				disableLink(linkElem);
				textElem.innerHTML = `${player.name} picked up ${inventory[given].name}`;
				this.rewards[passage()] = null;
			});

			container.appendChild(rewardLink);
			container.appendChild(document.createElement('br'));
		}
	},
	"FinalPillar": {
		locations: {
			"IndexPillar": [false, "Mem_Prt"],
			"MiddlePillar": [false, "Mem_Gnrl"],
			"RingPillar": [false, "Mem_Sldr"],
			"PinkyPillar": [false, "Mem_Cwd"]
		},
		flavorText: [
			`The orb fades into to a shade of white, before bleeding into a bright red within itself.\n`,
			`The orb fades into a shade of white, however soon returns to its green hue.\n`,
			`The orb fades into a shade of white. The dull color lingers before slowly... then rapidly shining into a bright glow.\n`
		],
		attemptUse: function(item, index, context) {
			const pillarContext = this.locations[passage()];
			
			if (item.effect == pillarContext[1]) {
				context.container.innerHTML = "";
				pillarContext[0] = true;
				
				State.variables.player.inventory[index] = null;

				removeItemFromInventory(index);

				this.attemptInteract(context.container);
			}
			else {
				const isOrb = item.templateKey.includes("orb") || item.templateKey.includes("Mem");
				context.link.textContent = (isOrb) ? "The orb doesn't fit properly into this slot, the pillar doesn't react." : "There is only a silence. Nothing happens.";
				context.container.innerHTML = "";
				context.container.appendChild(context.link);
			}
		},
		attemptInteract: function(container) {
			const pillarContext = this.locations[passage()];
			const state = State.variables.memoryStates.memories[pillarContext[1]];
			const orbText = this.flavorText[state+1];
			const player = State.variables.player
			
			const link = createLink("Remove the Orb", (_, textElem, linkElem) => {
				const given = addItemToInventory(pillarContext[1]);

				if (given === -1) {
					linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
					textElem.innerHTML = "";
					textElem.appendChild(linkElem);
					return;
				}

				pillarContext[0] = false;
				disableLink(linkElem);
				textElem.innerHTML = `${player.name} removes ${player.inventory[given].name} from the slot.`;
				container.innerHTML = "";
				$(container).wiki(`<<interaction "FinalPillar">>Place an item into the @{slot}.<</interaction>>`);
			});
			
			$(container).wiki(orbText);
			container.appendChild(link);
			container.appendChild(document.createElement('br'));
		}
	},
	"Brazier": {
		locations: {
			"Pinky_10_1": [false],
			"Pinky_2_2": [false],
			"MiddleRing_3_3": [false],
			"MiddleRing_6_5": [false],
			"Palm_2_7": [false],
			"Index_13_3": [false],
			"Index_5_1": [false],
			"Index_0_3": [false],
			"Thumb_2_3": [false],
			"Thumb_9_7": [false],
			"Thumb_12_3": [false]
		},
		rewards: {
			"Mem_Dg": "dog_pelt",
			"Mem_Fr": "cowards_pendant",
			"Mem_Grd": "guard_spear",
			"Mem_Ppl": "banshee_whistle",
			"Mem_MD": "mother_blanket",
			"Mem_Vctm": "flintlock",
			"Mem_Jge": "meaty_gavel",
			"Mem_Mse": "moose_pelt",
			"Mem_Chld": "sharpest_stick",
			"Mem_Bds": "skin_suit",
			"Mem_Prt": "falchion",
			"EyeOrb": "gold"
		},
		unclaimed: {},
		giveRewards: function(itemId, container) {
			const player = State.variables.player;
			const inventory = player.inventory;

			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));

			const reward = this.rewards[itemId];
			const amount = 1;

			const location = passage()

			const rewardLink = createLink(`An @{item} lays within the ashes of the brazier.`, (_, textElem, linkElem) => {
				const rewardGold = reward == "gold";
				let given = null;

				if (rewardGold) {
					updateGold(1);
				}
				else {
					given = addItemToInventory(reward, amount);
					if (given === -1) {
						linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
						textElem.innerHTML = "";
						textElem.appendChild(linkElem);
						return;
					}
				}

				this.unclaimed[location].delete(itemId);
				disableLink(linkElem);
				textElem.innerHTML = `${player.name} picked up ${(rewardGold) ? "1 piece of gold" : inventory[given].name}`;
			});
			
			container.appendChild(rewardLink);
		},
		addUnclaimed: function(itemId) {
			const location = passage();
			if (!this.unclaimed[location]) {
				this.unclaimed[location] = new Set();
			}
			this.unclaimed[location].add(itemId);
		},
		attemptUse: function(item, index, context) {
			const rewardList = this.rewards;
			const parent = context.container;
			const self = this;

			function showUnclaimed(object, context) {
				if (object.unclaimed[passage()]) {
					const rewards = object.unclaimed[passage()];
					
					for (const value of rewards.values()) {
						object.giveRewards(value, context.container);
					}
				}
			}

			function onContinue() {
				// State.variables.memoryStates.memories[item.effect] = -1;
				if (item.templateKey != "Mem_Prt") {
					setMemoryStates(item.templateKey, -1);
				}
				else {
					setMemoryStates(item.templateKey, 1);
					questLogAPI.addToQuestLog("beerbark_burned", "Beerbark's orb has been burned.");
					createQuestLogUI();
					NPCs.Pirate.flags.deathText = `A cracked and ruined brazier lays on the ground, overtaken by its own flames.\n\
																					The surrounding land is filled with soot, ash, and lingering flames.`;
					NPCs.Pirate.flags.safeFight = true;
					NPCs.Pirate.flags.isHostile = true;
					NPCs.Pirate.flags.hasFought = true;
					NPCs.Pirate.flags.defeated = true;
				}
				State.variables.player.inventory[index] = null;

				const resetText = (item.templateKey != "Mem_Prt") 
													 ? `The wails stop, the orb is reduced to a crumbly ash.\
													 The fog covering the islands feels thicker, the land more grey.\n\n`
													 : `The wails stop, the orb is reduced to a crumbly ash.\
													 The fog covering the islands feels a little lighter, the land more colorful.\n\n`;


				parent.innerHTML = "";
				$(parent).wiki(resetText);

				self.addUnclaimed(item.effect);
				interactionHelper(context);
				showUnclaimed(self, context);
			}

			function onExit() {
				const exitTextMap = {
					"Mem_Dg": `Images of a a pillar in an underground room pass through their mind.`,
					"Mem_Fr": `Images of a pillar inside a watchtower pass through their mind.`,
					"Mem_Grd": `Images of a spear, standing alone near a gate, pass through their mind.`,
					"Mem_Ppl": `Images of a pillar within a colosseum pass through their mind.`,
					"Mem_MD": `Images of a a pillar in an underground room pass through their mind.`,
					"Mem_Vctm": `Images of a pillar hanging in a gallow site pass through their mind.`,
					"Mem_Jge": `Images of a pillar inside a court room pass through their mind.`,
					"Mem_Mse": `Images of two pillars on a tiny, dark island pass through their mind.`,
					"Mem_Chld": `Images of a pillar on a tiny, dark island pass through their mind.`,
					"Mem_Bds": `Images of two pillars on a tiny, dark island pass through their mind.`,
					"Mem_Prt": `The orb shutters, almost as if it were laughing in their face.`,
					"EyeOrb": `A memory plays in their mind. Two men slash away at unsuspecting allies, one rides a horse, the other carries an axe.`
				}

				const exitText = `${State.variables.player.name} pulls the orb away from the flames. ` + exitTextMap[item.effect];
				const resetText = `Soon after the images pass, the surrounding area returns to normal. The orb is undamaged.\n\n`;

				questLogAPI.removeFromQuestLog("beerbark_orbs");
				questLogAPI.addToQuestLog("orbs_hint", "Orbs seem to have a sense of self preservation, they don't want to be burned.");
				createQuestLogUI();

				parent.innerHTML = "";
				$(parent).wiki(exitText + '\n\n');
				$(parent).wiki(resetText);

				interactionHelper(context);
				showUnclaimed(self, context);
			}

			setup.orbHandler = function(type) {
				switch (type) {
					case "continue":
						onContinue();
						break;
					case "exit":
						onExit();
						break;
				}
			}

			const pirateDead = NPCs.Pirate.flags.defeated;
			const canBurnOrb = item.effect != "Mem_Prt" || !pirateDead;
			
			if (!!rewardList[item.effect] && canBurnOrb) {
				const burnCutscene = `<<cutscene>>\
															The wind comes to an immediate hush.
															<<cut>>
															The air around ${State.variables.player.name} sours and tightens.
															<<cut>>
															The orb begins to burn into a red glow within the flames.
															<<cut>>
															A dreadful ''scream-like'' whistle spews out, as if the orb were trying to speak.
															<<cut>>
															As if the orb were trying to ''beg''.
															<<cut>>
															<<link "Finish Burning the Orb">><<run setup.orbHandler("continue")>><</link>>&emsp;&emsp;\
															<<link "Listen to the Orb">><<run setup.orbHandler("exit")>><</link>>`;

				const wikiContainer = document.createElement('span');
				wikiContainer.appendChild(document.createTextNode(burnCutscene));
				wikiContainer.appendChild(document.createTextNode(`<</cutscene>>`));

				context.container.innerHTML = "";
				$(context.container).wiki(wikiContainer.textContent);
				// context.container.appendChild(document.createElement('br'));
			}
			else {
				context.link.textContent = "The brazier does not react to the item placed in it.";
				context.container.innerHTML = "";
				context.container.appendChild(context.link);

				showUnclaimed(this, context);
			}
		}
	},
	"redemptionPillars": {
		locations: {
			"Thumb_9_4": [false, "EyeOrb"],
			"Thumb_10_6": [false, "EyeOrb"]
		},
		activated: 0,
		attemptUse: function(item, index, context) {
			const itemEffect = item.effect;

			if (itemEffect == this.locations[passage()][1]) {
				this.locations[passage()][0] = true;
				this.activated += 1;
				this.attemptInteract(context);

				State.variables.caveOpen = this.activated >= 2;
			}
			else {
				context.link.textContent = "The item sits silently atop the pillar.";
				context.container.innerHTML = "";
				context.container.appendChild(context.link);
			}
		},
		attemptInteract: function(context) {
			const successText = document.createElement('span');
			successText.textContent = "The orb hovers above the pillar, a choir of deep hums emanates from within it."

			context.container.innerHTML = "";
			context.container.appendChild(successText);
		}
	}
}

Macro.add('interaction', {
	tags: [],
	handler: function() {
		const iID = this.args[0];
		const interactive = interactives[iID];

		const pageChange = this.args[1];

		const bodyText = this.payload[0].contents;

		const container = document.createElement('div');
		container.className = 'interaction-con';
		
		const context = {
			container: container,
			interactive: interactive,
			bodyText: bodyText
		}

		interactionHelper(context, this.output);

		if (interactive.unclaimed && interactive.unclaimed[passage()]) {
			const rewards = interactive.unclaimed[passage()];

			for (const value of rewards.values()) {
				interactive.giveRewards(value, context.container);
			}
		}

		interactive.runPreliminaryLogic?.();
		this.output.appendChild(container);
	}
});

function interactionHelper(context, thisOutput) {
	const interactive = context.interactive;
	const container = context.container;
	const bodyText = context.bodyText;
	const currInteractive = interactive.locations[passage()];

	// Checks for all even values in the locations array to be true
	// Useful when multiple interactions are required for a single interaction
	if (currInteractive.filter((_, i) => i % 2 === 0).every(val => val)) {
		interactive.attemptInteract(container, bodyText);
		thisOutput.appendChild(container);
		return;
	}
	
	const link = createLink(bodyText, () => {
		State.variables.gameState = "interaction";
		createInventoryPopUp(context);
	}, context);

	container.appendChild(link);
}