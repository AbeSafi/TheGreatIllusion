const mapConfigs = {
    "Gym": {
        image: './TGI/Drawings/UI/UID_GymMap.png',
				imgSize: {width: 1975, height: 2729},
        containerSize: {width: 90, height: 85},
				gridOffset: { top: 17, left: 15 },
        gridSize: { rows: 4, cols: 3 },
      	slotSize: 450,
				startPos: {x: 1, y: 2},
    },
		"Palm": {
				image: './TGI/Drawings/Maps/PalmIsland.png',
				imgSize: {width: 3821, height: 2731},
        containerSize: {width: 90, height: 85},
				gridOffset: { top: 11, left: 22.2 },
        gridSize: { rows: 9, cols: 9 },
      	slotSize: 256,
				startPos: {x: 2, y: 8}
		},
		"Index": {
				image: './TGI/Drawings/Maps/IndexIsland.png',
				imgSize: {width: 2000, height: 2662},
        containerSize: {width: 90, height: 85},
				gridOffset: { top: 1.2, left: 29.2 },
        gridSize: { rows: 14, cols: 4 },
      	slotSize: 184.5,
				startPos: {x: 0, y: 11}
		},
		"MiddleRing": {
				image: './TGI/Drawings/Maps/MiddleRingIsland.png',
				imgSize: {width: 2000, height: 2660},
        containerSize: {width: 90, height: 85},
				gridOffset: { top: 4.6, left: 14.4 },
        gridSize: { rows: 13, cols: 8 },
      	slotSize: 175,
				startPos: {x: 2, y: 12}
		},
		"Pinky": {
			image: './TGI/Drawings/Maps/PinkyIsland.png',
				imgSize: {width: 2000, height: 2641},
        containerSize: {width: 90, height: 85},
				gridOffset: { top: 6.9, left: 16.5 },
        gridSize: { rows: 14, cols: 8 },
      	slotSize: 168,
				startPos: {x: 5, y: 7}
		},
		"Thumb": {
			image: './TGI/Drawings/Maps/ThumbIsland.png',
				imgSize: {width: 2000, height: 2644},
        containerSize: {width: 90, height: 85},
				gridOffset: { top: 4.2, left: 11.7 },
        gridSize: { rows: 13, cols: 9 },
      	slotSize: 178.5,
				startPos: {x: 0, y: 9}
		}
};

const mapRegions = {
		"Palm": {
			"StartLocation": {
				"slots": [
					"_8_2"
				],
				"neighbors": ["StartConnector"]
			},
			"StartConnector": {
				"slots": [
					"_7_2"
				],
				"neighbors": ["StartLocation", "LowerHill"]
			},
			"LowerHill": {
				"slots": [ 
					"_7_0", "_7_1", "_7_3", 
					"_6_0", "_6_1", "_6_2", "_6_3",
					"_5_0", "_5_1", "_5_2", "_5_3",
					"_4_1", "_4_2", "_4_3"
				],
				"neighbors": ["UpperHill", "UpperFlat", "StartConnector"]
			},
			"UpperHill": {
				"slots": [
						"_3_3", "_3_4", "_3_5"
				],
				"neighbors": ["LowerHill"]
			},
			"UpperFlat": {
				"slots": [
					"_3_0", "_3_1", "_3_2",
					"_2_0", "_2_1", "_2_2", "_2_3", "_2_4", "_2_5", "_2_6", "_2_7", "_2_8",
					"_1_0", "_1_1", "_1_2", "_1_3", "_1_4", "_1_5", "_1_6", "_1_7", "_1_8",
					"_0_1", "_0_1", "_0_3", "_0_4", "_0_5", "_0_6", "_0_7"
				],
				"neighbors": ["LowerHill", "LowerFlat"]
			},
			"LowerFlat": {
				"slots": [
					"_7_4", "_7_5", "_7_6", "_7_7",
					"_6_4", "_6_5", "_6_6", "_6_7",
					"_5_4", "_5_5", "_5_6",
					"_4_6",
					"_3_6", "_3_7"
				],
				"neighbors": ["UpperFlat"]
			}
		},
		"Thumb": {
			"LowerField": {
				"slots": [
					"_12_1", "_12_1", "_12_2", "_12_3", "_12_4",
					"_11_0", "_11_1", "_11_2", "_11_3", "_11_4", "_11_5", "_11_6",
					"_10_3", "_10_4", "_10_5", "_10_6", 
					"_9_3", "_9_4", "_9_5",
				],
				"neighbors": ["Ramp"]
			},
			"Ramp": {
				"slots": [
					"_10_0", "_10_1", "_10_2"
				],
				"neighbors": ["UpperField", "LowerField"]
			},
			"UpperField": {
				"slots": [
					"_9_0", "_9_1", "_9_2", "_9_7",
					"_8_0", "_8_1", "_8_2", "_8_3", "_8_4", "_8_5", "_8_6", "_8_7",
					"_7_0", "_7_1", "_7_2", "_7_3", "_7_4", "_7_5", "_7_6", "_7_7",
					"_6_2", "_6_3", "_6_4", "_6_5", "_6_6", "_6_7",
					"_5_5", "_5_6", "_5_7",
					"_4_6",
				],
				"neighbors": ["Ramp", "VillageConnector"]
			},
			"VillageConnector": {
				"slots": [
					"_4_7"
				],
				"neighbors": ["UpperField"]
			},
			"Village": {
				"slots": [
					"_3_7",
					"_2_7", "_2_8"
				],
				"neighbors": ["IslandsConnector"]
			},
			"IslandsConnector": {
				"slots": [
					"_1_8"
				],
				"neighbors": ["Village", "VillageIsland1"]
			},
			"VillageIsland1": {
				"slots": [
					"_0_8"
				],
				"neighbors": ["IslandsConnector", "VillageIsland2"]
			},
			"VillageIsland2": {
				"slots": [
					"_0_7"
				],
				"neighbors": ["VillageIsland1", "VillageIsland3"]
			},
			"VillageIsland3": {
				"slots": [
					"_1_7"
				],
				"neighbors": ["VillageIsland2"]
			}
		},
		"Index": {
			"South": {
				"slots": [
					"_13_3",
					"_12_0", "_12_1", "_12_3",
					"_11_0", "_11_1", "_11_2", "_11_3",
					"_10_0", "_10_1", "_10_2", "_10_3",
					"_9_0", "_9_1"
				],
				"neighbors": ["LowerPath"]
			},
			"UpperPath": {
				"slots": [
					"_8_2", "_8_3"
				],
				"neighbors": ["LowerPath", "North"]
			},
			"LowerPath": {
				"slots": [
					"_9_2", "_9_3"
				],
				"neighbors": ["UpperPath", "South"]
			},
			"North": {
				"slots": [
					"_8_1",
					"_7_0", "_7_1", "_7_2", "_7_3",
					"_6_0", "_6_1", "_6_2",
					"_5_0", "_5_1",
					"_4_0", "_4_1", "_4_2", "_4_3",
					"_3_0", "_3_1", "_3_2", "_3_3",
					"_2_0", "_2_1", "_2_2", "_2_3",
					"_1_1", "_1_2", "_1_3",
					"_0_3"
				],
				"neighbors": ["UpperPath"]
			}
		},
		"MiddleRing": {
			"Left": {
				"slots": [
					"_12_0", "_12_1", "_12_2",
					"_11_1", "_11_2", 
					"_10_0", "_10_1", "_10_2", 
					"_9_0", "_9_1", "_9_2", "_9_3", 
					"_8_0", "_8_1", "_8_2", "_8_3", 
					"_7_0", "_7_1", "_7_2", "_7_3", 
					"_6_0", "_6_1", "_6_2", "_6_3", 
					"_5_0", "_5_1", "_5_2", "_5_3", 
					"_4_0", "_4_1", "_4_2", "_4_3",
					"_3_1", "_3_2", "_3_3"
				],
				"neighbors": ["Top"]
			},
			"Top": {
				"slots": [
					"_2_0", "_2_1", "_2_2", "_2_3", "_2_4", "_2_5", "_2_6", "_2_7", 
					"_1_0", "_1_1", "_1_2", "_1_3", "_1_4", "_1_5", "_1_6", "_1_7", 
					"_0_0", "_0_1", "_0_2", "_0_3", "_0_4", "_0_5", "_0_6"
				],
				"neighbors": ["Left", "Right"]
			},
			"Right": {
				"slots": [
					"_12_5", "_12_6",
					"_11_5", "_11_6", 
					"_10_5", "_10_6", "_10_7", 
					"_9_4", "_9_5", "_9_6", "_9_7", 
					"_8_4", "_8_5", "_8_6", "_8_7",
					"_7_4", "_7_5", "_7_6", "_7_7",
					"_6_4", "_6_5", "_6_6", "_6_7",  
					"_5_4", "_5_5", "_5_6", "_5_7",
					"_4_4", "_4_5", "_4_6", "_4_7",
					"_3_4", "_3_5", "_3_6", "_3_7"
				],
				"neighbors": ["Top"]
			}
		},
		"Pinky": null
}

function showMap() {
	const overlay = document.createElement('div');
	overlay.className = 'map-overlay';

	const currMap = State.variables.currentMap;
	const currPos = State.variables.playerPos;
	const mapConfig = mapConfigs[currMap];

	const mapContainer = document.createElement('div');
	mapContainer.className = 'map-container';

	const mapImage = document.createElement('div');
	mapImage.className = 'map-image';
	mapImage.style.backgroundImage = `url(${mapConfig.image})`;
	
	const imgAspect = mapConfig.imgSize.width / mapConfig.imgSize.height;
	const divW = window.innerWidth * (mapConfig.containerSize.width / 100);
	const divH = window.innerHeight * (mapConfig.containerSize.height / 100);
	const divAspect = divW / divH;
	let renderedW, renderedH;
	if (imgAspect > divAspect) {
		renderedW = divW;
		renderedH = divW / imgAspect;
	} else {
		renderedH = divH;
		renderedW = divH * imgAspect;
	}
	mapImage.style.width = renderedW + 'px';
	mapImage.style.height = renderedH + 'px';
	mapImage.style.backgroundSize = '100% 100%';
	mapImage.style.position = 'relative';

	addCoarseTexture(mapImage);

	const mapGrid = document.createElement('div');
	mapGrid.className = 'map-grid';
	mapGrid.style.position = 'absolute';
	mapGrid.style.top = mapConfig.gridOffset.top + '%';
	mapGrid.style.left = mapConfig.gridOffset.left + '%';
	
	const gridWidth = (mapConfig.gridSize.cols * mapConfig.slotSize)
										/ mapConfig.imgSize.width * 100;
	const gridHeight = (mapConfig.gridSize.rows * mapConfig.slotSize)
										 / mapConfig.imgSize.height * 100;	
										 
	mapGrid.style.width = gridWidth + '%';
	mapGrid.style.height = gridHeight + '%';

	mapGrid.style.display = 'grid';
	mapGrid.style.gridTemplateColumns = `repeat(${mapConfig.gridSize.cols}, 1fr)`;
  mapGrid.style.gridTemplateRows = `repeat(${mapConfig.gridSize.rows}, 1fr)`;
	mapGrid.style.justifyItems = 'center';
	mapGrid.style.alignItems = 'center';

	for (let r = 0; r < mapConfig.gridSize.rows; r++) {
		for (let c = 0; c < mapConfig.gridSize.cols; c++) {
				const slot = document.createElement('div');
				slot.className = 'map-slot';
				slot.dataset.row = r;
				slot.dataset.col = c;

				slot.style.display = 'flex';
        slot.style.justifyContent = 'center';
        slot.style.alignItems = 'center'
				slot.style.backgroundColor = 'transparent';
				slot.style.zIndex = '10';

				if (currPos.y == r && currPos.x == c) {
					const innerSlot = document.createElement('div');
					innerSlot.style.width = '66%';
					innerSlot.style.height = '66%';
					innerSlot.style.backgroundColor = '#f003';;
					innerSlot.style.borderRadius = '100%';
					innerSlot.style.zIndex = '10';

					slot.appendChild(innerSlot);
				}
				mapGrid.appendChild(slot);
		}
	}

	const closeMap = () => {
		if (!document.body.contains(overlay)) return;
		document.body.removeChild(overlay);
		if (State.variables.gameState == 'interaction') {
			State.variables.gameState = 'default';
		}
	};

	const closeButton = document.createElement('button');
	closeButton.className = 'map-close';
	closeButton.textContent = 'Close';

	closeButton.addEventListener('click', closeMap);

	UIBar.stow();

	overlay.addEventListener('click', (e) => {
		if (!mapImage.contains(e.target)) closeMap();
	});

	mapImage.appendChild(mapGrid);
	mapContainer.appendChild(mapImage);
	mapContainer.appendChild(closeButton);
	overlay.appendChild(mapContainer);
	document.body.appendChild(overlay);
}

Macro.add('openMap', {
	handler: function() {
		showMap();
	}
});

Macro.add('navGrid', {
	handler: function() {
		const pos = State.variables.playerPos;
		const map = State.variables.currentMap;
		const currLoc = passage();
		const hostile = hostileLocs[currLoc];

		const gridContainer = document.createElement('div');

		const grid = document.createElement('div');
		grid.className = 'nav-grid';

		if (hostile) {
			const fightButton = document.createElement('button');
      fightButton.className = 'fight-button';
			fightButton.textContent = 'Fight';

			fightButton.addEventListener('click', () => {
				State.variables.currentEnemy = hostileLocs[currLoc];
				State.variables.combatLocation = passage();
				if (currLoc !== "Opening3") NPCs.Soldier.flags.creatureFound = true;
				Engine.play("CombatScreen");
			});
			
			grid.appendChild(fightButton);
		}
		else {
			const directions = [
				[-1, -1], [0,-1], [1,-1],
				[-1,0], [0,0], [1,0],
				[-1,1], [0,1], [1,1]
			];

			const cardinals = [
				"◤", "▲", "◥",
				"◀", "Map", "▶",
				"◣", "▼", "◢"
			];
			
			let cIndex = 0;
			directions.forEach(([dirX, dirY]) => {
				const button = document.createElement('button');
				button.className = 'nav-button';
				button.textContent = cardinals[cIndex++];

				if (dirX == 0 && dirY == 0) {  
					button.addEventListener('click', () => {
						showMap();
					});
				}
				else {
					const nextX = pos.x + dirX;
					const nextY = pos.y + dirY;
					
					const nextPos = "_" + nextY + "_" + nextX;
					const currPos = "_" + pos.y + "_" + pos.x;
					
					const slotExists = Story.has(map + nextPos);
					const canMove = checkValidMove(currPos, nextPos);

					button.disabled = !canMove || !slotExists;

					if (slotExists && canMove) {
						button.addEventListener('click', () => {
							State.variables.playerPos = { x: nextX, y: nextY };
							if (debugMode) console.log(map + "_" + nextY + "_" + nextX);
							Engine.play(map + "_" + nextY + "_" + nextX);
						});
					}
				}
				grid.appendChild(button);
			});
			$(gridContainer).wiki("Explore: \n\n");
		}

		gridContainer.appendChild(grid);

		this.output.appendChild(gridContainer);
	}
});

Macro.add('traverseMaps', {
	tags: null,
	handler: function() {
		const bodyText = this.payload[0].contents;
		const playerPos = State.variables.playerPos;

		const dockMap = {
			"Palm_1_0": "Pinky_7_5",
			"Palm_0_3": "MiddleRing_12_2",
			"Palm_0_6": "Index_11_0",
			"Palm_7_7": "Thumb_9_0",
			"Pinky_7_5": "Palm_1_0",
			"MiddleRing_12_2": "Palm_0_3",
			"Index_11_0": "Palm_0_6",
			"Thumb_9_0": "Palm_7_7"
		}

		const currLocation = getLocation(State.variables.currentMap, playerPos);

		// Get next position
		const nextPos = dockMap[currLocation];
		const target = getMapAndPosition(nextPos);
		const xTarget = target.position.x;
		const yTarget = target.position.y;
		const mapTarget = target.map;
		
		// Check if target position exists
		const posExists = Story.has(nextPos);
		
		if (!posExists) return;

		const container = document.createElement('div');
		container.className = 'traversal-container';

		const stayLink = createLink("Continue walking\n", () => {
			State.variables.currentMap = mapTarget;
			State.variables.playerPos = { x: xTarget, y: yTarget };
			State.variables.player.respawnLocation = nextPos;

			Engine.play("TraverseEnd");
		});

		const exitLink = createLink("Turn Around\n", () => {
			Engine.play(dockMap[nextPos]);
		});

		$(container).wiki(bodyText);
		$(container).wiki("\n\n");
		container.appendChild(stayLink);
		$(container).wiki("\n");
		container.appendChild(exitLink);
		this.output.appendChild(container);
	}
});

Macro.add('dualPassage', {
	tags: ['secondary'],
	handler: function() {
		const passageName = passage();
		const hasHostile = !!hostileLocs[passageName];
		const shownContent = (hasHostile) ? this.payload[0].contents : this.payload[1].contents;
		new Wikifier(this.output, shownContent);
	}
});

function getLocation(currentMap, coordinates) {
	let locationString = currentMap;
	locationString += "_" + coordinates.y + "_" + coordinates.x;

	return locationString;
}

function getMapAndPosition(respawnLocation) {
	if (!respawnLocation) return null;

	const parts = respawnLocation.split("_");
	if (parts.length !== 3) return null;

	const [mapName, yString, xString] = parts;
	if (!mapConfigs[mapName]) return null;

	const y = parseInt(yString);
	const x = parseInt(xString);
	if (isNaN(x) || isNaN(y)) return null;

	return { map: mapName, position: { x, y } }; 
}

function checkValidMove(currSlot, nextSlot) {
	const map = mapRegions[State.variables.currentMap];
	if (!map) return true;

	const mapObj = Object.entries(map);
	const subRegion = mapObj.find(([_, region]) =>
		region.slots.includes(currSlot)
	);

	if (!subRegion) {
		console.warn(`${currSlot} does NOT exist on any sub-region`)
		return false
	}

	const isFamily = subRegion[1].slots.includes(nextSlot);
	if (isFamily) return true;

	const neighbors = subRegion[1].neighbors;

	const isNeighbor = neighbors.some(neighbor =>
		map[neighbor].slots.includes(nextSlot)
	);

	return isNeighbor;
}