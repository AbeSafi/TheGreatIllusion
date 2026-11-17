// QUEST LOG //

function createQuestLogAPI() {
	const questLogUnfinished = [];
	const questLogFinished = [];

	function getQuestLog() {
		return [...questLogFinished, ...questLogUnfinished].reverse();
	}

	function addToQuestLog(id, text) {
		if (logExists(id).anywhere) return;

		const newQuest = {id: id, text: text, new: true};
		questLogUnfinished.push(newQuest);
	}

	function removeFromQuestLog(id) {
		const unfinishedIndex = logExists(id).unfinished;
		if (unfinishedIndex === -1) return;
		
		const logObject = questLogUnfinished[unfinishedIndex];
		questLogUnfinished.splice(unfinishedIndex, 1);
		
		logObject.text = "<s>" + logObject.text + "</s>";

		questLogFinished.push(logObject);
	} 

	function logExists(id) {
		const existsInUnfinished = questLogUnfinished.findIndex(q => q.id == id);
		const existsInFinished = questLogFinished.findIndex(q => q.id == id);

		return { 
			anywhere: existsInFinished !== -1 || existsInUnfinished !== -1,
			unfinished: existsInUnfinished,
			finished: existsInFinished
		};
	}

	function replaceQuestLog(finished, unfinished) {
		questLogFinished.length = 0;
		questLogFinished.push(...finished);

		questLogUnfinished.length = 0;
		questLogUnfinished.push(...unfinished);
	}

	return {
		logFinished: questLogFinished,
		logUnfinished: questLogUnfinished,
		logExists,
		addToQuestLog,
		removeFromQuestLog,
		getQuestLog,
		replaceQuestLog
	}
}

const questLogAPI = createQuestLogAPI();

function createQuestLogUI() {
	$("#navigation").each(function () {
		$(this).find(".log-wrapper").remove();
		
		const logWrapper = document.createElement('div');
		logWrapper.className = 'log-wrapper';
		
		const questLogUI = document.createElement('div');
		questLogUI.className = 'quest-log'
		questLogUI.style.width = '300px';
		questLogUI.style.height = '400px';
		questLogUI.style.overflowX = 'hidden';
		questLogUI.style.overflowY = 'auto';
		questLogUI.style.display = 'flex';
		questLogUI.style.flexDirection = 'column';
		questLogUI.style.padding = '0px 8px 0px 8px'
		questLogUI.style.gap = '8px';

		const questLog = questLogAPI.getQuestLog();
		
		for (const quest of questLog) {
			const span = document.createElement('span');
			if (quest.new) {
				span.classList.add('new-quest');
				span.classList.add('pulse-colorless');
				quest.new = false;
			}
			
			$(span).wiki(quest.text);
			questLogUI.appendChild(document.createElement('br'));
			questLogUI.appendChild(span);
		}
		
		$(logWrapper).wiki("\n\n");
		$(logWrapper).wiki("Information Log: \n");
		logWrapper.appendChild(questLogUI);
		this.appendChild(logWrapper);
	});
}

Macro.add('addToQuestLog', {
	handler: function() {
		const id = this.args[0];
		const text = this.args[1];
		const refresh = this.args[2] || false;

		if (!id & !text) return;

		questLogAPI.addToQuestLog(id, text);
		if (refresh) createQuestLogUI();
	}
});

Macro.add('removeFromQuestLog', {
	handler: function() {
		const id = this.args[0];

		if (!id) return;

		questLogAPI.removeFromQuestLog(id);
	}
});