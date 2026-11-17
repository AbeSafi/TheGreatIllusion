function createResponse(text, onSelect, shouldAppear = () => true) {
    return { text, onSelect, shouldAppear };
}

const dialogueSystem = {
	startDialogue(npcId, entryDialogue = null) {
		const npc = NPCs[npcId];
		
		if (entryDialogue) {
			npc.currDialogue = entryDialogue;
		}
		
		State.variables.gameState = "dialogue";
		npc.flags.tempDialogue = npc.currDialogue;

		return this.getCurrentDialogue();
	},
	
	getCurrentDialogue(dialChoice = null) {
		const npc = NPCs[State.variables.activeNPC];
		const dialogue = dialChoice ? npc.Dialogues[dialChoice] : npc.Dialogues[npc.currDialogue];
		
		const text = typeof dialogue.text === 'function' ? dialogue.text(npc) : dialogue.text;
		let responses = dialogue.responses(npc);

		if (dialogue.shared) {
			let sharedResponses;

			if (dialogue.shared === true) {
				sharedResponses = Object.values(npc.SharedResponses);
			} else if (Array.isArray(dialogue.shared)) {
				sharedResponses = dialogue.shared.map(key => npc.SharedResponses[key]);
			}

			responses = [...responses, ...sharedResponses];
		}

		let finalResponses = responses.filter(resp => resp.shouldAppear(npc));
		finalResponses = finalResponses.map(resp => ({
        ...resp,
        text: typeof resp.text === 'function' ? resp.text(npc) : resp.text
    }));
		
		return {
			npc: npc,
			text: text,
			responses: finalResponses
		};
	},
	
	selectResponse(response) {
		const npc = NPCs[State.variables.activeNPC];
		const previousKey = npc.currDialogue;
		
		const nextDialogue = response.onSelect(npc);
		
		if (nextDialogue || npc.currDialogue !== previousKey) {
			const prevDialObj = npc.Dialogues[npc.flags.tempDialogue] || {}

			npc.flags.tempDialogue = (npc.currDialogue !== previousKey) ? npc.currDialogue : nextDialogue;
			
			if (prevDialObj.forceEnd) {
				this.endDialogue();
				return null;
			}

			return this.getCurrentDialogue(nextDialogue);
		} else {
			this.endDialogue();
			return null;
		}
	},
	
	endDialogue() {
		UIBar.unstow();
		State.variables.activeNPC = "";
		State.variables.gameState = "default";
	}
};

Macro.add('startDialogue', {
	handler: function() {
		const NPC = this.args[0];
		let dialContext = dialogueSystem.startDialogue(NPC);
		
		const container = document.createElement('div');
		container.className = 'dialogue-overlay';
		
		const textContainer = document.createElement('div');
		textContainer.className = 'dialogue-text-container';
		textContainer.style.cursor = 'pointer';
		
		const responseContainer = document.createElement('div');
		responseContainer.className = 'dialogue-response-container';
		responseContainer.style.display = 'none';
		responseContainer.style.borderTop = '1px solid white';
		
		const lines = dialContext.text.split('\n').filter(line => line.trim());
		
		let currentLine = 0;
		
		function showNextLine() {
			if (currentLine < lines.length) {
				const lineElement = document.createElement('div');
				lineElement.className = 'dialogue-line';
				lineElement.style.opacity = '0';
				lineElement.style.transition = 'opacity 0.5s ease-in-out';
				$(lineElement).wiki(lines[currentLine]);
				textContainer.appendChild(lineElement);
				setTimeout(() => lineElement.style.opacity = '1', 10);
				currentLine++;
			} else {
				showResponses();
			}
		}
		
		function showResponses() {
			textContainer.style.cursor = 'default';
			responseContainer.style.display = 'block';
			responseContainer.innerHTML = '';
			responseContainer.appendChild(document.createElement('br'));
			
			dialContext.responses.forEach(response => {
				const respElement = createLink(response.text, () => {
					const nextContext = dialogueSystem.selectResponse(response);
					if (nextContext)
						advanceDialogue(nextContext);
					else {
						container.remove();
						Engine.play(State.variables.dialogueLocation);
					}
				});
				
				respElement.className = 'dialogue-response'
				responseContainer.appendChild(respElement);
				responseContainer.appendChild(document.createElement('br'));
			});
		}
		
		function advanceDialogue(newContext) {
			textContainer.innerHTML = '';
			responseContainer.innerHTML = '';
			responseContainer.style.display = 'none';
			textContainer.style.cursor = 'pointer';
			
			const newLines = newContext.text.split('\n').filter(line => line.trim());
			lines.length = 0;
			lines.push(...newLines);
			currentLine = 0;
			
			dialContext = newContext;
			showNextLine();
		}
		
		textContainer.addEventListener('click', (e) => {
			if (e.target.tagName === 'A' || e.target.closest('a')) return;
			showNextLine();
		});
		
		container.appendChild(textContainer);
		container.appendChild(document.createElement('br'));
		container.appendChild(responseContainer);
		this.output.appendChild(container);
		
		showNextLine();
	}
});