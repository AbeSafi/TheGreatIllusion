const inventoryConfig = {
    imgSize: { width: 800, height: 600 },
    containerSize: { width: 80, height: 80 },
    grid: {
			offsetTop: 13.4,
			offsetLeft: 8.8, 
			cols: 9,
			rows: 6,
			slotSize: 73
    }
};

function fillSlot(inner, itemName) {
	inner.textContent = itemName;
	inner.style.fontFamily = "Georgia, 'Times New Roman', Times, serif";
	inner.style.border = '2px solid transparent';
	inner.style.color = 'rgb(60, 31, 6)';
	inner.style.cursor = 'pointer';
	if (inner.parentElement) inner.parentElement.style.cursor = 'pointer';
}

function emptySlot(inner) {
	inner.textContent = '';
	inner.style.border = 'transparent';
	inner.style.color = 'transparent';
	inner.style.cursor = 'default';
	if (inner.parentElement) inner.parentElement.style.cursor = 'default';
}

function createInventoryPopUp(context = null, combatUI = null) {
	const overlay = document.createElement('div');
	overlay.className = 'inv-overlay';
	overlay.context = context;
	overlay.combatUI = combatUI;
	
	const inventoryElement = openInventoryUI(overlay);

	const closeInventory = () => {
		if (!document.body.contains(overlay)) return;
		document.body.removeChild(overlay);
		if (State.variables.gameState == 'interaction') {
			State.variables.gameState = 'default';
		}
	};
	
	const closeButton = document.createElement('button');
	closeButton.className = 'inv-close-button';
	closeButton.textContent = 'Close';
	closeButton.addEventListener('click', closeInventory);
	inventoryElement.container.appendChild(closeButton);

	overlay.addEventListener('click', (e) => {
		if (!inventoryElement.imageDiv.contains(e.target)) closeInventory();
	});
	
	overlay.appendChild(inventoryElement.container);
	document.body.appendChild(overlay);
}

function openInventoryUI(overlay) {
	const container = document.createElement('div');
	container.className = 'inv-ui';
	
	const imageDiv = document.createElement('div');
	imageDiv.className = 'inv-image';
	
	// Inventory image setup
	const imgAspect = inventoryConfig.imgSize.width / inventoryConfig.imgSize.height;
	const divW = window.innerWidth * (inventoryConfig.containerSize.width / 100);
	const divH = window.innerHeight * (inventoryConfig.containerSize.height / 100);
	const divAspect = divW / divH;
	
	let renderedW, renderedH;
	if (imgAspect > divAspect) {
			renderedW = divW;
			renderedH = divW / imgAspect;
	} else {
			renderedH = divH;
			renderedW = divH * imgAspect;
	}
	
	imageDiv.style.width = renderedW + 'px';
	imageDiv.style.height = renderedH + 'px';
	imageDiv.style.backgroundImage = `url('./TGI/Drawings/UI/UID_Inventory.png')`;
	imageDiv.style.backgroundSize = 'contain';
	imageDiv.style.backgroundPosition = 'center';
	imageDiv.style.backgroundRepeat = 'no-repeat';
	imageDiv.style.position = 'relative';
	imageDiv.style.flexShrink = '0';

	// Give it an old paper texture
	addCoarseTexture(imageDiv)
	
	// Inventory slot setup
	const grid = document.createElement('div');
	grid.className = 'inv-grid';
	grid.style.position = 'absolute';
	
	const gridConfig = inventoryConfig.grid;
	const gridWidth = (gridConfig.cols * gridConfig.slotSize) / inventoryConfig.imgSize.width * 100;
	const gridHeight = (gridConfig.rows * gridConfig.slotSize) / inventoryConfig.imgSize.height * 100;
	
	grid.style.top = gridConfig.offsetTop + '%';
	grid.style.left = gridConfig.offsetLeft + '%';
	grid.style.width = gridWidth + '%';
	grid.style.height = gridHeight + '%';
	grid.style.display = 'grid';
	grid.style.gridTemplateColumns = `repeat(${gridConfig.cols}, 1fr)`;
	grid.style.gridTemplateRows = `repeat(${gridConfig.rows}, 1fr)`;
	grid.style.justifyItems = 'center';
	grid.style.alignItems = 'center';
	grid.style.pointerEvents = 'none';
	grid.style.zIndex = '2';
	
	const items = State.variables.player.inventory;
	const inCombat = State.variables.gameState === "combat";
	const inDefault = State.variables.gameState === "default";
	const inInteraction = State.variables.gameState === "interaction";
	
	for (let i = 0; i < gridConfig.cols * gridConfig.rows; i++) {
		const slot = document.createElement('div');
		slot.className = 'inv-slot';
		slot.dataset.index = i;
		
		slot.style.width = '100%';
		slot.style.height = '100%';
		slot.style.display = 'flex';
		slot.style.alignItems = 'center';
		slot.style.justifyContent = 'center';
		slot.style.pointerEvents = 'auto';
		slot.style.boxSizing = 'border-box';
		slot.style.padding = '7%';
		slot.style.zIndex = '3';
		
		// I create an inner slot within each slot because I want to have space 
		// between each item in the inventory and CSS's 'gap' attribute causes centering issues when paired with grids.
		const inner = document.createElement('div');
		inner.style.width = '100%';
		inner.style.height = '100%';
		inner.style.display = 'flex';
		inner.style.alignItems = 'center';
		inner.style.justifyContent = 'center';
		inner.style.fontSize = '10px';
		inner.style.border = '2px solid #0f00';
		inner.style.color = '#0f00';
		inner.style.boxSizing = 'border-box';
		inner.style.zIndex = '4';
		
		// Placeholder until I create images for each item
		if (items[i]) {
			fillSlot(inner, items[i].name);
		} else {
			emptySlot(inner);
		}
		
		slot.appendChild(inner);
		
		slot.addEventListener('click', () => {
			if (!items[i]) return;
			
			const item = items[i];
			
			if (inCombat) {
				handleItemCombat(item, slot, overlay);
			} else if (inDefault) {
				handleItemDefault(item, slot);
			} else if (inInteraction) {
				handleItemInteraction(item, slot, overlay);
			} else {
				UI.alert(`Future world interaction maybe.`);
			}
		});
		
		grid.appendChild(slot);
	}
	
	imageDiv.appendChild(grid);
	container.appendChild(imageDiv);
	
	return {container: container, imageDiv: imageDiv} ;
}

function addCoarseTexture(element) {
    const baseFrequency = 0.06
    const grainOpacity = 0.35;
    const blendMode = 'multiply';  
    
		// CSS goes too deep for me, thanks whom who shall not be named, saved me several hours.
    const coarseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='2' stitchTiles='stitch' result='noise1'/%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch' result='noise2'/%3E%3CfeDisplacementMap in='noise1' in2='noise2' scale='80' xChannelSelector='R' yChannelSelector='G'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeColorMatrix type='matrix' values='0.8 0 0 0 0.2  0.5 0 0 0 0.1  0.1 0 0 0 0.05  0 0 0 ${grainOpacity} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;
    const backgroundImage = element.style.backgroundImage;

		const hasImage = backgroundImage && backgroundImage !== 'none';
    
    element.style.backgroundImage = hasImage ? `${backgroundImage}, ${coarseTexture}` : coarseTexture;
    element.style.backgroundColor = '#e8d5b5';
    element.style.backgroundSize = hasImage ? 'contain, cover' : 'cover';
    element.style.backgroundPosition = 'center, center';
    element.style.backgroundRepeat = 'no-repeat, no-repeat';
    element.style.backgroundBlendMode = blendMode;
		element.style.position = 'relative';
		element.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)';
    
    const gradient = document.createElement('div');
    gradient.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 1;
        background: radial-gradient(circle at center, transparent 50%, #9b652e8f 100%);
    `;
    element.appendChild(gradient);
}

async function handleItemDefault(item, slot) {
	const isCombat = item.combatUsable;
	const isPrepared = item.isPrepared;
	const isEquipment = item instanceof EquipmentClass;
	const isWeapon = item instanceof WeaponClass;
	const isEquipped = item.equipped;
	const isImportant = item.isImportant;
	const index = parseInt(slot.dataset.index);
	const player = State.variables.player;
	const inventory = player.inventory;

	if (item.name == "Gold") {
		await selectionMenu("Gold", `Amount: ${inventory[0].amount}`, ["Exit"]);
		return;
	}

	let selections = [];

	if (isCombat) selections.push(((!isPrepared) ? "Prepare" : "Unprepare")); // If item not prepared, string is "prepare". Otherwise its "unprepare"
	if (isEquipment && ((isWeapon && !isEquipped) || !isWeapon)) selections.push(((!isEquipped) ? "Equip" : "Unequip")); // If item not equipped, item is "equip". Otherwise its "unequip" 
	if (!isPrepared && !isEquipped && !isImportant) selections.push("Discard"); // If item not currently in use, allow discard option.
	selections.push("Exit");

	let selection = await selectionMenu(item.name, item.description, selections);

	if (selection == "Prepare" || selection == "Unprepare") {
		const newIndex = (selection == "Prepare") ? player.prepareItem(index) : player.unprepareItem(item);
		if (newIndex == -1) return;

		const newSlot = document.querySelector(`[data-index="${newIndex}"]`);
		const newInner = newSlot.querySelector('div');
		const currentInner = slot.querySelector('div');

		inventory[newIndex] = item;
		inventory[index] = null;
		
		fillSlot(newInner, item.name);
		emptySlot(currentInner);
	}
	else if (selection == "Equip" || selection == "Unequip") {
		
		const equippedData = (selection == "Equip") ? player.prepareEquipment(index) : player.unprepareEquipment(item);
		const newIndex = equippedData[0];
		const oldEquipment = equippedData[1];

		const newSlot = document.querySelector(`[data-index="${newIndex}"]`);
		const newInner = newSlot.querySelector('div');
		const currentInner = slot.querySelector('div');

		inventory[newIndex] = item;
		inventory[index] = oldEquipment;
		
		fillSlot(newInner, item.name);

		if (oldEquipment === null) {
			emptySlot(currentInner);
		}
		else {
			fillSlot(currentInner, oldEquipment.name);
		}
	}
	else if (selection == "Discard") {
		const confirmation = window.confirm(`Are you sure you want to discard ${item.name}`);
		if (confirmation) {
			if (player.equippedWeapon === item) player.equippedWeapon = null;

			emptySlot(slot.querySelector('div'));

			inventory[index] = null;
		}
		else handleItemDefault(item, slot);
	}
}

async function handleItemCombat(item, slot, overlay) {
	const inventory = State.variables.player.inventory;

	const isCombat = item.combatUsable;
	const isPrepared = item.isPrepared;

	const index = parseInt(slot.dataset.index);

	if (item.name == "Gold") {
		await selectionMenu("Gold", `Amount: ${inventory[0].amount}`, ["Exit"]);
		return;
	}

	let selections = [];

	if (isCombat) selections.push("Use");
	selections.push("Exit");

	let selection = await selectionMenu(item.name, item.description, selections);
	
	if (selection != "Use") return;
	if (!isPrepared) {UI.alert(`${item.name} needs to be prepared before combat starts.`); return;}

	State.variables.currentCombat.processPlayerSubmission("item", index);
	emptySlot(slot.querySelector('div'));

	if (!overlay) return;
	const ui = overlay.combatUI;
	if (document.body.contains(overlay)) {
		document.body.removeChild(overlay);
	}
	if (ui) ui.refreshInventoryButton();
}

async function handleItemInteraction(item, slot, overlay) {
	const inventory = State.variables.player.inventory;

	const interactive = overlay.context.interactive;
	const isPrepared = item.isPrepared;
	const isEquipped = item.equipped;

	const index = parseInt(slot.dataset.index);
	

	if (!interactive) {
		UI.alert("No interaction defined");
		return;
	}

	if (item.name == "Gold") {
		await selectionMenu("Gold", `Amount: ${inventory[0].amount}`, ["Exit"]);
		return;
	}

	let selections = [];
	
	if (!isPrepared && !isEquipped) selections.push("Use");
	selections.push("Exit");
	
	let selection = await selectionMenu(item.name, item.description, selections);

	if (selection == "Use") {
		document.body.removeChild(overlay);
		State.variables.gameState = 'default';
		interactive.attemptUse(item, index, overlay.context);
	}
}

Macro.add('openInventory', {
	handler: function() {
		const button = document.createElement('button');
		button.textContent = 'Open Inventory';
		button.className = 'inv-open-button'
		
		button.addEventListener('click', function() {
			createInventoryPopUp();
			UIBar.stow();
		});
		
		this.output.appendChild(button);
	}
});