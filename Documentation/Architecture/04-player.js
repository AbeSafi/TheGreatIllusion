class PlayerClass {
	constructor(name, weapon) {
    	this.name = name;
      	this.equippedWeapon = weapon;
      	this.armor = 0;
      	this.defending = false;
      	this.actionsPerTurn = 1;
      	this.actionsUsed = 0;
      	this.respawnLocation = '';
      	this.playerStatus = []; // Active player buffs, boons, and the inverse | Stores
      	this.preparedItems = []; // Items the player can use during combat
      	this.skills = [];
      	this.inventory = Array(54).fill(null);
    }

		prepareEquipment(equipmentIndex) {
			const equipment = this.inventory[equipmentIndex];
			const newEquipmentIndex = (equipment.type == 'weapon') ? 6 : 15;
			const oldEquipment = this.inventory[newEquipmentIndex];

			if (oldEquipment) {
				this.unprepareEquipment(oldEquipment);
			};

			this.inventory[newEquipmentIndex] = equipment;
			this.inventory[equipmentIndex] = oldEquipment;
			equipment.equipped = true;
			
			if (equipment.type == 'weapon') {
				State.variables.player.equippedWeapon = equipment
			} else if (equipment.defense) {
				this.armor += equipment.defense;
			}

			for (let effect of equipment.combatEffects) {
				this.playerStatus.push(
					makeStatusInstance(effect, equipment, combatEffectMap)
    		);
			}

			return [newEquipmentIndex, oldEquipment];
		}

		unprepareEquipment(equipment) {
			equipment.equipped = false;
			if (equipment.type == 'armor') this.armor -= equipment.defense;

			for (let effectName of equipment.combatEffects) {
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

			return [this.inventory.findIndex((element, i) => element === null && !(i % 9 > 5 && i <= 17)), null];
		}
  
  	prepareItem(itemIndex) {	
			// Add item to prepared slots if there is room
			const item = this.inventory[itemIndex];

			const preparedSlots = [7, 8, 16, 17];
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
		
			return -1;
    }
  
  	unprepareItem(item) {
				const invSlot = this.inventory.findIndex((element, i) => element === null && !(i % 9 > 5 && i <= 17));
				if (invSlot == -1) return -1;

      	// Check item exists, remove it from prepared list if it does
				item.isPrepared = false;
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
            	if (effect && !(status.source instanceof EquipmentClass)) {
                	effect.onRemove.call(status, this);
                }
            	// Chain followup effect if there is one
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
            	return false; // Remove
        	}
        	return true; // Keep
    	});
      
      	this.playerStatus.push(...toAdd);
    }

		resetPlayer() {
			this.defending = false;
      	this.actionsUsed = 0;
      	
      	// Remove all expired status effects
      	this.playerStatus = this.playerStatus.filter(status => {
          	// If equipment not equipped, effect is expired
						if (status.source instanceof EquipmentClass) {
								const isWeapon = status.source === this.equippedWeapon;

								if (!this.inventory[15]) return isWeapon;

								const isTrinket = this.inventory[15].name == status.source.name;

								return isWeapon || isTrinket;
						}
          	
          	// All other status effects are auto expired on death
          	return false;
        });
      	
				if (!this.inventory[15]) return;
      	// Reset their armor to valid amount
      	this.armor = (this.inventory[15].type == 'armor') ? this.inventory[15].maxHealth : 0;
		}
  
  	respawn() {
      	this.resetPlayer();

				const newLocation = this.respawnLocation;
				const coordinates = getMapAndPosition(newLocation)?.position;

				if (!coordinates && newLocation && Story.has(newLocation)) {
					Engine.play(newLocation);
					return;
				} else if (!coordinates) {
					UI.alert("Player spawn in invalid position");
					return;
				}

				State.variables.playerPos = {x: coordinates.x, y: coordinates.y};

				State.variables.gameState = "default";
		
      	// Respawn Player back to start
        Engine.play(this.respawnLocation);
    }

		resolve() {
				this.resetPlayer();

				let currLoc = State.variables.combatLocation;

				State.variables.gameState = "default";

				Engine.play(currLoc);
		}
}