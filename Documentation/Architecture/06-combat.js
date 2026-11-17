// COMBAT //

function createCombatEncounterAPI(player, enemySource) {
  	const enemy = enemySource.dup(); 
  	enemy.defending = false;
  	enemy.turnCount = 0;
  	State.variables.gameState = "combat";
  
    const combat = {
        player,
        enemy,
        turn: 0,
        log: [],
				colorLog: [],
				armorLog: [],
        state: "active",
				playerAdditive: 0,
				playerMultiplicative: 1,
				activeInflictions: 0,
				amountItemsUsed: 0,
				itemUsedThisTurn: false,
				effectMap: dupEffectMap(combatEffectMap),
				attackPlayerFunc: attackPlayer,
				pushCombatLogs: pushCombatLogs
    };

		const NPCKey = combat.enemy.NPCKey;
		if (NPCKey) NPCs[NPCKey].flags.foughtLocation = State.variables.combatLocation;

		function dupEffectMap(map) {
			const dup = {};
			for (let key in map) {
				dup[key] = { ...map[key] };
			}
			return dup;
		}

		function fireEffectsByTrigger(phase, action, enemyAction = null) {
			const currStatuses = combat.player.playerStatus.slice();

			currStatuses.forEach(status => {
				const effect = combat.effectMap[status.name];
				if (!effect) return;

				const effectiveTrigger = status.trigger ?? effect.trigger;
				if (effectiveTrigger !== phase) return;

				effect.onApply.call(
					status,
					combat.player,
					combat.enemy,
					combat,
					action,
					enemyAction
				);
			});
		}

		function resolvePlayerAttack() {
			let dmg = combat.player.equippedWeapon.damage;
			dmg += combat.playerAdditive;
			dmg *= combat.playerMultiplicative;

			combat.enemy.health -= dmg;

			const enemyHealthElement = document.querySelector('.combat-sprites p');
			if (enemyHealthElement) {
				enemyHealthElement.innerHTML = `HP: ${combat.enemy.health}`;
			}

			pushCombatLogs(`${combat.player.name} hit for ${dmg} damage!`, 'rgb(81, 81, 81)');
			processPlayerWin();
		}

		function runHabitatChanges() {
			const enemyTurn = enemy.turnCount % enemy.pattern.length;
			const enemyChoice = combat.enemy.pattern[enemyTurn];
			const mappedAction = enemyActionsMap[enemyChoice.action];

			// Continue only if enemy action is a habitat changing action
			if (!mappedAction || !mappedAction.habitatAction) return null;

			return runEnemyTurn();
		}

    function runEnemyTurn() {
        const enemyAction = combat.enemy.takeTurn();
				combat.turn++;
        pushCombatLogs(`${enemyAction.tell}`);

        switch(enemyAction.action) {
            case "attack":
            	const turnDamage = enemyAction.damage+combat.enemy.damageBoost;
							attackPlayer(turnDamage);
            	combat.enemy.damageBoost = 0;
							break;
            default:
            	enemyActionsMap[enemyAction.action]?.enemyAction(combat.player, combat.enemy, combat);
              break;
        }

				return enemyAction;
    }

    function attackPlayer(damage, instakill=false) {
        for (let i = 0; i < damage; i++) {
          	const armorBoost = combat.player.playerStatus.findIndex(status => status.name === "ArmorBoost");
          	// Remove an instance of ArmorBoost if player has the effect
            if (armorBoost !== -1) {
              	combat.player.playerStatus.splice(armorBoost, 1)[0];
                let msg = i < damage-1 ? "Defense bubble shattered!" : "Bubble absorbs attack!";
                combat.player.armor--;
								pushCombatLogs(msg, 'rgb(19, 23, 74)');
                continue;
            }
          	// End players block
            else if (combat.player.defending) {
                combat.player.defending = false;
                let msg = i < damage-1 ? "Guard broken!" : "Attack blocked!";
              	pushCombatLogs(msg, 'rgb(19, 23, 74)');
                continue;
            }
          	// Damage equipped armor if there is
            else if (combat.player.inventory[15] && combat.player.inventory[15].type == "armor") {
								// Fault tolerance I guess? Forgot why I check twice if the player has armor, too late to mess with it incase it breaks something.
                if (damageArmorSource(instakill)) {
                	continue;
                }
            }
          	// There shouldn't be any other way to have extra armor
            else if (combat.player.armor > 0) {
                UI.alert('Illegal Armor - bug');
                combat.player.armor--;
                continue;
            }

            // Player Dies
            combat.state = 'playerDead';
          	pushCombatLogs(`${combat.player.name} has died`, 'rgb(75, 16, 16)');
            return;
        }
    }

    function damageArmorSource(instakill) {
      	// Go through every trinket to check if there is an armor type trinket
				const equippedArmor = combat.player.inventory[15];

				if (equippedArmor) {
					equippedArmor.defense--;
					combat.player.armor--;
					let armorMessage = equippedArmor.defense <= 0 ? `${equippedArmor.name} destroyed!` : `${equippedArmor.name} blocks the attack!`;
					if (instakill) armorMessage = `${equippedArmor.name} cracks apart!`

					if (equippedArmor.defense <= 0) {
						combat.player.inventory[15] = null;
					}

					pushCombatLogs(armorMessage, 'rgb(19, 23, 74)');
					return true;
				}

      	return false;
    }

    function processPlayerSubmission(action, itemIndex) {
			combat.log.length = 0;
			combat.colorLog.length = 0;
			combat.armorLog.length = 0;
			if (combat.state !== "active") return;

			const item = combat.player.inventory[itemIndex];
			action = action.toLowerCase();

			combat.player.defending = (action == "defend");

			// Item use is a free action, no round passes
			if (action == "item") {
				if (combat.amountItemsUsed >= 2) {
					UI.alert("Player doesn't have any time to use anymore items!");
					return;
				}

				const effect = combat.effectMap[item.effect];

				if (effect) { // Verify effect exists
					// Add effect to playerStatus array
					combat.player.playerStatus.push(
						makeStatusInstance(item.effect, item, combat.effectMap)
					);
					
					// If item used for this effect is a consumable, decrement its amount by 1
					if (item.amount) {
						item.amount--;
						// Remove item from player's inventory if its all used up
						if (item.amount <= 0) {
							const inv = State.variables.player.inventory;
							const idx = inv.findIndex(it => it === item);
							if (idx !== -1) inv[idx] = null;
							combat.player.unprepareItem(item);
						}
					}
				} else {
					pushCombatLogs(`Nothing happens...`);
				}

				// Display how much armor
				const armorDisplay = document.querySelector('.combat-armor-display');
				if (armorDisplay) {
					// Get player armor count by amount of armor boost they have
					const armorBoostCount = combat.player.playerStatus.filter(eff => eff.name == "ArmorBoost").length;
					const armorWear = combat.player.inventory[15]
					const armorWearCount = (armorWear && armorWear.defense) ? armorWear.defense : 0;

					armorDisplay.textContent = `Armor: ${Math.max(armorBoostCount+armorWearCount, 0)}`;
				}
				
				combat.amountItemsUsed++;
				combat.itemUsedThisTurn = true;

				return;
			}

			// Get enemy proposed turn for this round
			const enemyPatternIndex = combat.enemy.turnCount % combat.enemy.pattern.length;
			const proposedEnemyAction = combat.enemy.pattern[enemyPatternIndex];

			// Check and run enemy's turn first if its a habitat turn
			const habitatAction = runHabitatChanges();

			// Run all effects the player caused that are labeled "roundStart"
			fireEffectsByTrigger("roundStart", action, proposedEnemyAction);
			
			// Check if enemy or player is killed by these effects
			if (combat.enemy.health <= 0) { processPlayerWin(); cleanupTurn(); return; }
			if (combat.state === "playerDead") { cleanupTurn(); return; }

			// Run enemy turn
			let enemyAction = null;

			if (habitatAction) {
				enemyAction = habitatAction;
			} else if (combat.state == "skipEnemy") {
				combat.state = "active";
				combat.enemy.takeTurn();
				combat.turn++;
			} else {
				enemyAction = runEnemyTurn();
			}

			if (enemyAction && enemyAction.action == "windup" && action == "attack") {
				combat.enemy.damageBoost = Math.max(0, combat.enemy.damageBoost - 1);
				pushCombatLogs("The windup is interrupted!", "rgb(27, 83, 48)");
			}

			// Run all effects that are supposed to happen after the enemy takes their turn
			if (combat.state != "playerDead") {
				fireEffectsByTrigger("onEnemyResolved", action, enemyAction);
			}

			// Process if the enemy or player is killed by these effects
			if (combat.enemy.health <= 0) { processPlayerWin(); cleanupTurn(); return; }
			if (combat.state == "playerDead") { cleanupTurn(); return; }

			// Run player's action for this round
			if (combat.state == "active" && action == "attack") {
				fireEffectsByTrigger("onPlayerAction", action, enemyAction);
				resolvePlayerAttack();
			}

			cleanupTurn();
		}

		function pushCombatLogs(text, color='transparent') {
			combat.log.push(text);
			combat.colorLog.push(color);
			combat.armorLog.push(combat.player.armor);
		}

		function cleanupTurn() {
			combat.player.resetTurn(combat.effectMap);
			combat.playerAdditive = 0;
			combat.playerMultiplicative = 1;
			combat.itemUsedThisTurn = false;

			// If enemy is connected to an NPC, update its current health at player death
			if (combat.state != "playerDead" || !NPCKey || !NPCs[NPCKey] || !NPCs[NPCKey].flags.currHealth) return;

			NPCs[NPCKey].flags.currHealth = combat.enemy.health;
		}

		function processPlayerWin() {
			if (combat.enemy.health <= 0) {
				combat.state = 'playerWin';
				pushCombatLogs(`${combat.player.name} has won!`);
				editHostileLocs(State.variables.combatLocation, undefined);
				
				const finalArmor = player.inventory[15];

				// Reset armor to full if player has any
				if (finalArmor && finalArmor.type == "armor") {
					finalArmor.defense = finalArmor.maxHealth;
					pushCombatLogs(`${finalArmor.name} regains its power!`);
				}

				if (NPCKey) NPCs[NPCKey].flags.defeated = true;
			}
		}
		
		combat.processPlayerWin = processPlayerWin;
		
  	// Return API to be used by combat UI
    return {
        runEnemyTurn,
        processPlayerSubmission,
				processPlayerWin,
				pushCombatLogs,
        getLog: () => combat.log,
				getColorLog: () => combat.colorLog,
				getArmorLog: () => combat.armorLog,
        getState: () => combat.state,
        getCombatants: () => ({ player: combat.player, enemy: combat.enemy }),
				getTurn: () => combat.turn % combat.enemy.pattern.length,
				getItemUsedThisTurn: () => combat.itemUsedThisTurn,
				getAmountItemsUsed: () => combat.amountItemsUsed
    };
}

// ----- Combat UI ----- //
function createCombatUI(combatAPI) {
		const enemy = combatAPI.getCombatants().enemy;
		const player = combatAPI.getCombatants().player;

		const container = document.createElement('div');
  	container.className = 'combat-container';

		const combatUIObj = {
			element: container
		}
  
		const armorDisplay = document.createElement('div');
		armorDisplay.className = 'combat-armor-display';
		armorDisplay.style.position = 'absolute';
		updateArmor(player.armor);
		container.appendChild(armorDisplay);

  	const spriteArea = document.createElement('div');
  	spriteArea.className = 'combat-sprites';
  	container.appendChild(spriteArea);

		let currHint = enemy.pattern[combatAPI.getTurn()].hint;
		if (currHint) spriteArea.innerHTML = currHint;

		const turnBar = document.createElement('div');
		turnBar.className = 'combat-turn-bar';
		const totalTurns = enemy.pattern.length;

		for (let i = 0; i < totalTurns; i++) {
			const turnPiece = document.createElement('div');
			turnPiece.className = 'combat-turn-rect';
			turnPiece.dataset.turnIndex = i;

			if (i == 0) {turnPiece.classList.toggle('active', true);}
			turnBar.appendChild(turnPiece);
		}
		container.appendChild(turnBar);
  
  	const bottomArea = document.createElement('div');
  	bottomArea.className = 'combat-bottom';
  	container.appendChild(bottomArea);
  
  	let showingLog = false;
  	let inventoryVisible = false;
		let rewardsGiven = false;

		function updateArmor(armor) {
			armorDisplay.textContent = `Armor: ${Math.max(armor, 0)}`;
		}
  
  	function showInventory(ui) {
			inventoryVisible = true;
			createInventoryPopUp(null, ui);
    }
  
  	function hideInventory() {
    	container.style.display = '';
			inventoryVisible = false;
		
			const modal = document.getElementById('combat-inventory-modal');
			if (modal) modal.remove();
    }
  
  	let actionButtons = {};

		function showActionButtons() {
			bottomArea.innerHTML = '';
			showingLog = false;

			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'action-buttons';

			const actions = ['Attack', 'Defend', 'Inventory'];
			actionButtons = {};

			actions.forEach(actionName => {
				const action = document.createElement('button');
				action.innerHTML = actionName;
				action.className = 'action-button';

				action.addEventListener('click', () => {
					if (actionName !== 'Inventory') {
						combatAPI.processPlayerSubmission(actionName);
						showCombatLog();
					}
					else {
						showInventory(combatUIObj);
					}
				});

				actionButtons[actionName] = action;
				buttonContainer.appendChild(action);
			});

			bottomArea.appendChild(buttonContainer);
			refreshInventoryButton();
		}

		function refreshInventoryButton() {
			const btn = actionButtons['Inventory'];
			if (!btn) return;

			const itemUsed = combatAPI.getItemUsedThisTurn();
			btn.disabled = itemUsed;
			btn.style.opacity = itemUsed ? '0.4' : '';
			btn.style.cursor = itemUsed ? 'not-allowed' : '';

			const amountItemsUsed = combatAPI.getAmountItemsUsed();
			btn.classList.toggle('action-button-tired', amountItemsUsed >= 2 || itemUsed);
		}
  	
  	function showCombatLog() {
    	bottomArea.innerHTML = '';
			spriteArea.innerHTML = "";
			showingLog = true;

			const logDiv = document.createElement('div');
			logDiv.className = 'combat-log';
			
			const logs = combatAPI.getLog();
			const colorlogs = combatAPI.getColorLog();
			const armorlogs = combatAPI.getArmorLog();
			let currLog = 0;

			const logParser = document.createElement('p');
			logDiv.appendChild(logParser);
			logParser.innerHTML = logs[currLog];

			function updateLogDisplay() {
				logParser.innerHTML = logs[currLog];

				logParser.classList.remove('shake');
				void logParser.offsetWidth; // Forcing a reflow so the VFX are updated instantly

				logParser.classList.add('shake');

				const currentColor = colorlogs[currLog];
				
				updateSpriteEffect(currentColor);
				
				const currentArmor = armorlogs[currLog];
				updateArmor(currentArmor);
			}

			function updateSpriteEffect(currentColor) {
				if (currentColor && currentColor != 'transparent') {
					spriteArea.getAnimations().forEach(anim => anim.cancel());

					spriteArea.animate(
						[
							{backgroundColor: currentColor},
							{backgroundColor: 'rgba(currentColor.r, currentColor.g, currentColor.b, 0)'}
						], 
						{
							duration: 500,
							easing: 'ease-out'
						}
					);
				}
			}

			updateLogDisplay();

			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'action-buttons';
			
			// Go through each message in the log per click
			const continueButton = document.createElement('button');
			continueButton.textContent = 'Continue';
			continueButton.className = 'action-button';

			continueButton.addEventListener('click', () => {
				currLog++;
				if (currLog < logs.length) {
					updateLogDisplay();
				}
				else {
					spriteArea.innerHTML = "";
					if (combatAPI.getState() == "playerDead") {
							let player = combatAPI.getCombatants().player;
							UIBar.unstow();
							player.respawn();
					}
					else if (combatAPI.getState() == "playerWin") {
						let player = combatAPI.getCombatants().player;
						UIBar.unstow();
						player.resolve();
					}
					else {
						updateTurnBar();
						showActionButtons();
						currHint = enemy.pattern[combatAPI.getTurn()].hint;
						if (currHint) spriteArea.innerHTML = currHint;
					}
				}
				
			});

			for (let i = 0; i < 3; i++) {
				const hiddenButton = continueButton.cloneNode(true);
				hiddenButton.classList.add('action-button');
				hiddenButton.style.visibility = 'hidden';
				buttonContainer.appendChild(hiddenButton);
			}
			
			spriteArea.appendChild(logDiv);
			bottomArea.appendChild(buttonContainer);
			buttonContainer.appendChild(continueButton)
    }

		function updateTurnBar() {
			const currentTurn = enemy.turnCount % totalTurns;
			const rects = document.querySelectorAll('.combat-turn-rect');
			rects.forEach((rect, i) => {
				rect.classList.toggle('active', i === currentTurn);
				rect.classList.toggle('pulse', i === currentTurn);
			});
		}

		combatUIObj.refreshInventoryButton = refreshInventoryButton;
  
  	showActionButtons();
  
  	return combatUIObj;
}

Macro.add('startCombat', {
    handler: function() {
        if (!State.variables.player) {
          this.output.appendChild(document.createTextNode("No player exists | Bug"));
        }
      
      	const enemyName = this.args[0] || State.variables.currentEnemy;
      	const enemy = enemies[enemyName];
      
      	if (!enemy) {
        	this.output.appendChild(document.createTextNode(`Enemy ${enemyName} not found.`));
					return;
        }
      
      	State.variables.currentCombat = createCombatEncounterAPI(State.variables.player, enemy);
      	const combatUI = createCombatUI(State.variables.currentCombat);
      
      	$(this.output).empty().append(combatUI.element);
    }
});

Macro.add('giveBattleRewards', {
	handler: function() {
		const enemyName = this.args[0];
		const enemyRewards = enemyRewardsMap[enemyName];
		const player = State.variables.player;
		const inventory = player.inventory;

		console.log(enemyName, enemyRewards);

		for (let i = 0; i < enemyRewards.length; ++i) {
			const item = enemyRewards[i];
			const currIndex = i;
			if (item == null) continue;

			const itemLink = createLink(`An @{item} is dropped on the ground.`, (_, textElem, linkElem) => {
				const given = addItemToInventory(item);

				if (given === -1) {
					linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
					textElem.innerHTML = "";
					textElem.appendChild(linkElem);
					return;
				}

				const NPCDrops = {"Mem_Cwd": "Coward", "Mem_Gnrl": "General", "Mem_Prt": "Pirate", "Mem_Sldr": "Soldier", "Crkd_Aclde": "General"};
				const NPCDrop = inventory[given].templateKey
				const NPC = NPCDrops[NPCDrop];
				const NPCForm = {
					"eteocle": 1,
					"eteocle_dial": -1,
					"viselli_dial": -1,
					"viselli": -1,
					"viselli_friendly": 1,
					"camilos_dial": -1,
					"camilos_angered": 1,
					"camilos_monster": 1,
					"beerbark_dial": 1
				}

				if (NPCs[NPC]) {
					setMemoryStates(NPCDrop, NPCForm[NPCs[NPC].flags.hostileForm]);
					NPCs[NPC].endNPC(NPCs[NPC]);
					NPCs[NPC].flags.orbCollected = true;
					createQuestLogUI();
				};

				disableLink(linkElem);
				textElem.innerHTML = `${player.name} picked up ${inventory[given].name}`;
				enemyRewards[currIndex] = null;
			});

			this.output.appendChild(itemLink);
			this.output.appendChild(document.createElement('br'));
		}
	}
})