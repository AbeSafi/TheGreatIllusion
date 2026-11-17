class EnemyClass {
	constructor(name, health, pattern, NPCKey=null) {
    	this.name = name;
			this.health = health;
			this.pattern = pattern;
			this.turnCount = 0;
			this.defending = false;
			this.interrupted = false;
			this.damageBoost = 0;
			this.NPCKey = NPCKey
    }
  
  	takeTurn() {
			// Fit the current turn into the monster's current action.
			const fittedTurn = this.turnCount % this.pattern.length;
			const enemyChoice = this.pattern[fittedTurn];
		
			this.turnCount++;
		
			return enemyChoice;
    }
  
  	dup() {
    	return new EnemyClass(
        	this.name,
					this.health,
					JSON.parse(JSON.stringify(this.pattern)),
					this.NPCKey
        )
    }
}

// All Enemies Map
const enemies = {
		basic_enemy: new EnemyClass(
			"BasicEnemy",
			15,
			[
				{action: "attack", damage: 1, tell: "The enemy attacks"},
				{action: "defend", tell: "The enemy blocks"},
				{action: "attack", damage: 1, tell: "The enemy attacks"},
				{action: "rest", tell: "The enemy is tired"}
			]
    ),
  	windup_enemy: new EnemyClass(
			"BasicEnemy2",
				30,
			[
				{action: "defend", tell: "The enemy blocks"},
				{action: "windup", tell: "The enemy winds up"},
				{action: "attack", damage: 1, tell: "The enemy attacks"},
				{action: "rest", tell: "The enemy is tired"}
			]
    ),
		crazed_axeman: new EnemyClass(
			"Crazed Axeman",
			15,
			[
				{action: "attack", damage: 1, hint: "The axeman's grip tightens.", tell: "The axeman swings their axe!"},
				{action: "attack", damage: 1, hint: "The axeman's grip tightens.", tell: "The axeman spins into a second swing!"},
				{action: "rest", hint: "The axeman begins to shake with laughter.", tell: "The axeman loses their balance!"},
			]
    ),
		sleeping_blob: new EnemyClass(
			"Sleeping Blob",
			15,
			[
				{action: "rest", tell: "The blob is asleep!"},
				{action: "attack", damage: 1, tell: "Blob swipes"}
			]
    ),
		coagulated_fear: new EnemyClass(
			"Blob of Coagulated Fear",
			15,
			[
				{ action: "attack", damage: 1, hint: "The blob's surface begins to bubble.", tell: "The blob shrieks, spikes shoot out from its mass!" },
				{ action: "rest", hint: "The blob's surface begins to dent.", tell: "The blob shrinks back to its original shape." },
				{ action: "attack", damage: 1, hint: "The blob's surface begins to bubble.",  tell: "The blob spits forward a ball of phlegm!" }
			]
		),
		big_dog: new EnemyClass(
			"Giant Wolf",
			20,
			[
				{ action: "attack", damage: 1, hint: "The wolf's back arches.", tell: "The wolf lunges forward, swinging its claws as it goes." },
				{ action: "attack", damage: 1, hint: "The wolf's back arches.", tell: "The wolf snaps forward with a bite!" },
				{ action: "windup", hint: "The wolf's limbs bend.", tell: "The wolf curls low, muscles tensing." },
				{ action: "attack", damage: 1, hint: "The wolf's hackles puff out.", tell: "The wolf swings its claws in a wide arc!" },
				{ action: "windup", hint: "The wolf's limbs bend.", tell: "The wolf presses the ground, ready to pounce." },
				{ action: "attack", damage: 1, hint: "The wolf's hackles puff out.", tell: "The wolf clamps its jaws shut as it jumps." }
			]
		),
		guardsman: new EnemyClass(
			"Guardsman",
			20,
			[
				{ action: "attack", damage: 1, hint: "The guardsman's arm drops.", tell: "The guardsman rips spears out of his body and throws them forward!" },
				{ action: "windup", hint: "The guardsman's flesh bulges.", tell: "The guardsman picks off another spear and draws his arm backwards." },
				{ action: "attack", damage: 2, hint: "The guardsman's arm cocks back tight.", tell: "The guardsman launches the spear forward with great speed!" },
				{ action: "attack", damage: 1, hint: "The guardsman's arm drops.", tell: "The guardsman picks off one more spear and stabs with it!" },
				{ action: "windup", hint: "The guardsman's fingers curl.", tell: "The guardsman digs its fingers into its own flesh." },
				{ action: "attack", damage: 1, hint: "The guardsman's arm drops.", tell: "The guardsman hurls a spear!" },
				{ action: "windup", hint: "The guardsman's flesh bulges.", tell: "Another spear emerges from within the guardsman's flesh." },
				{ action: "attack", damage: 2, hint: "The guardsman's arm cocks back tight.", tell: "The guardsman launches the spear forward with great speed!" },
				{ action: "windup", hint: "The guardsman's fingers curl.", tell: "The guardsman grips a spear tightly, aiming." }
			]
		),
		two_headed_spirit: new EnemyClass(
			"Two Headed Spirit",
			20,
			[
				{ action: "attack", damage: 1, hint: "The spirit turns, covering its second head.", tell: "The spirit screeches with a loud intensity!" },
				{ action: "windup", hint: "The spirit wraps around behind you.", tell: "The large head inhales, building a terrible sound." },
				{ action: "windup", damage: 1, hint: "The spirit spins in place, whistling.", tell: "The spirit's whistles boil." },
				{ action: "attack", damage: 1, hint: "The spirit turns, covering its second head.", tell: "The spirit blows forward a freezing breath." },
				{ action: "windup", hint: "The spirit wraps around behind you.", tell: "The spirit's voice collects into a rising hum." },
				{ action: "attack", damage: 1, hint: "The spirit spins backwards, whistling.", tell: "The spirit screeches with loud intensity!" }
			]
		),
		spirit_mass: new EnemyClass(
			"Mass of Spirits",
			20,
			[
				{ action: "windup", hint: "The spirits zip around one another.", tell: "The spirits gather together, folding over one another." },
				{ action: "attack", damage: 1, hint: "The spirits boil as they compress.", tell: "Some spirits break away, swing their arms!" },
				{ action: "windup", hint: "The spirits zip around one another.", tell: "The spirits flail around." },
				{ action: "attack", damage: 1, hint: "The spirits clamber around each other.", tell: "Some spirits break away, attempt to bite!" },
				{ action: "attack", damage: 1, hint: "The spirits boil as they compress.", tell: "The spirits screech in unison!" },
				{ action: "attack", damage: 1, hint: "The spirits clamber around each other.", tell: "The spirits blow out a freezing breath!" }
			]
		),
		floating_torso: new EnemyClass(
			"Floating Torso",
			20,
			[
				{ action: "attack", damage: 1, hint: "The eye twitches.", tell: "A spear spits out from the center of the eye!" },
				{ action: "attack", damage: 2, hint: "The iris bleeds green.", tell: "A jet of light beams out from the eye!" },
				{ action: "windup", hint: "The pupil dilates.", tell: "The eye's pupil melts into its iris, emitting a green glow." },
				{ action: "windup", hint: "The iris color shifts to a deep black.", tell: "Two swords materialize by the torso." },
				{ action: "attack", damage: 1, hint: "The eye twitches.", tell: "The first sword stabs forward!" },
				{ action: "attack", damage: 1, hint: "The eye twitches.", tell: "The second sword slices vertically!" },
				{ action: "attack", damage: 2, hint: "The iris bleeds green.", tell: "Two swords sweep in an arch as they materialize!" },
				{ action: "windup", hint: "The iris color shifts to a deep black.", tell: "The swords circle, building momentum." },
				{ action: "windup", hint: "The pupil dilates.", tell: "The eye pulses, preparing another beam." }
			]
		),
		eldritch_judge: new EnemyClass(
			"Growth of Flesh",
			20,
			[
				{ action: "attack", damage: 1, hint: "The gavel's surface pulses.", tell: "The growth of flesh slams the gavel down!" },
				{ action: "attack", damage: 1, hint: "The gavel's surface pulses.", tell: "The gavel crashes down, shockwaves erupt!" },
				{ action: "windup", hint: "Loose strips of flesh wind into spikes.", tell: "Spurts of flesh latch onto the gavel, spinning it in the air." },
				{ action: "windup", hint: "The spikes of flesh compress close.", tell: "The gavel pulses with fleshy growths." },
				{ action: "attack", damage: 1, hint: "The mound of flesh pumps and swells.", tell: "The growth of flesh swings the gavel sideways!" },
				{ action: "attack", damage: 1, hint: "The mound of flesh pumps and swells.", tell: "The gavel explodes out into spikes before reforming!" }
			]
		),
		question_mark: new EnemyClass(
			"???",
			20,
			[
				{ action: "windup", hint: "The air grows dense.", tell: "A skull forms in the air." },
				{ action: "attack", damage: 1, hint: "A liquid drips.", tell: "A black ball goop appears, immediately exploding!" },
				{ action: "attack", damage: 1, hint: "A liquid drips.", tell: "A black ball goop appears, immediately exploding!" },
				{ action: "attack", damage: 2, hint: "The dark pools grow.", tell: "Two balls of goop appear, immediately exploding!" },
				{ action: "windup", hint: "The air pressure pops.", tell: "A skull forms in the air." },
				{ action: "attack", damage: 2, hint: "The dark pools grow.", tell: "Two balls of goop appear, immediately exploding!" },
				{ action: "windup", hint: "The air grows dense.", tell: "A skull forms in the air" },
				{ action: "attack", damage: 1, hint: "A liquid drips.", tell: "A black ball goop appears, immediately exploding!" },
				{ action: "windup", hint: "The air pressure pops.", tell: "A skull forms in the air." }
			]
		),
		charred_moose: new EnemyClass(
			"Horned Beast",
			20,
			[
				{ action: "attack", damage: 1, hint: "Embers flare from its nostrils.", tell: "The beast kicks backwards!" },
				{ action: "windup", hint: "The beast's antlers glow.", tell: "The beast lowers its head and kicks up dirt." },
				{ action: "attack", damage: 1, hint: "Flames bellow out from its nostrils.", tell: "The beast charges forward!" },
				{ action: "windup", hint: "The beast's antlers glow.", tell: "The beast presses close the ground, snorting embers." },
				{ action: "attack", damage: 1, hint: "Flames bellow out from its nostrils.", tell: "The beast spits out boiling blood!" },
				{ action: "attack", damage: 1, hint: "Embers flare from its nostrils.", tell: "The beast lashes out with its charred antlers." }
			]
		),
		floating_limbs: new EnemyClass(
			"Floating Limbs",
			20,
			[
				{ action: "attack", damage: 1, hint: "A limb twitches.", tell: "The creature severs one of its limbs on its sword, launching it forward" },
				{ action: "windup", hint: "The creature's limbs scratch at eachother.", tell: "The creature winds its arm back." },
				{ action: "attack", damage: 1, hint: "A limb twitches.", tell: "The creature hurls a severed hand." },
				{ action: "windup", hint: "The creature's limbs grab one another.", tell: "The creature rips free another limb." },
				{ action: "attack", damage: 1, hint: "A limb twitches.", tell: "The creature slashes with a jagged bone." },
				{ action: "attack", damage: 2, hint: "The creature begins to shake.", tell: "The creature's sword pulls out from under it and jets forward!" },
				{ action: "attack", damage: 2, hint: "The creature begins to shake.", tell: "The creature spits out a glob of acidic blood!" },
				{ action: "windup", hint: "The creature's limbs grab one another.", tell: "The creature's sword returns, once again impaling it." },
				{ action: "windup", hint: "The creature's limbs scratch at eachother.", tell: "The creature's limbs float back and reattach themselves." }
			]
		),
		merged_corpses: new EnemyClass(
			"Walking Pile of Corpses",
			20,
			[
				{ action: "windup", hint: "The pile shakes and squeezes inward.", tell: "The pile shudders, limbs coiling together." },
				{ action: "attack", damage: 1, hint: "The bodies begin to crack under their own pressure.", tell: "The creature explodes out, biting down on whatever the heads can catch." },
				{ action: "attack", damage: 1, hint: "Loose bodies crack apart.", tell: "A dozen hands claw outwards at once." },
				{ action: "attack", damage: 1, hint: "Loose bodies crack apart.", tell: "The creature lashes out, leaping from the center mass." },
				{ action: "windup", hint: "The pile shakes and squeezes inward.", tell: "The corpses inhale in unison, clicking as it compresses." },
				{ action: "attack", damage: 1, hint: "The bodies begin to crack under their own pressure.", tell: "The mass collapses forward, cracking the ground infront of it." }
			]
		),
		eteocle: new EnemyClass(
			"Eteocle",
			19,
			[
				{ action: "windup", hint: "Eteocle's shoulders shift.", tell: "Eteocle covers himself with his cloak." },
				{ action: "windup", damage: 1, hint: "The air wraps around itself.", tell: "Etecole moves under the veil, barely visibly." },
				{ action: "attack", damage: 1, hint: "The air ripples.", tell: "A hand appears from behind the veil, swinging a dagger wildly!" },
				{ action: "attack", damage: 1, hint: "The air ripples.", tell: "Eteocle shouts just before he stabs forward from behind the veil!" },
				{ action: "windup", hint: "Eteocle's shoulders shift.", tell: "Eteocle stumbles out of his cloak as he winds up his sword." },
				{ action: "attack", damage: 1, hint: "The air warps.", tell: "A sword shakily swipes from behind a veil!" }
			],
			"Coward"
		),
		viselli_dial: new EnemyClass(
			"The Lady",
			5,
			[
				{action: "rest", tell: "Filler"}
			],
			"General"
		),
		viselli_friendly: new EnemyClass(
			"Viselli",
			999,
			[
				{action: "rest", tell: "Viselli says hi!"}
			],
			"General"
		),
		camilos_dial: new EnemyClass(
			"Camilos",
			30,
			[
				{ action: "attack", damage: 1, tell: "Camilos steps forward and swings his sword in one motion." },
				{ action: "attack", damage: 2, tell: "Camilos takes three shots with his flintlock." },
				{ action: "attack", damage: 1, tell: "Camilos follows up with a delayed fourth shot." },
				{ action: "attack", damage: 2, tell: "Camilos drops his stance low, then thrusts upward." },
				{ action: "attack", damage: 1, tell: "Camilos stabs towards any gaps he finds." },
				{ action: "attack", damage: 1, tell: "Camilos fires a single shot as he steps within reach." },
				{ action: "attack", damage: 2, tell: "Camilos fires two more shots with his flintlock." },
				{ action: "attack", damage: 1, tell: "Camilos leaps forward, bringing his blade down as he closes the distance." },
				{ action: "attack", damage: 1, tell: "Camilos faints with his blade, then slips a flintlock shot past." }
			],
			"Soldier"
		),
		camilos_angered: new EnemyClass(
			"Camilos",
			20,
			[
				{ action: "windup", hint: "Camilos's breathing tightens.", tell: "Camilos's grip tightens, his breath hisses out with anger." },
				{ action: "attack", damage: 2, hint: "Camilos lunges off-balance.", tell: "Camilos swings with all his strength, overextending!" },
				{ action: "attack", damage: 1, hint: "Camilos steadies his feet.", tell: "Camilos presses forward with another slash." },
				{ action: "attack", damage: 2, hint: "Camilos lunges off-balance.", tell: "Camilos fires a shot at point-blank range!" },
				{ action: "windup", hint: "Camilos goes still.", tell: "Camilos's hand shakes as he reaches for his pouch." },
				{ action: "attack", damage: 1, hint: "Camilos steadies his feet.", tell: "Camilos lunges with a ragged thrust." },
				{ action: "windup", hint: "Camilos's breathing tightens.", tell: "Camilos stumbles, catching himself on his back foot." },
				{ action: "attack", damage: 1, hint: "Camilos steadies his feet.", tell: "Camilos slashes in a wide, heavy arc." },
				{ action: "windup", hint: "Camilos goes still.", tell: "Camilos is breathing hard, focusing as he recovers." }
			],
			"Soldier"
		),
		camilos_monster: new EnemyClass(
			"Camilos",
			20,
			[
				{ action: "windup", hint: "The canopy collects inward.", tell: "The branches along its arm curl inward, coiling tight." },
				{ action: "attack", damage: 2, hint: "The structure lurches.", tell: "A limb whips down, splintering the ground!" },
				{ action: "attack", damage: 1, hint: "Small twigs shiver.", tell: "Twigs lash out in a wide, creaking arc." },
				{ action: "attack", damage: 2, hint: "The structure lurches.", tell: "The trunk lurches forward, slamming a fused mass of limbs outward!" },
				{ action: "windup", hint: "The branches of the tree entangle.", tell: "Something inside the trunk groans, reshaping itself." },
				{ action: "attack", damage: 1, hint: "Small twigs shiver.", tell: "A thin branch whips forward with a wet crack." },
				{ action: "windup", hint: "The branches of the tree entangle.", tell: "The face splits wider, bark peeling as it drags itself forward." },
				{ action: "attack", damage: 1, hint: "Small twigs shiver.", tell: "A claw of splintered wood swipes in a wide arc." },
				{ action: "windup", hint: "The canopy collects inward.", tell: "It shudders, Camilos' voice escaping from somewhere deep inside. \"why... did you betray me...\"" }
			],
			"Soldier"
		),
		beerbark_dial: new EnemyClass(
			"Beerbark",
			100,
			[
				{ action: "attack", damage: 1, tell: "Beerbark tosses a fistful of powdered glass, it explodes mid-air." },
				{ action: "attack", damage: 2, tell: "Beerbark pulls out a spiraling wooden staff and slams it onto the ground. The air turns scorching hot!" },
				{ action: "attack", damage: 1, tell: "Beerbark unhooks a battered metal flask and drinks, spitting out a hot fire!" },
				{ action: "attack", damage: 2, tell: "Beerbark shakes a dog's pelt, bullets shoot out!" },
				{ action: "attack", damage: 1, tell: "Beerbark throws a needle that rapidly grows in size as it approaches!" },
				{ action: "attack", damage: 2, tell: "Beerbark fires a flintlock pistol, laughing as the smoke clears!" },
				{ action: "attack", damage: 1, tell: "Beerbark tosses a fistful of powdered glass, it explodes mid-air!" },
				{ action: "attack", damage: 2, tell: "Beerbark drops a rotten hand on the floor, it leaps forward!" },
				{ action: "attack", damage: 1, tell: "Beerbark steps back, grinning, and hurls a glass jar that shatters into a choking mist." }
			],
			"Pirate"
		),
		eteocle_dial: new EnemyClass (
			"Eteocle",
			1,
			[
				{action: "attack", damage: 1, tell: "Eteocle swings his blade with desparation!"},
				{action: "rest", tell: "Eteocle loses his balance."}
			],
			"Coward"
		),
		diving_suit: new EnemyClass (
			"Diving Suit Creature",
			15,
			[
				{ action: "rest",   hint: "The creature's seams pulse.", tell: "The creature winds up its arm." },
				{ action: "attack", damage: 1, hint: "The joints of the suit creak.", tell: "The creature swings upwards with a mighty punch!" },
				{ action: "attack", damage: 1, hint: "The joints of the suit creak.", tell: "The creature slams a fist downward!" }
			]
		)
}

// Map for the enemies actions, links the strings to an outcome
const enemyActionsMap = {
	  "windup": {
			habitatAction: false,
			enemyAction: (player, enemy) => {
      	enemy.damageBoost += 1;
    	}
		},
  	"rest": {
			habitatAction: false,
			enemyAction: (player, enemy) => {},
		},
		"resetPlayer": {
			habitatAction: true,
			enemyAction: (_playerOld, _enemy, combat) => {
				const truePlayer = State.variables.player;
				
				if (truePlayer.armor > 0) combat.attackPlayerFunc(truePlayer.armor, true);
				if (truePlayer.inventory[6]) truePlayer.inventory[6] = null;
				combat.pushCombatLogs(`${truePlayer.name}'s weapon morphs and rusts!`, 'rgb(149, 119, 29)');

				// Redundancy for safety, remove player armor incase they still have it
				if (truePlayer.inventory[15]) truePlayer.unprepareEquipment(truePlayer.inventory[15]);

				// Redundancy for safety, remove all statuses from player incase they still have any
				truePlayer.playerStatus = [];
				combat.pushCombatLogs(`A sensation of weakness washes over ${truePlayer.name}!`, 'rgb(149, 119, 29)');

				// Remove all player gold
				updateGold(-1 * truePlayer.inventory[0].amount);
				
				// Remove all player itmes in their inventory that isn't the big four memories
				const keepList = ["Mem_Cwd", "Mem_Gnrl", "Mem_Prt", "Mem_Sldr"];
				for (let i = 1; i < truePlayer.inventory.length; ++i) {
					if (!truePlayer.inventory[i]) continue;
					if (keepList.includes(truePlayer.inventory[i].templateKey)) continue;
					
					removeItemFromInventory(i);
				}
				combat.pushCombatLogs(`${truePlayer.name}'s bag feels lighter!`, 'rgb(149, 119, 29)');

				// Give player basic weapon
				const restartWeapon = allItems["rusty_sword"].dup();
				restartWeapon.equipped = true;
				truePlayer.inventory[6] = restartWeapon;
				truePlayer.equippedWeapon = truePlayer.inventory[6];
			}
		}
};

const enemyRewardsMap = {
	"crazed_axeman": ["blank_orb"],
	"sleeping_blob": ["testKey"],
	"coagulated_fear": ["Mem_Fr"],
	"big_dog": ["Mem_Dg"],
	"guardsman": ["Mem_Grd"],
	"spirit_mass": ["Mem_Ppl"],
	"two_headed_spirit": ["Mem_MD"],
	"floating_torso": ["Mem_Vctm"],
	"eldritch_judge": ["Mem_Jge"],
	"question_mark": ["blank_orb"],
	"charred_moose": ["Mem_Mse"],
	"floating_limbs": ["Mem_Chld", "sharpest_stick_2"],
	"merged_corpses": ["Mem_Bds"],
	"eteocle": [],
	"eteocle_dial": ["Mem_Cwd", "spiked_shield"],
	"viselli_dial": ["Crkd_Aclde"],
	"viselli": ["Mem_Gnrl"],
	"camilos_dial": ["Mem_Sldr", "mtshot_flintlock"],
	"camilos_angered": ["Mem_Sldr"],
	"camilos_monster": ["Mem_Sldr"],
	"beerbark_dial": ["Mem_Prt", "Green_Crystal2"],
	"diving_suit": [],
	"viselli_friendly": ["Mem_Gnrl"]
}

const hostileLocs = {
	"Gym_1_2": "crazed_axeman",
	"Dgn2": "sleeping_blob",
	"Pinky_10_6": "coagulated_fear",
	"Pinky_6_3": "big_dog",
	"Pinky_1_3": "guardsman",
	"MiddleRing_6_2": "spirit_mass",
	"MiddleRing_2_1": "two_headed_spirit",
	"MiddleRing_1_6": "floating_torso",
	"MiddleRing_11_5": "eldritch_judge",
	"Palm_6_0": "crazed_axeman",
	"Palm_4_6": "question_mark",
	"Thumb_6_4": "charred_moose",
	"Thumb_6_7": "floating_limbs",
	"Thumb_2_8": "merged_corpses",
	"OldHouse3": "eteocle",
	"Opening3": "diving_suit"
};

let hostileLocsVersion = 0;

function editHostileLocs(location, value) {
	hostileLocs[location] = value;

	const exclusionList = ["Opening3"];

	if (exclusionList.includes(location)) return;
	
	hostileLocsVersion++;
}