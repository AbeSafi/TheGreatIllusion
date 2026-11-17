// Map for any effects applied to the player.
const combatEffectMap = {
	// Give the player an extra armor that lasts until broken, disappears after combat is over
	"ArmorBoost": { 
		onApply: (player) => { 
				player.armor++;
		},
		onRemove: (player) => {
				player.armor--;
		},
		trigger: "roundStart",
		duration: 1,
		nextEffect: "ArmorBoost"
	},
	// If enemy attacks player, takes thorn damage
	"Thorns": {
		onApply: (_player, enemy, combat, _action, enemyAction) => {
			if (enemyAction && enemyAction.action == "attack") {
				combat.pushCombatLogs(`${enemy.name} hurt its self while attacking!`, 'rgb(81, 81, 81)');
				combat.enemy.health -= 10;
			}
		},
		trigger: "onEnemyResolved",
		onRemove: (_) => null,
		duration: 1,
		nextEffect: "Thorns"
	},
	// If enemy attacks player while player isn't defending, 
	// inflict enemy with fear that could cause it to skip a turn.
	"Counter_Fear": {
		onApply: function(player, enemy, combat, action, enemyAction) {
			// Skip mode: fired at roundStart
			if (this.active
					&& combat.state == "active"
					&& enemyAction 
					&& enemyAction.action == "attack") {

				combat.state = "skipEnemy";
				combat.pushCombatLogs(`${enemy.name} hesitates its attack out of fear!`, 'rgb(69, 34, 96)');
				combat.activeInflictions -= 1;
				this.active = false;
				this.trigger = "onEnemyResolved";  // back to proc mode
			}
			// Proc mode: fired at onEnemyResolved
			else if (enemyAction && enemyAction.action == "attack" && action !== "defend") {
				combat.pushCombatLogs(`${enemy.name} has been inflicted with fear!`, 'rgb(69, 34, 96)');
				combat.activeInflictions += 1;
				this.active = true;
				this.trigger = "roundStart";  // consume before next attack
			}
		},
		onRemove: (_) => null,
		trigger: "onEnemyResolved",
    getInitialState: () => ({ active: false, trigger: "onEnemyResolved" }),
    duration: 1,
    nextEffect: "Counter_Fear"
	},
	// Every time player attacks, their damage snowball increases by 2
	"Dmg_Stack": {
		onApply: function(_player, _enemy, combat, action, enemyAction) {
			const playerAttacking = action == "attack";
			
			combat.playerAdditive += this.stack;
			if (playerAttacking && enemyAction && enemyAction.action != "defend") 
				this.stack += 2;
		},
		onRemove: (_) => null,
		trigger: "onPlayerAction",
		getInitialState: () => ({ stack: 0 }),
		duration: 1,
		nextEffect: "Dmg_Stack"
	},
	// If player successfully hits enemy, give them disorientation and skip a turn.
	"Disorient": {
		onApply: function(_, enemy, combat, action) {
			if (this.active) {
				combat.state = "skipEnemy";
				combat.pushCombatLogs(`${enemy.name} is disoriented!`, 'rgb(25, 70, 112)');
				combat.activeInflictions -= 1;
				this.active = false;
				this.cooldown = 2;
				this.trigger = "onPlayerAction";
			}
			
			if (action != "attack") return;

			if (this.cooldown > 0) {
				this.cooldown--;
				return;
			}

			combat.pushCombatLogs(`${enemy.name} has been disoriented!`, 'rgb(25, 70, 112)');
			combat.activeInflictions += 1;
			this.active = true;
			this.trigger = "roundStart";
		},
		getInitialState: () => ({ active: false, cooldown: 0, trigger: "onPlayerAction" }),
		trigger: "onPlayerAction",
		onRemove: (_) => null,
		duration: 1,
		nextEffect: "Disorient"
	},
	// If enemy attacks player 50% chance it skips the next turn
	"Hide_Chance": {
		onApply: function(player, enemy, combat, _action, enemyAction) {
			if (combat.state !== "active") return;
			if (!enemyAction || enemyAction.action !== "attack") return;

			const flip = Math.floor(Math.random() * 2) === 1;
			if (flip) {
				combat.state = "skipEnemy";
				combat.pushCombatLogs(`${player.name} hides from ${enemy.name}'s attack!`, 'rgb(65, 97, 108)');
			}
    },
		onRemove: (_) => null,
		trigger: "roundStart",
		duration: 1,
		nextEffect: "Hide_Chance"
	},
	// If player attacks enemy 25% chance its a crit
	"Crit_Chance": {
		onApply: function(_player, _enemy, combat, action) {
			const chance = Math.floor(Math.random() * 4) === 1;
			const attacking = action == "attack";
			if (!chance || !attacking) return;

			combat.playerMultiplicative *= 2;
			combat.pushCombatLogs(`Critical Hit!`, 'rgb(81, 81, 81)');
		},
		onRemove: (_) => null,
		trigger: "onPlayerAction",
		duration: 1,
		nextEffect: "Crit_Chance"
	},
	// If player attacks enemy, stun it for 3 rounds.
	"Subdue": {
		onApply: function(_1, enemy, combat, action) {
			// Skip mode: fired at roundStart
			if (this.active) {
				this.stunRounds--;
				combat.state = "skipEnemy";
				combat.pushCombatLogs(`${enemy.name} is subdued!`, 'rgb(26, 66, 21)');

				if (this.stunRounds > 0) return;

				this.active = false;
				this.trigger = "onPlayerAction";  // back to proc mode
				combat.activeInflictions -= 1;
				combat.pushCombatLogs(`${enemy.name} breaks free!`);
			}
			// Proc mode: fired at onPlayerAction
			else if (action == "attack") {
				if (Math.floor(Math.random() * 3) !== 1) return;
				
				this.stunRounds = 3;
				combat.activeInflictions += 1;
				this.active = true;
				this.trigger = "roundStart";
				combat.pushCombatLogs(`Tendrils stick to ${enemy.name}, they're unable to move!`, 'rgb(26, 66, 21)');
			}
		},
		getInitialState: () => ({ active: false, stunRounds: 3, trigger: "onPlayerAction" }),
		trigger: "onPlayerAction",
		onRemove: (_) => null,
		duration: 1,
		nextEffect: "Subdue"
	},
	// If enemy attacks player, it receives a DOT burn effect for 2 rounds
	"Burn_Chance": {
		onApply: function(_player, enemy, combat, _action, enemyAction) {
			if (this.active) {
				this.burnRounds--;
				enemy.health -= 5;
				combat.pushCombatLogs(`Lingering flames burn ${enemy.name}.`, 'rgb(115, 61, 17)');

				if (this.burnRounds > 0) return;

				this.trigger = "onEnemyResolved";
				this.active = false;
				combat.activeInflictions -= 1;
			}
			else if (enemyAction && enemyAction.action == "attack") {
				const chance = Math.floor(Math.random() * 4) === 0; 
				if (chance) {
					this.active = true;
					this.burnRounds = 2;
					this.trigger = "roundStart"
					combat.activeInflictions += 1;
					combat.pushCombatLogs(`${enemy.name} burns its self while attacking.`, 'rgb(115, 61, 17)');
					enemy.health -= 5;
				}
			}
		},
		onRemove: (_) => null,
		trigger: "onEnemyResolved",
		getInitialState: () => ({ active: false, burnRounds: 2, trigger: "onEnemyResolved" }),
		duration: 1,
		nextEffect: "Burn_Chance"
	},
	// Rare chance the weapon insta-kills an enemy
	"deadly_1": {
		onApply: function(_1, enemy, combat, action) {
			const chance = Math.floor(Math.random() * 2000) === 1;

			if (chance && action == "attack") {
				combat.playerAdditive += 10000;
				combat.pushCombatLogs(`The sharpest stick strikes with deadly force!`, 'rgb(156, 156, 156)');
			}
		},
		onRemove: (_) => null,
		trigger: "onPlayerAction",
		duration: 1,
		nextEffect: "deadly_1"
	},
	// One shots beerbark specifically
	"deadly_2": {
		onApply: function(_1, enemy, combat, action) {
			if (enemy.name == "Beerbark" && action == "attack") {
				combat.playerAdditive += enemy.health+1;
				combat.pushCombatLogs(`The sharpest stick finds its target!`, 'rgb(156, 156, 156)');
				combat.state = "skipEnemy";
			}
		},
		onRemove: (_) => null,
		trigger: "roundStart",
		duration: 1,
		nextEffect: "deadly_2"
	}
}