// Since there can be multiple of same item in the player's inventory, guarantees that each item is unique behind the scenes. 
let _nextItemUid  = 0;

class ItemClass {
    constructor(name, iconImage, description, effect = "", effectSuccess = "", 
			          effectFail = "", combatUsable = false, isPrepared = false, 
								isImportant = false, amount = 1) {
			this.uid = `i${_nextItemUid++}`; // Unique id of each item in the game
			this.name = name; // Primary name for an item.
			this.iconImage = iconImage; // Deprecated, unused
			this.description = description; // Usually holds a small lore hint along with what the item looks like.
			this.effect = effect; // A secondary name for an item. Can be shared between items with different primary names. Not visible to the player.
			this.effectSuccess = effectSuccess; // Deprecated, unused
			this.effectFail = effectFail; // Deprecated, unused
			this.combatUsable = combatUsable; // Determines if an item can be used in combat
			this.isPrepared = isPrepared; // Determines if an item is currently prepared for combat
			this.isImportant = isImportant; // Determines if the item can be discarded from the inventory or not
			this.amount = amount; // Only ever used by gold, all other items are not guaranteed to support more than 1 amount
    }

		/*
		 
			Exists because Twine will refresh classes with clone() on a page refresh 
			That messes with _nextItemUid, so a custom dup() exists in order to keep uids consistent.

		*/
		dup() {
			// Duplicates all member variables into a new version of this exact item (the exception being uid).
    	const c = new this.constructor(
				this.name,
				this.iconImage,
				this.description,
				this.effect,
				this.effectSuccess,
				this.effectFail, 
				this.combatUsable,
				this.isPrepared,
				this.isImportant,
				this.amount
			);

			// This member variable came into existence much later than the others. Likely could go inside, but if it ain't broke.
			c.templateKey = this.templateKey;
			
			return c;
	}
}

class EquipmentClass extends ItemClass {
    constructor(name, iconImage, description, combatEffects = [], ...itemArgs) {
        super(name, iconImage, description, ...itemArgs);
        this.combatEffects = combatEffects; // Passive Effects specifically for combat
        this.equipped = false; // No item is equipped by default
				this.combatUsable = false; // This override exists likely due to an oversight, it doesn't break anything because its importance is unknown.
				this.isPrepared = false; // No equipment is prepared by default. Would've been better if I didn't declare first it above since only equipment types can be prepared.
				this.type = "equipment" 
    }

		// Extends the parent duplication function by also duplicating the new variables introduced with this class.
		dup () {
			const dup = super.dup();
			dup.combatEffects = [...this.combatEffects];
			dup.equipped = this.equipped;
			dup.type = this.type; // Unnecessary but harmless
			dup.combatUsable = false; // Redundancy for safety
			dup.isPrepared = false; // Redundancy for safety

			return dup;
		}
}

class WeaponClass extends EquipmentClass {
    constructor(name, iconImage, description, damage, combatEffects = []) {
        super(name, iconImage, description, combatEffects);
        this.damage = damage;
        this.type = "weapon";
    }

		// Extends the parent duplication function by also duplicating the new variables introduced with this class.
		dup () {
			const dup = super.dup();
			dup.damage = this.damage;
			dup.type = this.type; // Unnecessary but harmless
			
			return dup;
		}
}

class ArmorClass extends EquipmentClass {
    constructor(name, iconImage, description, defense, combatEffects = []) {
        super(name, iconImage, description, combatEffects);
        this.defense = defense; // Doubles as armor health
				this.maxHealth = defense; // Allows armor to be healed to max defense should the time come.
        this.type = "armor";
    }

		// Extends the parent duplication function by also duplicating the new variables introduced with this class.
		dup () {
			const dup = super.dup();
			dup.defense = this.defense;
			dup.type = this.type; // Unnecessary but harmless
			dup.maxHealth = this.maxHealth;
			
			return dup;
		}
}

// A map that hold every item that can exist in the game
const allItems = {
	testItem: new ItemClass(
			"Armor Booster",
			"booster.png",
			"Grants temporary armor",
			"ArmorBoost",
			"...",
			"...",
			true,
			false,
			false,
			1
	),
	testKey: new ItemClass(
		"Standard Key",
		"test_key.png",
		"Opens regular locks",
		"StandardUnlock",
		"...",
		"...",
		false,
		false,
		false,
		1
	),
	exitKey: new ItemClass(
		"Exit Key",
		"exit_key.png",
		"Allows player to exit demo",
		"ExitDemo",
		"...",
		"...",
		false,
		false,
		false,
		1
	),
	Mem_Cwd: new ItemClass(
		"Orb of a Coward",
		"Mem_Cwd.png",
		"Wisps of a memory swirl within the sphere. A man runs from a village as it burns behind him.",
		"Mem_Cwd",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Prt: new ItemClass(
		"Orb of a Pirate",
		"Mem_Prt.png",
		"Wisps of a memory swirl within the sphere. A pirate stares at a pendant through a window.",
		"Mem_Prt",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Sldr: new ItemClass(
		"Orb of a Soldier",
		"Mem_Sldr.png",
		"Wisps of a memory swirl within the sphere. A soldier slaughters as he weeps.",
		"Mem_Sldr",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Gnrl: new ItemClass(
		"Orb of a General",
		"Mem_Gnrl.png",
		"Wisps of a memory swirl within the sphere. A general leads an army through various locations, the numbers in the army slowly dwindling.",
		"Mem_Gnrl",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_MD: new ItemClass(
		"Orb of a Mother and her Daughter",
		"Mem_MD.png",
		"Wisps of a memory swirl within the sphere. A girl is wrapped under blankets. The mother watches over her.",
		"Mem_MD",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Dg: new ItemClass(
		"Orb of a Dog",
		"Mem_Dg.png",
		"Wisps of a memory swirl within the sphere. A dog guards a family as they enjoy a picnic.",
		"Mem_Dg",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Fr: new ItemClass(
		"Orb of a Coagulation",
		"Mem_Fr.png",
		"Wisps of a memory swirl within the sphere. A man darts back and forth within a watch tower, keeping track of a conflict.",
		"Mem_Fr",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Ppl: new ItemClass(
		"Orb of the Souls",
		"Mem_Ppl.png",
		"Wisps of a memory swirl within the sphere. A mass of people attempt to fight off a single soldier.",
		"Mem_Ppl",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Jge: new ItemClass(
		"Orb of a Judge",
		"Mem_Jge.png",
		"Wisps of a memory swirl within the sphere. A man sorts tiredly through paperwork.",
		"Mem_Jge",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Vctm: new ItemClass(
		"Orb of a Victim",
		"Mem_Vctm.png",
		"Wisps of a memory swirl within the sphere. A man watches an execution while lost in thought.",
		"Mem_Vctm",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Mse: new ItemClass(
		"Orb of a Moose",
		"Mem_Mse.png",
		"Wisps of a memory swirl within the sphere. A moose searches for food in a burnt forest.",
		"Mem_Mse",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Bds: new ItemClass(
		"Orb of a Body",
		"Mem_Vctm.png",
		"Wisps of a memory swirl within the sphere. A man lays on the ground, dying.",
		"Mem_Bds",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Chld: new ItemClass(
		"Orb of a Child",
		"Mem_Chld.png",
		"Wisps of a memory swirl within the sphere. A child watches a man through a pile of corpses.",
		"Mem_Chld",
		"...",
		"...",
		false,
		false,
		true
	),
	Mem_Grd: new ItemClass(
		"Orb of a Guard",
		"Mem_Grd.png",
		"Wisps of a memory swirl within the sphere. A guard stands by a gate, spear in hand.",
		"Mem_Grd",
		"...",
		"...",
		false,
		false,
		true
	),
	Green_Crystal: new ItemClass(
		"Hollow Green Crystal Pendant",
		"GCEnergy.png",
		"The crystal pendant glows with a green hue. Its center is broken and hollow, a piece of it is missing.",
		"GCEnergy",
		"...",
		"...",
		false,
		false,
		true
	),
	Green_Crystal2: new ItemClass(
		"Cracked Green Crystal Pendant",
		"GCEnergy.png",
		"The crystal pendant glows with a green hue. It is cracked and broken off at the egdes, it was once part of a larger crystal.",
		"GCEnergy",
		"...",
		"...",
		false,
		false,
		true
	),
	prt_key: new ItemClass(
		"Pirate Key",
		"prt_key.png",
		"A key, adorned with the emblem of a skull. This type of key is often used for chests.",
		"prt_key",
		"...",
		"...",
		false,
		false,
		true,
		1
	),
	flacon_defense: new ItemClass(
		"Flacon of Protection",
		"flacon_defense.png",
		"A vial containing transluscent dust with a blue glow. Spraying the dust on oneself forms a temporary protective bubble that guards against a small amount of damage.",
		"ArmorBoost",
		"...",
		"...",
		true,
		false,
		false,
		1
	),
	sm_sword: new WeaponClass(
		"Solid Metal Sword",
		"sm_sword.png",
		"A well-balanced sword, very commonly used during its time.",
		10,
		[]
	),
	sharp_stick: new WeaponClass(
		"Sharp Stick",
		"sharp_stick.png",
		"An especially pointy and sturdy stick.",
		1,
		[]
	),
	rusty_sword: new WeaponClass(
		"Rusty Sword",
		"rusty_sword.png",
		"An old, worn-down sword",
		5,
		[]
	),
	shield_trinket: new ArmorClass(
		"Bronze Shield Necklace",
		"...",
		"A bronze shield-shaped pendant hangs from a necklace. Protects its wearer from a hit once.",
		1
	),
	shield_trinket_2: new ArmorClass(
		"Silver Shield Necklace",
		"...",
		"A silver shield-shaped pendant hangs from a necklace. Protects its wearer from a hit once.",
		2
	),
	shield_trinket_3: new ArmorClass(
		"Gold Shield Necklace",
		"...",
		"A gold shield-shaped pendant hangs from a necklace. Protects its wearer from a hit once.",
		3
	),
	generals_suit: new ArmorClass(
		"General's Suit",
		"...",
		"Golden adornments are woven throughout this suit. One of a high status had owned this.",
		15
	),
	mtshot_flintlock: new WeaponClass(
		"Multishot Flintlock",
		"...",
		"A flintlock with a revolving chamber, carrying 5 barrels. Is able to be fire despite storing no bullets in chamber.",
		15
	),
	spiked_shield: new ArmorClass(
		"Spiked Shield",
		"...",
		"A standard shield modified with spikes attached onto the outward face.",
		10,
		["Thorns"]
	),
	falchion: new WeaponClass(
		"Damaged Falchion",
		"...",
		"A pirate's favorite sword, now chipped and not as effective as it once was.",
		3
	),
	cowards_pendant: new EquipmentClass(
		"Coward's Pendant",
		"...",
		"Fear essence has been concentrated into a small circular pendant. Has a chance of inflicting fear on an enemy that attacks anyone not defending.",
		["Counter_Fear"]
	),
	dog_pelt: new ArmorClass(
		"Dog's Pelt",
		"...",
		"Pelt of a dog. Slightly increases defense.",
		2
	),
	guard_spear: new WeaponClass(
		"Guard's Spear",
		"...",
		"A standard spear, once used by a guard. Successive attacks increase damage.",
		3,
		["Dmg_Stack"]
	),
	banshee_whistle: new WeaponClass(
		"Banshee's Whistle",
		"...",
		"A whistle that only emits a loud screech. Disorients those who are victim to its noise.",
		5,
		["Disorient"]
	),
	mother_blanket: new ArmorClass(
		"A Mother's Blanket",
		"...",
		"A blanket once used to hide an important individual. May be able to hide one from an incoming attack.",
		2,
		["Hide_Chance"]
	),
	flintlock: new WeaponClass(
		"Flintlock",
		"...",
		"A standard flintlock pistol, is able to fire despite a lack of ammo. Small chance to trigger a critical on an outgoing hit.",
		7,
		["Crit_Chance"]
	),
	meaty_gavel: new WeaponClass(
		"Meaty Gavel",
		"...",
		"A judge's gavel, made of muscle tissue. Swaying growths extending from the gavel may be able to subdue targets on an outgoing hit.",
		4,
		["Subdue"]
	),
	moose_pelt: new ArmorClass(
		"Moose's Pelt",
		"...",
		"Pelt of a moose. The fur-side continues to smolder. Incoming hits may burn the aggressor.",
		3,
		["Burn_Chance"]
	),
	sharpest_stick: new WeaponClass(
		"The Sharper Stick",
		"...",
		"Prized possession of a village child. Very occasionally is the deadliest of weapons.",
		5,
		["deadly_1"]
	),
	sharpest_stick_2: new WeaponClass(
		"The Sharpest Stick",
		"...",
		"Prized possession of a village child. Extremely deadly on the correct prey.",
		5,
		["deadly_2"]
	),
	skin_suit: new ArmorClass(
		"Skin Suit",
		"...",
		"Armor made from the scarred and charred skin of fallen villagers.",
		10,
		[]
	),
	blank_orb: new ItemClass(
		"Cloudy Orb",
		"...",
		"Memories flash from within the orb, however it's nearly impossible to make out whats happening.",
		"EyeOrb",
		"...",
		"...",
		false,
		false,
		true,
		1
	),
	Crkd_Aclde: new ItemClass(
		"Cracked Accolade",
		"...",
		"An accolade given to someone who's accomplished quite a bit in the military. Once held a some kind of power before it was broken.",
		"Crkd_Aclde",
		"...",
		"..."
	),
	gold_display: new ItemClass(
		"Gold",
		"gold.png",
		"...",
		"...",
		"...",
		"...",
		false,
		false,
		false,
		0
	),
	nullItem: new ItemClass(
		"...",
		"...",
		"...",
		"...",
		"...",
		"...",
		false,
		false,
		false,
		0
	)
}

// Gives every item its own key 
for (const key in allItems) {
  allItems[key].templateKey = key;
}

// Tracks if the player destroyed, returned, or hasn't done anything with the memory orbs.
State.variables.memoryStates = {
	memories: {
		"Mem_MD" : 0,
		"Mem_Dg": 0,
		"Mem_Fr": 0,
		"Mem_Ppl": 0,
		"Mem_Jge": 0,
		"Mem_Vctm": 0,
		"Mem_Mse": 0,
		"Mem_Bds": 0,
		"Mem_Chld": 0,
		"Mem_Grd": 0,
		"Mem_Cwd": 0,
		"Mem_Sldr": 0,
		"Mem_Prt": 0,
		"Mem_Gnrl": 0
	},
	version: 0 // Deprecated, unused
}

function addItemToInventory(itemName, amount = -1) {
	const inventory = State.variables.player.inventory;
	const item = allItems[itemName].dup();
	if (amount !== -1) item.amount = amount;
  
	for (let i = 0; i < inventory.length; ++i) {
		// Ignore slots 6, 7, 8, 15, 16, 17 as these are reserved for prepared/equipped items.
		if (i % 9 > 5 && i <= 17) {continue;}
		
		// Adds item to inventory if the slot is empty
		if (!inventory[i]) {
			inventory[i] = item;
			return i; // Returns the slot the item was placed into.
		}
	}

	return -1; // Returns -1 if the inventory is full
}

function removeItemFromInventory(itemIndex) {
	const inventory = State.variables.player.inventory;
	const item = inventory[itemIndex];
	
	inventory[itemIndex] = null;

	// Going to be honest, don't remember why this is here. Won't remove it because it doesn't break anything.
	return !!item;
}

function findItemInInventory(itemName) {
	const inventory = State.variables.player.inventory;

	for (let i = 0; i < inventory.length; ++i) {
		if (!inventory[i]) continue; 
		
		if (inventory[i].templateKey == itemName) {
			return i; // Returns slot index of item in inventory
		}
	}

	return -1; // Returns -1 if item isn't in inventory
}

function updateGold(goldAmount) {
	const player = State.variables.player;

	player.inventory[0].amount += goldAmount; // Every game is initialized with gold at slot 0
}

// Function is used in combat
function makeStatusInstance(effectKey, source, effectMap = combatEffectMap, durationOverride = null) {
	const def = effectMap[effectKey];
	/* 
	
	Each effect has a function that stores its initial state.
	However I implemented those functions much later.
	Therefore Incase I missed on or the effect doesn't care about its initial state, there's a fallback option.
	
	*/
	const initial = def?.getInitialState ? def.getInitialState() : {};

	return {
		name: effectKey,
		duration: durationOverride ?? def?.duration ?? 1, // Allows for a custom duration, falls back to item duration, then 1 if necessary
		source,
		...initial
	};
}

function setMemoryStates(memoryId, value) {
	const memoryStates = State.variables.memoryStates;

	if (memoryStates) {
		memoryStates.memories[memoryId] = value;
		memoryStates.version += 1; // Memories version is deprecated, this stays just because it doesn't break anything
	}
}