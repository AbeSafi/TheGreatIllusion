function disableLink(linkElem) {
	linkElem.style.pointerEvents = 'none';
	linkElem.style.cursor = 'default';
	linkElem.style.textDecoration = 'none';
	linkElem.style.color = 'inherit';
}

function createLink(objectText, linkFunction, context = null) {
		const startIndex = objectText.indexOf("@{");
		const endIndex = objectText.indexOf("}", startIndex);
		let startText = ""; let middleText = ""; let endText = "";

		if (startIndex != -1 && endIndex != -1) {
			startText = objectText.slice(0, startIndex);
			middleText = objectText.slice(startIndex + 2, endIndex);
			endText = objectText.slice(endIndex + 1);
		}
		else {
			middleText = objectText;
		}

		const link = document.createElement('a');
		link.href = 'javascript:void(0);';
		link.textContent = middleText;
		link.style.cursor = 'pointer';

		const fullText = document.createElement('span');
		$(fullText).wiki(startText);
    fullText.appendChild(link);
    $(fullText).wiki(endText);

		link.addEventListener('click', (e) => {
			e.preventDefault();
			linkFunction(e, fullText, link);
		});

		if (context !== null) context.link = link;

		return fullText
}

function selectionMenu(title = '?Unknown?', description = '?Unknown?', selections) {
  return new Promise((resolve) => {
		if (selections.length > 5) {resolve(-1); return;}

		const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
		overlay.style.display = 'flex';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';
		overlay.style.zIndex = '20';
    document.body.appendChild(overlay);

    const container = document.createElement('div');
    container.style.backgroundColor = 'white';
    container.style.margin = 'auto';
    container.style.width = '400px';
		container.style.padding = '20px';
		addCoarseTexture(container);
    overlay.appendChild(container);

    const titleSect = document.createElement('div');
    titleSect.style.backgroundColor = '#f1e0c4';
    titleSect.style.padding = '20px';
		titleSect.style.marginBottom = '10px';
		titleSect.style.boxShadow = 'inset 0 0 8px #7c6131';
		titleSect.style.border = '1px solid #a88242';
    container.appendChild(titleSect);

		const titleText = document.createElement('p');
    titleText.textContent = title;
    titleText.style.margin = '0';
    titleText.style.fontWeight = 'bold';
    titleText.style.color = '#3d2610';
    titleSect.appendChild(titleText);

    const descriptionSect = document.createElement('div');
    descriptionSect.style.backgroundColor = '#f1e0c4';
    descriptionSect.style.padding = '20px';
		descriptionSect.style.marginBottom = '10px';
		descriptionSect.style.boxShadow = 'inset 0 0 8px #7c6131';
		descriptionSect.style.border = '1px solid #a88242';	
		descriptionSect.style.height = '100px';
    container.appendChild(descriptionSect);

		const descText = document.createElement('p');
		descText.innerHTML = description.replace(/\n/g, '<br>');
    descText.style.margin = '0';
    descText.style.color = '#3d2610';
    descriptionSect.appendChild(descText);

    const selectionSect = document.createElement('div');
    selectionSect.style.backgroundColor = 'transparent';
		selectionSect.style.display = 'flex';
		selectionSect.style.justifyContent = 'flex-end';
    container.appendChild(selectionSect);

		for (const selection of selections) {
			const selectionButton = document.createElement('button');
			selectionButton.className = 'selection-button';
			selectionButton.textContent = selection;

			selectionButton.addEventListener('click', () => {
				document.body.removeChild(overlay);
				resolve(selection);
			});

			selectionSect.appendChild(selectionButton);
		}
	});
}

const lootSpawnChart = [
	{id: "flacon_defense", weight: 85},
	{id: "sharp_stick", weight: 10},
	{id: "rusty_sword", weight: 5}
]

function debugAction() {
	addItemToInventory("shield_trinket");
	addItemToInventory("shield_trinket_2");
	addItemToInventory("shield_trinket_3");
	addItemToInventory("flacon_defense");
	addItemToInventory("flacon_defense");
	addItemToInventory("flacon_defense");
	addItemToInventory("flacon_defense");

	addItemToInventory("cowards_pendant");
	addItemToInventory("sm_sword");
	addItemToInventory("spiked_shield");
	addItemToInventory("guard_spear");
	addItemToInventory("banshee_whistle");
	addItemToInventory("mother_blanket");
	addItemToInventory("flintlock");
	addItemToInventory("meaty_gavel");
	addItemToInventory("moose_pelt");
	addItemToInventory("sharpest_stick");
	addItemToInventory("sharpest_stick_2");
	addItemToInventory("skin_suit");

	addItemToInventory("Mem_Dg");
	addItemToInventory("Mem_Fr");
	addItemToInventory("Mem_Grd");
	addItemToInventory("Mem_Ppl");
	addItemToInventory("Mem_MD");
	addItemToInventory("Mem_Vctm");
	addItemToInventory("Mem_Jge");
	addItemToInventory("Mem_Mse");
	addItemToInventory("Mem_Chld");
	addItemToInventory("Mem_Bds");
	
	addItemToInventory("blank_orb");
	addItemToInventory("blank_orb");
	addItemToInventory("Green_Crystal");
	addItemToInventory("Green_Crystal2");
	addItemToInventory("prt_key");

	addItemToInventory("Mem_Cwd");
	addItemToInventory("Mem_Sldr");
	addItemToInventory("Mem_Prt");
	addItemToInventory("Mem_Gnrl");
}

Macro.add('toggleOnDebugMode', {
	handler: function() {
		debugMode = true;

		window.State = State;
		window.setup = setup;
		window.NPCs = NPCs;
		window.hostileLocs = hostileLocs;
		window.interactives = interactives;
		window.mapRegions = mapRegions;
		window.debugUid = () => _nextItemUid;
		window.isEndingReady = isEndingReady;

		setup.addItemToInventory = addItemToInventory;
		setup.hostileLocs = hostileLocs;
	}
});

// Cutscene Logic
Macro.add('cutscene', {
	tags: ['cut'],
	handler: function() {
			let index = 0;
			const parts = this.payload.map(p => p.contents);

			const container = document.createElement('div');
			container.className = 'cutscene-container';
			container.style.cursor = 'pointer';

			const hint = document.createElement('span');
			hint.className = 'cutscene-hint';
			hint.textContent = '▾';
			hint.style.color = 'rgb(106, 219, 151)';
			
			const firstSegment = document.createElement('div');
			firstSegment.className = 'cutscene-segment';
			firstSegment.style.opacity = '0';
			firstSegment.style.transition = 'opacity 0.5s ease-in-out';
			new Wikifier(firstSegment, parts[0] + '\\');
			container.appendChild(firstSegment);
			firstSegment.appendChild(hint);

			setTimeout(() => firstSegment.style.opacity = '1', 10);
			
			container.addEventListener('click', function(e) {
				if (e.target.tagName === 'A' || e.target.closest('a')) {
					return;
				}
				
				index++;
				if (index < parts.length) {
					const segment = document.createElement('div');
					segment.className = 'cutscene-segment';
					segment.style.opacity = '0';
					segment.style.transition = 'opacity 0.5s ease-in-out';
					new Wikifier(segment, parts[index] + '\\');
					container.appendChild(segment);
					segment.appendChild(hint);
					
					setTimeout(() => segment.style.opacity = '1', 10);
				}

				if (index == parts.length - 1) {
					container.style.cursor = 'default';
					hint.remove();
				}
			});

			this.output.append(container);
	}
});

Macro.add('namebox', {
	tags: null,
	handler: function() {
		const varName = this.args[0];
		const placeholder = this.args[1] || "";
		const contents = this.payload[0].contents;

		if (!varName || varName[0] !== '$') {
			return this.error('namebox: first argument must be a story variable, e.g. "$playerName"');
		}

		const container = document.createElement('div');
		container.className = 'namebox-container';

		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'namebox-input';
		input.placeholder = placeholder;

		const confirm = document.createElement('button');
		confirm.className = 'namebox-confirm';
		confirm.textContent = 'Confirm';

		const output = document.createElement('div');
		output.className = 'namebox-output';

		function submit() {
			const value = input.value.trim();
			if (value.length < 3 || value.length > 10) {
				UI.alert("Name must be between 3 and 10 letters.");
				return;
			};
			State.variables[varName.slice(1)] = value;

			container.replaceChildren(output);
			new Wikifier(output, contents);
		}

		confirm.addEventListener('click', submit);

		container.append(input, confirm, output);
		this.output.append(container);
	}
});

Macro.add("cAppend", {
    tags: null,
    handler: function () {
        if (this.args.length < 3) {
            return this.error("widget requires at least three arguments: linkId, linkText, and targetId");
        }
        
        var linkId = this.args[0];
        var linkText = this.args[1];
        var targetId = this.args[2];
        var replaceSelector = "#" + linkId;
        var appendSelector = "#" + targetId;
        
        var content = this.payload[0].contents;
        
        var $span = $(document.createElement("span"));
        $span.attr("id", linkId);
        
        var $link = $(document.createElement("a"));
        $link
            .addClass("macro-cAppend")
            .attr("href", "javascript:void(0)")
            .ariaClick(function (e) {
                e.preventDefault();
                
                var $replaceTarget = $(replaceSelector);
                var $appendTarget = $(appendSelector);
                
                if ($replaceTarget.length === 0) {
                    console.error("Replace target element not found: " + replaceSelector);
                    return;
                }
                
                if ($appendTarget.length === 0) {
                    console.error("Append target element not found: " + appendSelector);
                    return;
                }
                
                $replaceTarget.empty().wiki(linkText);
                
                $appendTarget.wiki(content);
            });
        
        $link.wiki(linkText);
        
        $link.appendTo($span);
        $span.appendTo(this.output);
    }
});

Macro.add("cReplace", {
    tags: null,
    handler: function () {
        if (this.args.length < 3) {
            return this.error("widget requires at least three arguments: linkId, linkText, and targetId");
        }
        
        var linkId = this.args[0];
        var linkText = this.args[1];
        var targetId = this.args[2];
        var replaceSelector = "#" + linkId;
        var appendSelector = "#" + targetId;
        
        var content = this.payload[0].contents;
        
        var $span = $(document.createElement("span"));
        $span.attr("id", linkId);
        
        var $link = $(document.createElement("a"));
        $link
            .addClass("macro-cAppend")
            .attr("href", "javascript:void(0)")
            .ariaClick(function (e) {
                e.preventDefault();
                
                var $replaceTarget = $(replaceSelector);
                var $appendTarget = $(appendSelector);
                
                if ($replaceTarget.length === 0) {
                    console.error("Replace target element not found: " + replaceSelector);
                    return;
                }
                
                if ($appendTarget.length === 0) {
                    console.error("Append target element not found: " + appendSelector);
                    return;
                }
                
                $replaceTarget.empty().wiki(linkText);
                
                $appendTarget.empty().wiki(content);
            });
        
        $link.wiki(linkText);
        
        $link.appendTo($span);
        $span.appendTo(this.output);
    }
});

Macro.add("cReplaceR", {
    tags: null,
    handler: function () {
        if (this.args.length < 2) {
            return this.error("widget requires at least two arguments: linkText and targetId");
        }
        
        var linkText = this.args[0];
        var targetId = this.args[1];
        var appendSelector = "#" + targetId;

				var content = this.payload[0].contents;
        
        var $link = $(document.createElement("a"));
        $link
            .addClass("macro-cReplaceR")
            .attr("href", "javascript:void(0)")
            .ariaClick(function (e) {
                e.preventDefault();
                
                var $target = $(appendSelector);
                
                if ($target.length === 0) {
                    console.error("Target element not found: " + appendSelector);
                    return;
                }
                
                $target.empty().wiki(content);
            });
        
        $link.wiki(linkText);
        $link.appendTo(this.output);
    }
});

Macro.add('quickReplace', {
    tags: null,
    handler: function() {
        let content = this.payload[0].contents;
				let output = this.output;
        
				function showNext() {
					const openIndex = content.indexOf('||');
					
					if (openIndex === -1) {
						$(output).wiki(content);
						return;
					}
					
					const closeIndex = content.indexOf('||', openIndex + 2);
					if (closeIndex === -1) {
						$(output).wiki(content);
            return;
					}

					const firstText = content.substring(0, openIndex);
					let linkText = content.substring(openIndex + 2, closeIndex);
					const nextText = content.substring(closeIndex + 2);
					
					const keepLink = linkText[0] == '|';
					if (keepLink) linkText = linkText.slice(1);

					$(output).wiki(firstText);
					
					const linkElement = createLink(linkText, function(e, _fullText, link) {
							e.preventDefault();
							output = link.parentNode.parentNode;
							content = nextText;
							if (!keepLink) $(link.parentNode).remove(); else $(link.parentNode).replaceWith(linkText);
							showNext();
					});
					
					output.appendChild(linkElement);
				}

				showNext();
    }
});

Macro.add('explorationLoot', {
	handler: function() {
		State.variables.steps += 1;
		if (State.variables.steps % 10 != 2) return;
		
		const currentMap = State.variables.currentMap;
		const spawnLoot = Math.floor(Math.random() * 10);
		const player = State.variables.player;
		const inventory = player.inventory;

		if (spawnLoot < 3 && currentMap != "Palm") {
			const maxWeight = lootSpawnChart.reduce((sum, entry) => sum + entry.weight, 0);
			let selector = (Math.random() * maxWeight);
			
			for (const entry of lootSpawnChart) {
				selector -= entry.weight;

				if (selector <= 0) {
					let item = allItems[entry.id];

					const itemLink = createLink(`A wisp of smoke breaks away from the fog, morphing and settling into a(n) @{${item.name}}.`, (_, textElem, linkElem) => {
						const given = addItemToInventory(entry.id, 1);

						if (given === -1) {
							linkElem.textContent = `${player.name} can't fit the item in their inventory.`;
							textElem.innerHTML = "";
							textElem.appendChild(linkElem);
							return;
						}

						disableLink(linkElem);
						textElem.innerHTML = `${player.name} picked up ${inventory[given].name}`;
					});

					this.output.appendChild(itemLink);
					this.output.appendChild(document.createElement('br'));
					return;
				}
			}
			return;
		} 

		const goldAmount = Math.floor(Math.random() * 5) + 1;
		const goldLink = createLink(`A wisp of smoke breaks away from the fog, morphing into @{gold}.`, (_, textElem, linkElem) => {
			updateGold(goldAmount);

			disableLink(linkElem);
			textElem.innerHTML = `${player.name} picked up ${goldAmount} gold!`;
		});

		this.output.appendChild(goldLink);
		this.output.appendChild(document.createElement('br'));
		return;
	}
});

// Fade to black after merchant ending
Macro.add('fadeEnd', {
	handler: function() {
		const linkText = this.args[0] ?? 'orbs';

		const link = createLink(linkText, (_, _text, linkElem) => {
			disableLink(linkElem);

			setTimeout(() => {
				const overlay = document.createElement('div');
				overlay.style.position = 'fixed';
				overlay.style.top = '0';
				overlay.style.left = '0';
				overlay.style.width = '100%';
				overlay.style.height = '100%';
				overlay.style.background = 'black';
				overlay.style.opacity = '0';
				overlay.style.pointerEvents = 'none';
				overlay.style.transition = 'opacity 3s ease';
				overlay.style.zIndex = '9999';
				overlay.style.display = 'flex';
				overlay.style.alignItems = 'center';
				overlay.style.justifyContent = 'center';
				overlay.style.fontSize = '2em';
				overlay.textContent = 'End';

				document.body.appendChild(overlay);
				overlay.offsetHeight;
				overlay.style.opacity = '1';
			}, 1000);
		});

		this.output.appendChild(link);
	}
});

Macro.add('revealLanguage', {
		tags: null,
    handler: function () {
        let words = this.args[0];
        let newWords = this.args[1];
        let content = this.payload[0]?.contents ?? "";
				let out = this.output;
        let clicked = 0;

        for (let i = 0; i < words.length; ++i) {
            let usedWord = newWords[i] ? newWords[i] : words[i];

            $(out).append(createLink(
                (i > 0) ? " @{" + words[i] + "}" : words[i],
                function (_e, _fullText, link) {
										const parent = link.parentNode;

                    link.replaceWith(document.createTextNode(usedWord));
                    if (++clicked >= words.length) {
                        $(parent.parentNode).empty().wiki(content);
                    }
                }
            ));
        }
    }
});

Macro.add('createPlayer', {
    handler: function() {
    	const playerName = this.args[0];
      	const starterWeapon = allItems["rusty_sword"].dup();
				starterWeapon.equipped = true;
        State.variables.player = new PlayerClass(playerName.trim(), starterWeapon);
				State.variables.player.respawnLocation = State.variables.respawnLocation;
				State.variables.player.inventory[6] = starterWeapon;
				State.variables.steps = 0;
				addItemToInventory("gold_display");
				UIBar.stow();
    }
});

Macro.add('setRespawnLoc', {
	handler: function() {
		const location = this.args[0];

		if (location) State.variables.player.respawnLocation = location;
		else State.variables.player.respawnLocation = passage();
	}
});