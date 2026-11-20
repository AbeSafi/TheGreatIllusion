class PlayerClass {
	constructor(name, weapon) {
    	this.name = name; 
      	this.equippedWeapon = weapon;
      	this.armor = 0; // Tied to inventory slot 15 and used items during combat
      	this.defending = false; // Transient, reset per combat
      	this.actionsPerTurn = 1; // Deprecated, unused
      	this.actionsUsed = 0; // Deprecated, unused
      	this.respawnLocation = ''; // Passage name of player respawn location; format: map_y_x
      	this.playerStatus = []; // Active player buffs and boons
      	this.preparedItems = []; // Items the player can use during combat
      	this.skills = []; // Never implemented, unused

		/*
		Slots 6 and 15 are reserved for equipped weapon and armor/trinket respectiveely
		Slots 7,8,16,17 are reserved for prepared items
		*/
      	this.inventory = Array(54).fill(null);
    }

	prepareEquipment(equipmentIndex) {
		const equipment = this.inventory[equipmentIndex];
		// Weapon goes into slot 6 and all other equipment goes into slot 15
		const newEquipmentIndex = (equipment.type == 'weapon') ? 6 : 15;
		const oldEquipment = this.inventory[newEquipmentIndex];
		
		if (oldEquipment) {
			this.unprepareEquipment(oldEquipment);
		};

		// Swaps the position of the newly equipped item vs the item previously equipped (supports swap with null)
		this.inventory[newEquipmentIndex] = equipment;
		this.inventory[equipmentIndex] = oldEquipment;
		equipment.equipped = true;
		
		if (equipment.type == 'weapon') {
			// References the currently equipped weapon in the player's inventory
			State.variables.player.equippedWeapon = equipment;
		} else if (equipment.defense) {
			this.armor += equipment.defense;
		}

		// Adds the effect the new item has (if it has any)
		for (let effect of equipment.combatEffects) {
			this.playerStatus.push(
				makeStatusInstance(effect, equipment, combatEffectMap)
		);
		}

		// Used to update the inventory UI live instead of needing to refresh it
		return [newEquipmentIndex, oldEquipment];
	}
	
	unprepareEquipment(equipment) {
		equipment.equipped = false;
		if (equipment.type == 'armor') this.armor -= equipment.defense;

		for (let effectName of equipment.combatEffects) {
			// Needs both name and source to match to find equipment
			const statusIndex = this.playerStatus.findIndex(status => 
				status.source === equipment && status.name === effectName);
			
			if (statusIndex !== -1) {
				const status = this.playerStatus[statusIndex];
				const effect = combatEffectMap[effectName];
				if (effect && effect.onRemove) {
					effect.onRemove.call(status, this);
				}

				this.playerStatus.splice(statusIndex, 1);
			}
		}
		
		// Returns [slot item was moved to, null]. This is an array to match with prepareEquipment, allows both functions to be used interchangeably
		return [this.inventory.findIndex((element, i) => element === null && !(i % 9 > 5 && i <= 17)), null];
	}
  
  	prepareItem(itemIndex) {	
		// Add item to prepared slots if there is room
		const item = this.inventory[itemIndex];

		// The slots of the prepared items
		const preparedSlots = [7, 8, 16, 17];

		// Only adds if there are open slots. Unlike prepareEquipment, does not swap. 
		for (let slot of preparedSlots) {
			if (!this.inventory[slot]) {
				this.inventory[slot] = item;
				this.inventory[itemIndex] = null;
				this.preparedItems.push(item);
				item.isPrepared = true;
				return slot;
			}
		}

		UI.alert("Can't prepare anymore items");
		
		// returns -1 on fail and index on success
		return -1;
    }
	
  	unprepareItem(item) {
		const invSlot = this.inventory.findIndex((element, i) => element === null && !(i % 9 > 5 && i <= 17));
		if (invSlot == -1) return -1;

      	// Check item exists, remove it from prepared list if it does
		item.isPrepared = false; // Cleared unconditionally, likely a bug I didn't catch before shipping. I would only change if a bug is found later.
		const itemIndex = this.preparedItems.indexOf(item);
      	if (itemIndex > -1) this.preparedItems.splice(itemIndex, 1);

		// Return first found empty slot
		return invSlot;
    }
	
  	resetTurn(effectMap) {
    	this.defending = false;
      	this.actionsUsed = 0;
      	const toAdd = [];
      
      	// Remove expired effects
    	this.playerStatus = this.playerStatus.filter(status => {
        	// Decrement effect duration and remove if duration has ended
          	status.duration--;
        	if (status.duration <= 0) {
            	const effect = effectMap[status.name];
				// Equipment statuses handled by unprepareEquipment, not here
            	if (effect && !(status.source instanceof EquipmentClass)) {
                	effect.onRemove.call(status, this);
                }

            	// If status expires, it chains into nextEffect (if  there is one)
            	if (effect?.nextEffect) {
					const carried = { ...status };
					delete carried.name;
					delete carried.duration;
					delete carried.source;

					toAdd.push({
						...carried,
						name: effect.nextEffect,
						duration: effectMap[effect.nextEffect].duration,
						source: status.source
					});
            	}
            	return false; // tells the caller to remove status
        	}
        	return true; // tells the caller to keep status
    	});
		
      	this.playerStatus.push(...toAdd);
    }

	resetPlayer() {
		this.defending = false;
      	this.actionsUsed = 0;
      	
      	// Removes all non-equipment statuses 
      	this.playerStatus = this.playerStatus.filter(status => {
          	// If equipment not equipped, the effect expires and is removed
			if (status.source instanceof EquipmentClass) {
				const isWeapon = status.source === this.equippedWeapon;

				if (!this.inventory[15]) return isWeapon;

				const isTrinket = this.inventory[15].name == status.source.name;

				// Keep only if there is a matching weapon or trinket
				return isWeapon || isTrinket;
			}
          	
          	// All other status effects are auto expired on death
          	return false;
        });
      	
		if (!this.inventory[15]) return;
      	// Resets armor to the equipped armor's max, 0 otherwise
      	this.armor = (this.inventory[15].type == 'armor') ? this.inventory[15].maxHealth : 0; 
	}
	
	// Triggers on defeat, reutrns player to respawn location
  	respawn() {
      	this.resetPlayer();

		const newLocation = this.respawnLocation;
		const coordinates = getMapAndPosition(newLocation)?.position;

		if (!coordinates && newLocation && Story.has(newLocation)) { // Branch where respawnLocation isn't under the format of map_y_x
			Engine.play(newLocation);
			return;
		} else if (!coordinates) { // Branch where map doesn't exist at all
			UI.alert("Player spawn in invalid position");
			return;
		}

		State.variables.playerPos = {x: coordinates.x, y: coordinates.y};
		State.variables.gameState = "default"; // Reset global game state back to default
		
        Engine.play(this.respawnLocation); // Respawn Player back to start
    }

	// Triggers on victory, returns player to combat location
	resolve() {
		this.resetPlayer();

		let currLoc = State.variables.combatLocation;

		State.variables.gameState = "default";

		Engine.play(currLoc);
	}
}