const NPCs = {
	General: {
		key: "General",
		name: "Viselli",
		currDialogue: "first_meeting",
		flags: {
			orbCollected: false,
			passageState: 1,
			passageHints: [
				"A faint sound of papers shuffling can be heard nearby.",
				"There is a faint sound of pen scratching coming from nearby."
			],
			haveMet: false,
			whoAsked: false,
			whereAsked: false,
			whereFinished: false,
			currHealth: 30,
			hostileForm: "viselli_dial",
			hostileText: [
				`//The lady's sword is drawn, an accolade on her uniform glows.//`,
				`//The lady's sword is drawn, she guards the entrance of the castle.//`,
				`//The lady's sword is drawn, a bandage is wrapped around her left hand.//\n\
				 "Another round then?"`,
				`//The lady's sword is planted into the ground, she looks tired.//\n\
				 "How pathetic you are."`,
				`//The lady is kneeling on one knee. She gets up.//\n\
				 "Let it be known you have been given your victory."`,
				`//The lady's stance wobbles as she guards the castle.//\n\
				 //She's too tired to speak.//`
			],
			hostileIndex: 0,
			questReady: false,
			infoShared: 0,
			infoData: {
				watch_tower: {
					value: 0,
					text: `Speak about the memory at the watch tower.`,
					minInfo: 0
				},
				house_child: {
					value: 0,
					text: `Speak about the memory of the child in the ruined house.`,
					minInfo: 0
				},
				house_dog: {
					value: 0,
					text: `Speak about the memory of the dog in the ruined house.`,
					minInfo: 0
				},
				colosseum: {
					value: 0,
					text: `Speak about the memory at the colosseum.`,
					minInfo: 3
				},
				court_room: {
					value: 0,
					text: `Speak about the memory at the court room.`,
					minInfo: 3
				},
				gallow_site: {
					value: 0,
					text: `Speak about the memory at the gallow site.`,
					minInfo: 3
				},
				giant_hole: {
					value: 0,
					text: `Speak about the orb found in the giant hole.`,
					minInfo: 6
				},
				light_tower: {
					value: 0,
					text: `Speak about the images at the light tower.`,
					minInfo: 6
				},
				lone_gate: {
					value: 0,
					text: `Speak about the memory at the lone gate.`,
					minInfo: 6
				}
			},
			questGiven: false,
			bonusPoint: false,
			isHostile: false,
			safeFight: false,
			hasFought: false,
			foughtLocation: "",
			nameKnown: false,
			gaveCrystal: false,
			lastMemory: false,
			idiocyLine: false
		},
		Dialogues: {
			first_meeting: {
				text: (npc) => {
					return `//${npc.getName(npc)} shuffles through some papers, her eyes flick to the rising hill, the distant structures, then back to the page.//\n\
						//Her clothing seems rather fancy. A well-fit purple-tinted uniform, decorated with medals and other grandiose insignia.//\n\
						//A few seconds pass. She turns her attention to ${State.variables.player.name}//\n\
						"Well? Would you like to speak... or have you come just to stare?"`;
				},
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			where_answer: {
				text: `//She gestures towards the paper in your possession//\n\
					"A rather useless question. You have a map, do you not."\n\
					//She ruffles through her papers some more.//`,
				responses: (npc) => {
					return [
						createResponse(
							`"That's not what I mean."`,
							(npc) => {
								npc.flags.whereAsked = true;
								npc.flags.whereFinished = true;
								return "poke_prod";	
							}
						)
					];
				},
				shared: true
			},
			poke_prod: {
				text: (npc) => {
					return`//${npc.getName(npc)} puts down her papers and sighs.//\n\
					"If you are looking for a name, that I can not give you."\n\
					"These are unmarked lands, you are not the only one stranded here."`;
				},
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			who_answer: {
				text: `"That is not relevant to you."`,
				responses: (npc) => {
					return [
						createResponse(
							`"You won't even tell me your name?"`,
							(npc) => {
								npc.flags.whoAsked = true;
								return "who_denied";
							}
						)
					];
				},
				shared: true
			},
			who_denied: {
				text: `"No."`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			what_answer: {
				text: (npc) => {
					return `//${npc.getName(npc)} continues to shuffle through her papers.//\n\
					"I understand you may have the time to loiter about, however, I do not."\n
					"Dally around elsewhere, I will not waste time to quell your inquisitiveness."`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`Leave`,
							(npc) => {
								npc.flags.haveMet = true;
								return null;
							}
						)
					];
				},
				shared: ["fight"]
			},
			second_meeting: {
				text: (npc) => {
					let infoShared = npc.flags.infoShared;
					if (npc.flags.infoShared >= 6) {
						questLogAPI.addToQuestLog("viselli_west", "The lady said she was going to the west-most island.");
						questLogAPI.removeFromQuestLog("camilos_advice");
						return `"I will be leaving soon."\n"Should you seek me, you may find me traveling along the west-most island."`;
					}
					
					if (infoShared < 3) return `//${npc.getName(npc)} scribbles on a piece of parchment.\
																		  She doesn't take the time to look up.//\n\
																		  "If you have come just to share greetings, be on your way."`;
					return `"Have you found something?"`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"I've found something."`,
							(npc) => "share_knowledge",
							(npc) => npc.flags.infoShared < 6 && npc.hasNewTopics(npc)
						)
					];
				},
				shared: ["dots", "fight"]
			},
			share_knowledge: {
				text: (npc) => {
					let infoShared = npc.flags.infoShared;
					if (infoShared < 4) 
						return `//${npc.getName(npc)} crosses her arms, doubtful, yet interested.//\n\
										"Very well, what is it?"`;
					if (infoShared < 9)
						return `"Let us dicuss then."`;
					if (infoShared < 11)
						return `//The lady takes a seat and gestures towards a second chair//\n\
										"Of course, what have you learned?"`;
					return `//The lady hesitates a moment before meeting $player.name's eyes//\n\
								  "Speak your mind, I am listening."`;
				},
				responses: (npc, ignore="", hideAll=false) => {
					let responseList = [];
					let infoData = npc.flags.infoData;
					let infoShared = npc.flags.infoShared;

					for (const key in infoData) {
						if (key === ignore || infoData[key].value != 1) continue;
						if (infoShared < infoData[key].minInfo) continue;
						if (infoData[key].minInfo == 3 && !questLogAPI.logExists("eteocle_done")) continue;
						if (infoShared >= 6 && npc.flags.passageState == 2) continue;

						responseList.push(createResponse(
							infoData[key].text,
							(npc) => {
								npc.flags.infoData[key].value = 2;
								npc.flags.infoShared++;
								return key;
							},
							(npc) => !hideAll
						));
					}

					responseList.push(createResponse(
						`Change topic`,
						(npc) => npc.currDialogue
					));

					return responseList;
				}
			},
			pinky_island: {
				text: (npc) => {
					switch(npc.flags.infoShared) {
						case 1:
							return `"What use is this story to us?"\n\
											"Only bring me information of value.\n\
											//She quickly turns her attention away from the conversation//`;
						case 2:
							return `"Must you continue to bring these stories up?"\n\
										  "Be on your way."`;
						case 3:
							return `//${npc.getName(npc)} buries her face in her palms//\n\
											"Listen, I commend the effort."\n\
											"...I urge you to stick to the task at hand."\n\
											//She waves you off//`;
						default:
							return `//The lady interrupts ${State.variables.player.name}'s report with a sigh//\n\
											"Very well, I give."\n\
											"I presume you have already a clue I am involved, since you continue to pester about these events."\n\
											"Yes, I understand the battle had grown beyond control."\n\
											"However, what else were we to do?"\n\
											"We had attempted negotiations at first, yet they imprisoned near all our negotiators."\n\
											"We had attempted a show of force to take our men back, yet they ran out of their walls ready to kill."\n\
											"Any people, should they show us such unwarranted violence... no matter who they are-"\n\
											//She pauses//\n\
											"Well, I prefer not to make a story out of the events that took place."\n\
											//She pauses again, scratching ink at her parchment//\n\
											"On you go then, we have yet to find a way out."`;
					}
				},
				responses: (npc, caller) => {
					return npc.Dialogues.share_knowledge.responses(npc, caller);
				}
			},
			watch_tower: {
				text: (npc) => {
					return npc.Dialogues.pinky_island.text(npc);
				},
				responses: (npc) => {
					return npc.Dialogues.pinky_island.responses(npc, "watch_tower");
				}
			},
			house_child: {
				text: (npc) => {
					return npc.Dialogues.pinky_island.text(npc);
				},
				responses: (npc) => {
					return npc.Dialogues.pinky_island.responses(npc, "house_child");
				}
			},
			house_dog: {
				text: (npc) => {
					return npc.Dialogues.pinky_island.text(npc);
				},
				responses: (npc) => {
					return npc.Dialogues.pinky_island.responses(npc, "house_dog");
				}
			},
			colosseum: {
				text: (npc) => {
					return npc.Dialogues.pinky_island.text(npc);
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Do you have any plan?"`,
							(npc) => "investigate_hint",
							(npc) => npc.flags.infoShared > 5
						),
						...npc.Dialogues.pinky_island.responses(npc, "colosseum")
					];
				}
			},
			court_room: {
				text: (npc) => {
					let infoShared = npc.flags.infoShared;
					switch (infoShared) {
						case 4:
							return `//While $player.name explains what they've seen, there are a few moments where the lady winces in a slight frustration.//\n\
											"Yes."\n\
											"Well found."`;
						default:
							return `//As $player.name explains what they've seen, the lady's frustration builds to a boiling point.//\n\
										  "I can't say what I hope to be more true."\n\
											"That this is truly what you've found."\n\
											"Or that you are playing me for a fool."\n\
											"To think that the order of Camilos's execution was approved for the reason you bring me."\n\
											"..."\n\
											"Well that is an impossible thought indeed."`;
					}
				},
				responses: (npc) => {
					let infoShared = npc.flags.infoShared;

					let responseList = [createResponse(
						"Point out the general's proposal.",
						(npc) => "general_proposal",
						(npc) => infoShared > 5
					)];

					responseList.push(
						...(npc.Dialogues.share_knowledge.responses(npc, "court_room", infoShared > 5))
					);

					return responseList;
				}
			},
			general_proposal: {
				text: (npc) => {
					return `"I have sent not such a thing!"\n\
									//She examines ${State.variables.player.name}//\n\
									"Don't look at me with such a face."\n\
									"We do not have time to waste on this claim of yours."\n\
									"I have more pressing things to investigate."`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Investigate what?"`,
							(npc) => "investigate_hint"
						),
						createResponse(
							`"...You're the general?"`,
							(npc) => "general_flustered",
							(npc) => !npc.flags.nameKnown
						)
					];
				}
			},
			general_flustered: {
				text: (npc) => {
					npc.flags.nameKnown = true;
					return `"Exc- you h-?"\n\
									//${npc.getName(npc)} stumbles over her words attemping to figure out how to respond.//\n\
									"Stick to whats important please."
									//A twinge of embarassement marks her face//`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"What are you investigating?"`,
							(npc) => "investigate_hint"
						)
					];
				}
			},
			gallow_site: {
				text: (npc) => {
					let infoShared = npc.flags.infoShared;
					switch(infoShared) {
						case 4:
							return `"I have a passing memory of that execution."\n\
											"I'm not sure what it has to do with Camilos."\n\
											"Nor what Beerbark had been doing there as well."`;
						case 5:
							return `"Now why would Beerbark speak to the judge about Camilos?"`;
						default:
							return `//The lady falls into a deep thought//\n\
										  "Did Beerbark really...?"\n\
											"I'll have to investigate this further."`;
					}
				},
				responses: (npc) => {
					let responseList = [
						createResponse(
							`"Investigate what?"`,
							(npc) => "investigate_hint",
							(npc) => npc.flags.infoShared > 5
						),
						createResponse(
							`"Maybe he's giving away some secret of Camilos?"`,
							(npc) => {npc.flags.barkBool = true; return "snitch_beerbark";},
							(npc) => npc.flags.infoShared == 5
						),
						createResponse(
							`"Maybe he's putting in a good word?"`,
							(npc) => {npc.flags.barkBool = false; return "snitch_beerbark";},
							(npc) => npc.flags.infoShared == 5
						)
					];

					if (npc.flags.infoShared < 5) 
						responseList.push(...npc.Dialogues.share_knowledge.responses(npc));
					
					return responseList;
				}
			},
			snitch_beerbark: {
				text: (npc) => {
					npc.flags.bonusPoint = true;
					npc.flags.infoShared++;
					let startText = "";
					if (npc.flags.barkBool) 
						startText = `//She scoffs at the suggestion//\n`;
					else 
						startText = `"Beerbark was good friends with Camilos, but I find it hard to believe he'd champion someone other than himself."\n\
											   "He's lived a life of self servitude after all, hard to believe he'd change that drastically."\n\
												 "I'd believe it more should you have told me he had betrayed Camilos."\n\
												 //A look of realization suddenly flashes across the lady's face.//\n\
												 "..."\n\
												 //She scoffs at her own words//\n`;
					return startText + `"The two of them were very close."\n\
								 "I can't im~agine Beerbark would betray Camilos."\n\
								 //Her pitch wavers along her sentence//\n\
								 "Besides, what secr~ets would Camilos have? He was fiercely loy~al."\n\
								 //Her pitch wavers twice more//\n\
								 "And what would Beerbark have to gain...?"\n\
								 //The lady's voice trails off into her thoughts. An awkward silence is followed by a resigned sigh.//\n\
								 "For now, there's no need to jump into rash decisions. There may be a greater story at play."\n\
								 "Well found."`
				},
				responses: (npc) => {
					return npc.Dialogues.share_knowledge.responses(npc);
				}
			},
			investigate_hint: {
				text: `"This land seems to regurgitate the past in fragments, with a special focus on the battle with the village."\n\
							 "From there, I suspect that the answer might lie some secret within it all."\n\
							 "I must investigate about the others, they may be withholding some information."\n`,
				responses: (npc) => {
					return npc.Dialogues.share_knowledge.responses(npc);
				}
			},
			third_meeting: {
				text: (npc) => {
					if (!npc.flags.gaveCrystal) {
						npc.updateNPC(npc);
						return `"I had been ${npc.flags.infoShared < 8 ? "awaiting" : "hoping on"} your return, there is a matter we must discuss."`
					}
					
					if (npc.flags.questReady)
						return `//The lady locks her eyes into the distance//\n\
									  //The parchment held by her side is heavily wrinkled//\n\
										"Hello, how have you been?"`;
					
					return `//The lady rolls up her parchment as she notices ${State.variables.player.name} approaching.//\n\
									"Good day. I hope you've been well."`
				},
				responses: (npc) => {
					return [
						createResponse(
							`Continue`,
							(npc) => "give_crystal",
							(npc) => !npc.flags.gaveCrystal
						),
						createResponse(
							`"I've found something."`,
							(npc) => "share_knowledge",
							(npc) => npc.flags.gaveCrystal && npc.hasNewTopics(npc)
						)
					];
				},
				shared: ["dots", "fight"]
			},
			give_crystal: {
				text: (npc) => {
					questLogAPI.removeFromQuestLog("viselli_west");
					questLogAPI.addToQuestLog("viselli_crystal", `Viselli gave ${State.variables.player.name} a hollow green crystal hoping they could find a use for it.`);

					return `//The lady reaches for an inner pocket on her uniform, pulling out part of a green crystal//\n\
									"I believed this artifact to be involved with the solution we are looking for."\n\
									"Yet, despite my efforts, I have not come upon any use for it."\n\
									"I still believe it may be of use, but not to me."\n\
									"I suspect these lands appear differently to each of us."\n\
									"Take it for now. Should you manage to find success with it, we shall reconvene at this location."`;
				},
				responses: (npc) => {
					return [createResponse(
						`Take the crystal`,
						(npc) => {
							if (!addItemToInventory("Green_Crystal")) {
								UI.alert("Your inventory is full. Remove an item from your inventory before proceeding.")
								return null;
							}
							npc.flags.gaveCrystal = true;
							return null
						}
					)];
				}
			},
			giant_hole: {
				text: (npc) => {
					npc.updateNPC(npc);
					return "This orb you've found, allow me to see it.";
				},
				responses: (npc) => {
					return [
						createResponse(
							`Give orb`,
							(npc) => "orb_discussion"
						)
					];
				}
			},
			orb_discussion: {
				text: (npc) => {
					let infoShared = npc.flags.infoShared;
					let startText = `//A fog covers the lady's eyes as she observes the orb.//\n\
											//After a bit of time the fog fades and she looks up with a wide-eyed expression at ${State.variables.player.name}.//\n\
											"This holds a portion of Beerbark's memories."\n\
											"I had thought myself finally above surprise by these lands."\n\
											//She rotates the orb between her hands.//
											"I have acquired a few of these myself, but to think there exist those that store our own memories."\n\
											//The lady thinks for a while.//\n\
											//She ${infoShared <= 7 ? "hands" : "tosses"} $player.name the orb back.//\n`;
					switch(infoShared) {
						case 7:
							return startText;
						default:
							if (npc.flags.questReady) 
								return startText + `"If I may offer some advice-"\n\
											 //The lady interrupts herself//\n\
											 "Perhaps... forget I spoke."\n\
											 "I am in no position to offer advice."\n\
											 "At the very least, I may now fully understand what must be done."\n`;
							return startText + `"If I may offer some advice, burn it."\n\
										 "Do not allow that man to escape these lands."`
					}
				},
				responses: (npc) => {
					let responseList = [createResponse(
							`Leave`,
							(npc) => "give_quest",
							(npc) => npc.flags.questReady
						)];
					
					if (!npc.flags.questReady)
						responseList.push(...npc.Dialogues.share_knowledge.responses(npc));
					
					return responseList;
				}
			},
			light_tower: {
				text: (npc) => {
					npc.updateNPC(npc);
					let infoShared = npc.flags.infoShared;
					switch(infoShared) {
						case 7:
							return `//The lady scratches her temple//\n\
											"Once again Beerbark has made an appearance."\n\
											"There must be a secret there to consider."\n\
											"Otherwise, I'm not sure what to make of it."`;
						default:
							let startText = `"Once again Beerbark has made an appearance."\n\
											"It's becoming quite obvious he plays a big part of the secret we have been chasing."\n`;
							
							npc.flags.idiocyLine = true;
							if (npc.flags.questReady)
								return startText + `//The lady stops to consider her next words//\n\
											 "It's quite... irritating to look back at one's own idiocy."\n\
											 "No, it's more than just that man."\n\
											 "At the very least, I may now fully understand what must be done."`;
							else
								return startText + `"It's quite... irritating to look back at one's own idiocy."\n\
											 "How had I ever trusted that man."`;
					}
				},
				responses: (npc) => {
					let responseList = [createResponse(
							`Leave`,
							(npc) => "give_quest",
							(npc) => npc.flags.questReady
						)];
					
					if (!npc.flags.questReady)
						responseList.push(...npc.Dialogues.share_knowledge.responses(npc));
					
					return responseList;
				}
			},
			lone_gate: {
				text: (npc) => {
					npc.updateNPC(npc);
					let infoShared = npc.flags.infoShared;
					switch(infoShared) {
						case 7:
							return `//The lady raises an eyebrow while listening to ${State.variables.player.name}.//\n\
					 					  "That man has been keeping secrets from everyone."\n\
					 					  "I shan't be surprised should you soon tell me he's keeping secrets from himself"\n\
					 						"I'll have to take a look at this finding myself."`;
						default:
							let startText = `//The lady clicks her tongue in frustration.//\n\
															 "That man has been keeping secrets from everyone."\n\
															 "I shan't be surprised should you soon tell me he's keeping secrets from himself."\n\
															 "Time and time again he has been appeared, playing the world for fools."\n\
															 "And for what?"\n\
															 "He's stuck, just as the rest of us."`;
							
							if (npc.flags.questReady) startText += `\n//She takes a heavy breath and calms herself//\n\
																				"Who am I, to stir myself up to such a level."\n\
																				"..."\n\
																				"At the very least, I may now fully understand what must be done."`
							
							return startText;
					}
				},
				responses: (npc) => {
					let responseList = [createResponse(
							`Leave`,
							(npc) => "give_quest",
							(npc) => npc.flags.questReady
						)];
					
					if (!npc.flags.questReady)
						responseList.push(...npc.Dialogues.share_knowledge.responses(npc));
					
					return responseList;
				}
			},
			give_quest: {
				text: (npc) => {
					questLogAPI.addToQuestLog("viselli_thumb", `Viselli has asked ${State.variables.player.name} to explore the top of the east-most island.`)
					if (npc.flags.bonusPoint)
						return `"Please wait a moment."\n\
										//The lady cracks a smile, her experession wry.//\n\
										"I have found quite the find indeed."\n\
										//Her usual confidence is missing.//\n\
										"Head towards the eastern most island."\n\
										"I have managed to unlock a path beyond the wall there."\n\
										"Whatever you find-"\n\
										"..."\n\
										"Nevermind, make of it what you will."\n\
										"I will remain here for now, good luck on your journey."`;
					
					return `"Wait a moment."\n\
									"I have managed to unlock a path in the eastern most island."
									"Whatever you may find there, understand that it's-"
									"..."
									"I will remain here for now, good luck on your journey."
									"I hope we may remain allies when we next meet."`;
				},
				responses: (npc) => {
					return [createResponse(
						`Leave`,
						(npc) => {
							npc.flags.questGiven = true;
							mapRegions.Thumb.VillageConnector.neighbors.push("Village");
							mapRegions.Thumb.Village.neighbors.push("VillageConnector");
							return null;
						}
					)];
				}
			},
			final_meeting: {
				text: (npc) => {
					const infoShared = npc.flags.infoShared;
					npc.flags.endRoute = getEndingState();
					questLogAPI.removeFromQuestLog("camilos_raid");
					questLogAPI.removeFromQuestLog("viselli_hiding");
					questLogAPI.addToQuestLog("viselli_castle", `${npc.getName(npc)} stands by the entrance of the castle, blocking entry.`);

					return `//The entrance is blocked by a familiar face, carrying their orb.//\n\
									"Why don't we have ${infoShared < 4 ? "a" : "one last"} discussion."\n\
									//It's ${npc.getName(npc).toLowerCase()}.//`;
				},
				responses: (npc) => {
					npc.flags.routeChoice = "";

					return [
						createResponse(
							`"What?"`,
							(npc) => "final_meeting2"
						),
						createResponse(
							`"..."`,
							(npc) => "final_meeting2"
						),
						createResponse(
							`Attack`,
							(npc) => {npc.flags.routeChoice = "attack"; return "final_meeting2"},
							(npc) => npc.flags.endRoute == "Merchant"
						)
					];
				}
			},
			final_meeting2: {
				text: (npc) => {
					let startText = npc.flags.routeChoice == "attack" 
													? "I, for one, argue we do not get hasty in our actions.\n"
													: "I may have an idea of what you seek.\n";
					if (npc.flags.endRoute == "Merchant") 
						return startText + `//She points a dagger against the orb.//\n\
									 //A red hue bleeds through the orb from the position of the dagger//`;
									 
					return startText + "//She points a dagger towards the orb, keeping it only a small distance away.//";
				},
				responses: (npc) => {
					return [
						createResponse(
							"What are you doing?",
							(npc) => {
								npc.flags.routeChoice = "question";
								return "final_meeting_h"
							},
							(npc) => npc.flags.endRoute == "Hunter"
						),
						createResponse(
							`"..."`,
							(npc) => {
								npc.flags.routeChoice = "silence";
								if (npc.flags.endRoute == "Merchant")
									return "final_meeting_m";

								return "final_meeting_h";
							}
						)
					];
				}
			},
			final_meeting_m: {
				text: (npc) => {
					let startText = npc.flags.infoShared > 4 
													? `"I must say it does not set one's own heart at ease to greet a former ally in such a manner."\n`
													: `"I must say it does not set one's own heart at ease to press a blade upon one's own memories."\n`;
					
					return startText + `"However, considering who you have turned out to be, I am afraid there isn't much any other way."\n\
								 //She scratches a bit of the orb, the sound screeches its way through the air.//`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"..."`,
							(npc) => "final_meeting_m2"
						)
					];
				}
			},
			final_meeting_m2: {
				text: (npc) => {
					const infoShared = npc.flags.infoShared;
					let baseText = `"I've continued to ask myself what exactly the 'hunter' hopes to accomplish."\n\
												  //Her words are full of derision.//\n\
													"Power? Wealth? Vengeance?"\n\
													"Surely you haven't simply rushed yourself towards the end?"\n\
													"Is this truly the path you've chosen to walk?"\n\
													"What awaits you after you've won?"\n\
													//${npc.getName(npc)} lowers her arms to her side.//`
					
					if (infoShared > 4) {
						return `//She scoffs//\n\
										"What I cannot understand is how I fooled myself into the belief that you might be \
										${infoShared <= 6 ? `helpful` : `a friend`}."\n` + baseText;
					}

					return baseText;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"..."`,
							(npc) => "final_meeting_m3"
						)
					];
				}
			},
			final_meeting_m3: {
				text: (npc) => {
					return `//The orb hangs by her right, the dagger by her left.//\n\
								 "Are you satisfied?"`
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Yes"`,
							(npc) => {
								npc.flags.routeChoice = "yes";
								return "final_meeting_m4";
							}
						),
						createResponse(
							`"No"`,
							(npc) => {
								npc.flags.routeChoice = "no";
								return "final_meeting_m4";
							}
						),
						createResponse(
							`"..."`,
							(npc) => {
								npc.flags.routeChoice = "yes";
								return "final_meeting_m4";
							}
						),
						createResponse(
							`Attack`,
							(npc) => {
								npc.flags.routeChoice = "attack";
								npc.flags.hostileForm = "viselli";
								return "final_meeting_m4";
							}
						)
					];
				}
			},
			final_meeting_m4: {
				text: (npc) => {
					const routeChoice = npc.flags.routeChoice;
					let startText = `//The lady drops the orb.//\n\
							            //A jolt of crimson flashes upwards within the orb as it hits the ground. Soon settling back to its normal, neutral hue.//\n`;

					switch(routeChoice) {
						case "no":
							startText += `"Any regrets you carry now are past due."\n`;
							break;
						case "attack":
							startText += `"Do not grow to be so confident in yourself."\n`;
							break;
						default:
							startText += `"Let there be no more words then."\n`
					}

					return startText += `//She crushes down a foot onto orb, shattering it as she steps foward to unsheath her blade.//`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`Fight`,
							(npc) => {
								npc.flags.isHostile = true;
								npc.flags.safeFight = false;
								npc.flags.hasFought = false;
								npc.flags.defeated = false;
								npc.flags.routeChoice = "kill";
								return null;
							}
						)
					];
				}
			},
			final_meeting_h: {
				text: (npc) => {
					npc.flags.hostileForm = "viselli_friendly";
					const routeChoice = npc.flags.routeChoice;
					let baseText = `"I suppose you've learned of my choices on that day."\n\
													"Of what I've caused."`;

					switch(routeChoice) {
						case "silence":
							return `//The lady looks a little disappointed//\n` + baseText;
						default:
							return `"I simply offer a moment to converse."\n\
										  //She smiles, inching the dagger closer ever so slightly.//\n\
											"Before all is said and done of course."\n` + baseText;
					}
				},
				responses: (npc) => {
					return [
						createResponse(
							`"You didn't do anything that bad."`,
							(npc) => {
								npc.flags.routeChoice = "disagree";
								return "final_meeting_h2";
							}
						),
						createResponse(
							`"Of course, you're terrible."`,
							(npc) => {
								npc.flags.routeChoice = "agree";
								return "final_meeting_h2";
							}
						),
						createResponse(
							`"..."`,
							(npc) => {
								npc.flags.routeChoice = "silence";
								return "final_meeting_h2";
							}
						)
					];
				}
			},
			final_meeting_h2: {
				text: (npc) => {
					const routeChoice = npc.flags.routeChoice;
					let baseText = `"It matters not, save what you're willing to do for this."\n`;
					
					switch(routeChoice) {
						case "disagree":
							return `//${npc.getName(npc) == "Viselli" ? "Viselli's" : "Her"} face twists in a sudden rage//\n\
							 			 "DO NOT MOCK ME!"\n\
							 			 //She takes a breath to calm herself//\n\
							 			 "Of course my accomplishments were terrible."\n` + baseText;
						case "agree":
							return `//She tenses up a little, relaxing soon after with a sigh//\n\
											"Very well, if that is your judgement."\n` + baseText;
						default:
							return `"Why do you not speak?"\n\
											//She waits a second, staring at $player.name//\n` + baseText;
					}
				},
				responses: (npc, ignore="", lowTrust=true) => {
					const lastMemory = npc.flags.lastMemory;
					const ignoreList = npc.Dialogues.final_meeting_h2.ignoreList;
					if (ignore.length > 0) npc.Dialogues.final_meeting_h2.ignoreList.push(ignore);

					return [
						createResponse(
							(npc) => `"I ${lastMemory ? "know you didn't want" : "don't think you wanted"} to do those things."`,
							(npc) => "final_meeting_h2A",
							(npc) => !ignoreList.includes(`A`)
						),
						createResponse(
							`"Do you want money?"`,
							(npc) => "final_meeting_h2B",
							(npc) => !ignoreList.includes(`B`) && lowTrust
						),
						createResponse(
							`"Are you expecting me to beg you?"`,
							(npc) => "final_meeting_h2C",
							(npc) => !ignoreList.includes(`C`) && lowTrust
						),
						createResponse(
							`"Are you dumb?"`,
							(npc) => "final_meeting_h2D",
							(npc) => !ignoreList.includes(`D`)
						),
						createResponse(
							`"Do it."`,
							(npc) => "final_meeting_h2E",
							(npc) => !ignoreList.includes(`E`)
						),
						createResponse(
							`"..."`,
							(npc) => "final_meeting_h2F",
							(npc) => !ignoreList.includes(`F`)
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				},
				ignoreList: []
			},
			final_meeting_h2A: {
				text: (npc) => {
					return `//The lady churns in disgust//\n\
								 "Yet ''I'' did!"\n\
								 "Regardless of what who~ever wanted, ''I'' led the attack, \
								 ''I'' called to burn the forest, ''I'' took innocent lives, \
								 and ''I'' killed ''my'' brother!"\n\
								 "All for-"\n\
								 //The last of her air escapes, choking out her words.//\n`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"I don't think you want to do this either."`,
							(npc) => "final_meeting_h2A2"
						),
						...npc.Dialogues.final_meeting_h2.responses(npc, "A", false)
					];
				}
			},
			final_meeting_h2A2: {
				text: (npc) => {
					return `"Do not waste my time pleading at some interpreted innocence."\n\
									//The lady just barely touches the dagger to the orb. The color tints a faint pink in response.//`;
				},
				responses: (npc) => {
					const lastMemory = npc.flags.lastMemory;

					return [
						createResponse(
							`"And I plead anyway."`,
							(npc) => {
								npc.flags.routeChoice = "plead";
								return "final_meeting_spared"
							},
							(npc) => lastMemory
						),
						createResponse(
							`"..."`,
							(npc) => "final_meeting_h2F2"
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				}
			},
			final_meeting_h2B: {
				text: (npc) => {
					const routeChoice = npc.flags.routeChoice;
					let baseText = `"Need I simply destroy this then?"`;
					
					if (routeChoice != "begFalse") 
						return `"I care not for the change in your pouch."\n` + baseText;
					
					return baseText;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Well I'm out of ideas."`,
							(npc) => {
								npc.flags.routeChoice = "giveUp";
								return "final_meeting_spared";
							}
						),
						createResponse(
							`"Are you expecting me to beg you?"`,
							(npc) => "final_meeting_h2C",
							(npc) => npc.flags.routeChoice != "begFalse"
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				}
			},
			final_meeting_h2C: {
				text: (npc) => {
					return `//The lady looks surprised by the answer//\n\
									"Would you really grovel?"`
				},
				responses: (npc) => {
					return [
						createResponse(
							`I'm not going to beg.`,
							(npc) => {
								npc.flags.routeChoice = "begFalse"
								return "final_meeting_h2B"
							}
						),
						createResponse(
							`Beg`,
							(npc) => {
								npc.flags.routeChoice = "beg";
								return "final_meeting_spared";
							}
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				}
			},
			final_meeting_h2D: {
				text: (npc) => {
					return `//The lady flinches in shock//\n\
								 "Excuse m-"\n\
								 "What could you possibly hold that allows you to be so brazen?"\n\
								 "Surely you understand what it is that I threaten."`
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Do you?"`,
							(npc) => "final_meeting_h2D2"
						),
						...npc.Dialogues.final_meeting_h2.responses(npc, "D", false)
					];
				}
			},
			final_meeting_h2D2: {
				text: (npc) => {
					return `//The lady looks quite annoyed by the provocation//\n\
								  "Should you truly believe in your words, then strike me down."`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"'One's own idiocy' comepls me not to."`,
							(npc) => {
								npc.flags.routeChoice = "banter";
								return "final_meeting_spared";
							},
							(npc) => npc.flags.idiocyLine
						),
						createResponse(
							`"..."`,
							(npc) => "final_meeting_h2F2"
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				}
			},
			final_meeting_h2E: {
				text: (npc) => {
					return `//The lady pulls back in shock, almost dropping the dagger in the process.//\n\
								  "Do not wager on my hesitation."\n\
									//She recomposes herself//\n\
									"You should be well aware I am not to be taken lightly."`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Do it."`,
							(npc) => "final_meeting_h2E2"
						),
						...npc.Dialogues.final_meeting_h2.responses(npc, "E", false)
					];
				}
			},
			final_meeting_h2E2: {
				text: (npc) => {
					return `"Do you not understand the value of what I hold?"\n\
									//The lady just barely touches the dagger to the orb. The color tints a faint pink in response.//`	
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Do it."`,
							(npc) => {
								npc.flags.routeChoice = "callBluff"
								return "final_meeting_spared"
							}
						),
						createResponse(
							`"I don't need that orb."`,
							(npc) => "final_meeting_h2D2"
						),
						createResponse(
							`"..."`,
							(npc) => "final_meeting_h2F2"
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				}
			},
			final_meeting_h2F: {
				text: (npc) => {
					return `"Well? Speak!"`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"..."`,
							(npc) => "final_meeting_h2F2"
						),
						...npc.Dialogues.final_meeting_h2.responses(npc, "F", false)
					];
				}
			},
			final_meeting_h2F2: {
				text: (npc) => {
					const routeChoice = npc.flags.routeChoice;
					let baseText = `//It's quiet.//\n\
													//$player.name and the lady stand in pause, staring at one another.//`;
					
					if (routeChoice != "plead") 
						return `//The lady just barely touches the dagger to the orb. The color tints a faint pink in response.//\n` + baseText;
					
					return baseText;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"..."`,
							(npc) => {
								npc.flags.routeChoice = "silence"
								return "final_meeting_spared";
							}
						),
						createResponse(
							`Attack`,
							(npc) => "final_meeting_killed"
						)
					];
				}
			},
			final_meeting_killed: {
				text: (npc) => {
					return `//There is no final battle.//\n\
									//${npc.getName(npc)} tracks the blade with her eyes, yet does not react.//\n\
									//She hits the ground right afterwards.//\n\
									//The orb rolls away safely.//\n\
									//A light soon whisks away her corpse into the fog.//`
				},
				responses: (npc) => {
					return [
						createResponse(
							`...`,
							(npc) => {
								npc.flags.passageState++;
								npc.flags.dropOrb = true;
								npc.flags.routeChoice = "kill";
								return null;
							}
						)
					];
				}
			},
			final_meeting_spared: {
				text: (npc) => {
					const routeChoice = npc.flags.routeChoice;
					const baseText = `//The lady breaks into a hearty laughter.//\n\
														"It is frustrating, in fact beyond frustrating..."\n\
														//She laughs a while longer, a few tears falling in the midst.//\n\
														"Why has 'the hunter' put this much faith in me." //She jokingly mocks before tossing the orb to $player.name.//\n\
														//The fog creeps close, she looks at her arms as they dissipate within it.//\n\
														"I am satisfied, at least the best of us will get to escape."\n\
														//Her face rests on a smile as she's whisked away.//`

					switch(routeChoice) {
						case "giveUp":
							return `"..."\n\
											"I did not think you one to give in so easily."\n\
											//The lady poorly stifles a snicker.//\n\
											"Where did that stubbornness during your battles go?"\n` + baseText;
						case "beg":
							return `//The lady attempts to ignore $player.name's pleas, her face shrinking in discomfort.//\n\
											"Enough!"\n\
											//She's rubbing her temples.//\n\
											"Do not act so pathetic. I have seen you slay ferocious beasts \
											with nothing but a broken sword and your bare hands."\n` + baseText;
						case "banter":
							return `//The lady stares in disbelief just before poorly stifling a snicker.//\n\
											"Since when have you been capable of such a statement?"\n` + baseText;
						case "plead":
							return `//The lady tenses her hand around the dagger.//\n\
											//Her face twists with a spread of emotions.//\n\
											//The lady pulls back her arm, then stabs towards the orb.//\n\
											//The dagger falls before making contact, her arms collapse to her sides.//\n\
											"I am not free from judgement just because you refuse to acknowledge it."\n\
											//A silence passes//\n` + baseText;
						case "callBluff":
							return `//The lady pulls back her arm, then stabs towards the orb.//\n\
											//The dagger falls before making contact, her arms collapse to her sides.//\n\
											"..."\n\
											"Have I been so poor in my bluff?"\n` + baseText;
						default:
							return `"..."\n\
											//Her hands fall to her sides.//\n\
											"I see."\n\
											"..."\n\
											//The silence is interrupted by a snort.//\n` + baseText;
					}
				},
				responses: (npc) => {
					return [
						createResponse(
							`...`,
							(npc) => {
								npc.flags.passageState++;
								npc.flags.dropOrb = true;
								npc.flags.routeChoice = "spare";
								return null;
							}
						)
					];
				}
			},
			viselli_disappear: {
				text: (npc) => {
					return `//${State.variables.player.name}'s weapon meets only air as a light blinds them.//\n\
									//It takes a few seconds before their vision returns.//\n\
									//Looking around, ${npc.getName(npc, true)} has disappeared. The only thing that remains is a cracked accolade on the ground.//\n`
				},
				responses: (npc) => {
					return [
						createResponse(
							`...`,
							(npc) => {
								return null;
							}
						)
					];
				}
			}
		},
		SharedResponses: {
			where_question: {
				text: (npc) => {
					if (!npc.flags.whereAsked) return `"Where am I?"`
					return `"The map doesn't help much."`
				},
				onSelect: (npc) => {
					if (!npc.flags.whereAsked) {
						npc.flags.whereAsked = true;
						return "where_answer";
					}

					npc.flags.whereFinished = true;
					return "poke_prod";
				},
				shouldAppear: (npc) => npc.flags.passageState === 1 && !npc.flags.whereFinished
			},
			who_question: {
				text: `"Who are you?"`,
				onSelect: (npc) => {
					npc.flags.whoAsked = true;
					return "who_answer";
				},
				shouldAppear: (npc) => npc.flags.passageState === 1 && !npc.flags.whoAsked
			},
			what_question: {
				text: `"What are you doing?"`,
				onSelect: (npc) => npc.currDialogue = "what_answer",
				shouldAppear: (npc) => npc.flags.passageState === 1 && npc.flags.whereFinished
			},
			dots: {
				text: "Leave",
				onSelect: (npc) => null,
				shouldAppear: (npc) => (npc.flags.passageState == 3 && npc.flags.gaveCrystal) || (npc.flags.passageState != 3)
			},
			fight: {
				text: `Attack`,
				onSelect: (npc) => {
					let choice = true;
					if (choice) choice = window.confirm(`You can't take this choice back! (1/3)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (2/3)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (3/3)`);
					
					if (!choice) return npc.currDialogue;
					npc.flags.isHostile = true;
					npc.flags.hasFought = true;
					npc.flags.safeFight = false;
					npc.flags.defeated = true;
					return "viselli_disappear";
				},
				shouldAppear: (npc) => npc.currDialogue == "what_answer" 
															 || npc.currDialogue == "second_meeting" || npc.currDialogue == "third_meeting"
			}
		},
		updateHostileNPC: (npc) => {
			const maxHealth = 30;
			const currHealth = npc.flags.currHealth;
			const currLine =  (maxHealth - currHealth) / 5;
			const formName = "viselli";

			const trueViselli = new EnemyClass(
				"The Lady",
				currHealth,
				[
					{action: "resetPlayer", tell: "An accolade on the lady's uniform pulses with energy."},
					{action: "attack", damage: 100, tell: "The lady's sword carves across the air, releasing a wave of energy."},
					{action: "attack", damage: 100, tell: "The lady cleaves her sword back across its path."},
					{action: "rest", tell: "The lady sheathes her sword"}
				],
				"General"
			)

			enemies[formName] = trueViselli;

			npc.flags.hostileForm = formName;
			npc.flags.hostileIndex = currLine;
		},
		hasNewTopics: (npc) => {
			for (let info in npc.flags.infoData) {
				if (npc.flags.infoData[info].value === 1) return true;
			}

			return false;
		},
		updateNPC: (npc) => {
			const infoShared = npc.flags.infoShared;

			if (npc.flags.infoShared == 10 || (npc.flags.infoShared == 9 && !npc.flags.bonusPoint)) {
				questLogAPI.removeFromQuestLog("viselli_tower");
				npc.flags.questReady = true;
			}

			if (npc.flags.haveMet && passage() != "Palm_8_2" && npc.flags.passageState === 1) {
				npc.flags.passageState = 2;
				npc.currDialogue = "second_meeting";
			}
			else if (passage() != "MiddleRing_10_1" && npc.flags.passageState === 2 && infoShared >= 6) {
				npc.flags.passageState = 3;
				npc.currDialogue = "third_meeting";
			}
			else if (State.variables.currentMap == "Thumb" && npc.flags.questGiven && npc.flags.passageState < 4) {
				npc.flags.passageState = 4;
				setMemoryStates("Mem_Gnrl", 1);
			}
			else if (isEndingReady() && npc.flags.passageState < 5) {
				npc.flags.passageState = 5;
				npc.currDialogue = "final_meeting";
				npc.flags.safeFight = false;
				npc.flags.isHostile = false;
				npc.flags.hasFought = false;
				npc.flags.foughtLocation = null;
			}

			if (npc.flags.passageState == 5 && passage() == "Palm_3_4" && !npc.flags.dropOrb) {
				writeAutosave("TheGreatIllusion_BeforeViselliDeath");
			}
		},
		endNPC: (npc) => {
			const viselliLogs = questLogAPI.logUnfinished.filter(log => log.id.includes("viselli"));
			for (const log of viselliLogs) questLogAPI.removeFromQuestLog(log.id);
			
			questLogAPI.addToQuestLog(`viselli_${npc.flags.routeChoice != "kill" ? "done" : "dead"}`, `${npc.getName(npc)} is ${npc.flags.routeChoice != "kill" ? "missing" : "dead"}.`);
			questLogAPI.removeFromQuestLog("camilos_raid");
			questLogAPI.removeFromQuestLog("camilos_advice");
		},
		getName: (npc, lower=false) => {
			if (!npc.flags.nameKnown) return (lower) ? "the lady" : "The lady";
			return "Viselli";
		}
	},
	Pirate: {
		key: "Pirate",
		name: "BeerBark",
		currDialogue: "first_line",
		flags: {
			orbCollected: false,
			haveMet: false,
			passageState: 1,
			passageHints: [
				"There is a faint sound of crackling embers coming from nearby."
			],
			confrontState: 0,
			shopStock: {"Pirate's Key": 1, "Solid Metal Sword": 999, "Bronze Shield Necklace": 999, "Silver Shield Necklace": 999, "Gold Shield Necklace": 999},
			shopOpen: false,
			tempDialogue: "",
			isHostile: false,
			hostileForm: "beerbark_dial",
			hostileText: [`"Yer not the wisest are ye?"`,
				`"Yer never makin' way with me spoils."`,
				`"Back ey?"`,
				`//Beerbark looks bored.//\n\
				 "Perhaps it help ye try a more... helpless prey?"`
			],
			hostileIndex: 0,
			foughtLocation: "",
			safeFight: true,
			hasFought: false,
			itemBought: false,
			lightTowerWatched: false,
			gateWatched: false,
			memoryFound: false
		},
		Dialogues: {
			first_line: {
				text: `//The fellow wears a sailor's jacket just a tad-bit oversized.//\n//His clothes look well-worn, but off, they just don't suit him right.//\n\
							 "Hmmmhmhmhmm", //he hums to himself, in his own world.//`,
				responses: (npc) => {
					return [
						createResponse(
							`"Hello."`,
							(npc) => "first_intro"
						)
					];
				},
				shared: ["dots"]
			},
			first_intro: {
				text: `//The man hops in his seat a bit.//\n\
							 "Aye! A customer, hold, I must ready me jingle."\n\
							 //He takes a second to clear his throat, pulling out a sheet of paper.//\n\
							 "Right. Here go we."`,
				responses: (npc) => {
					return [
						createResponse(
							`Listen to the jingle.`,
							(npc) => "jingle"
						)
					];
				}
			},
			jingle: {
				text: `"Ahoy ye lubbers, men of the land!"\n\
							 "We've treasures from the seas in stock at hand!"\n\
							 "Come in 'n browse the fine bits of me wares!"\n\
							 "For ye copper be proper help fer me snares!"\n\
							 ...\n\
							 "Me first love, the thorns of the black-blood sea!"\n\
							 "Me second, on the shore, 'fencing cutlass fer ye!"\n\
							 "Yer coin be the cleaver; I take meat from hairs!"\n\
							 "Of the beasts who prowl these lands as they dare!... ...s"\n\
							 //The man cocks his head to the right a little with the last bit.//`,
				responses: (npc) => {
					return [
						createResponse(
							`Say the jingle was good.`,
							(npc) => {
								npc.currDialogue = "full_intro";
							}
						),
						createResponse(
							`Say the jingle was bad.`,
							(npc) => {
								npc.currDialogue = "full_intro";
							}
						),
						createResponse(
							`Leave`,
							(npc) => {
								npc.currDialogue = "jingle_question";
							}
						)
					];
				}
			},
			jingle_question: {
				text: `Aye! Ye still haven't told me yer thoughts on me jingle!`,
				responses: (npc) => {
					return [
						createResponse(
							`"It was good."`,
							(npc) => {
								npc.currDialogue = "full_intro";
							}
						),
						createResponse(
							`"It was bad."`,
							(npc) => {
								npc.currDialogue = "full_intro";
							}
						)
					];
				},
				shared: ["dots"]
			},
			full_intro: {
				text: `"Arr Har Har!"\n\
							 "Name's Beerbark, what can I do ye for?"`,
				responses: (npc) => {
					return [
						createResponse(
							`"You're a merchant?"`,
							(npc) => {
								npc.flags.haveMet = true;
								npc.currDialogue = "shop_intro";
							}
						)
					]
				}
			},
			shop_intro: {
				text: (npc) => {
					if (npc.flags.itemBought === true) {7
						npc.flags.itemBought = false;
						return `"A pleasure doin' business with ye!"`;
					}
					else if (npc.flags.itemBought == "Key") {
						questLogAPI.addToQuestLog("beerbark_coin", "Beerbark seems to burn orbs when given gold.");

						npc.flags.itemBought = false;
						npc.flags.doublePrice = true;
						return `"Argh. I don't see a use fer this one meself."\n\
										"It'll be of no cost to ye."\n\
										"Next items you'll buy be double though."\n\
										"''Coin's'' quite ''helpful'' fer me ''orb collection''."`;
					}

					return `"Aye! You shop, I slay, I sell... as yer coin permits! What so do ye desire?"`;
				},
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			shop: {
				text: (npc) => {return `//Merchant's Shop// | Current Gold: ${State.variables.player.inventory[0].amount}`;},
				responses: (npc) => {
					return [
						createResponse(
							"Pirate's Key (0g)",
							(npc) => {
								npc.flags.shopOpen = false;

								let requiredCurrency = 0;
								const player = State.variables.player;

								if (player.inventory[0].amount < requiredCurrency) return "no_money";
								const itemIndex = addItemToInventory("prt_key", 1);
								if (itemIndex === -1) return "full_inventory";

								updateGold(requiredCurrency*-1);
								npc.runConsequence(npc, requiredCurrency, 100);
								npc.flags.itemBought = "Key";
								npc.flags.shopStock["Pirate's Key"] = -1;
								return "shop_intro";
							},
							(npc) => {
								return npc.flags.shopStock["Pirate's Key"] >= 1;
							}
						),
						createResponse(
							(npc) => {return `Solid Metal Sword (${npc.flags.doublePrice ? "100" : "50"}g)`;},
							(npc) => {
								npc.flags.shopOpen = false;

								let requiredCurrency = 50; // 1
								const player = State.variables.player;

								if (npc.flags.doublePrice) requiredCurrency *= 2;

								if (player.inventory[0].amount < requiredCurrency) return "no_money";
								const itemIndex = addItemToInventory("sm_sword", 1); // 2
								if (itemIndex === -1) return "full_inventory";

								updateGold(requiredCurrency*-1);
								npc.runConsequence(npc, requiredCurrency, 100);
								npc.flags.itemBought = true;
								npc.flags.shopStock["Solid Metal Sword"] = -1; // 3
								return "shop_intro";
							},
							(npc) => {
								return npc.flags.shopStock["Solid Metal Sword"] >= 1; // 4
							}
						),
						createResponse(
							(npc) => {return `Bronze Shield Necklace (${npc.flags.doublePrice ? "40" : "20"}g)`;},
							(npc) => {
								npc.flags.shopOpen = false;

								let requiredCurrency = 20; // 1
								const player = State.variables.player;

								if (npc.flags.doublePrice) requiredCurrency *= 2;

								if (player.inventory[0].amount < requiredCurrency) return "no_money";
								const itemIndex = addItemToInventory("shield_trinket", 1); // 2
								if (itemIndex === -1) return "full_inventory";

								updateGold(requiredCurrency*-1);
								npc.runConsequence(npc, requiredCurrency, 100);
								npc.flags.itemBought = true;
								npc.flags.shopStock["Bronze Shield Necklace"] = -1; // 3
								return "shop_intro";
							},
							(npc) => {
								return npc.flags.shopStock["Bronze Shield Necklace"] >= 1; // 4
							}
						),
						createResponse(
							(npc) => {return `Silver Shield Necklace (${npc.flags.doublePrice ? "60" : "30"}g)`;},
							(npc) => {
								npc.flags.shopOpen = false;

								let requiredCurrency = 30; // 1
								const player = State.variables.player;

								if (npc.flags.doublePrice) requiredCurrency *= 2;

								if (player.inventory[0].amount < requiredCurrency) return "no_money";
								const itemIndex = addItemToInventory("shield_trinket_2", 1); // 2
								if (itemIndex === -1) return "full_inventory";

								updateGold(requiredCurrency*-1);
								npc.runConsequence(npc, requiredCurrency, 100);
								npc.flags.itemBought = true;
								npc.flags.shopStock["Silver Shield Necklace"] = -1; // 3
								return "shop_intro";
							},
							(npc) => {
								return npc.flags.shopStock["Silver Shield Necklace"] >= 1; // 4
							}
						),
						createResponse(
							(npc) => {return `Gold Shield Necklace (${npc.flags.doublePrice ? "100" : "50"}g)`;},
							(npc) => {
								npc.flags.shopOpen = false;

								let requiredCurrency = 50;
								const player = State.variables.player;

								if (npc.flags.doublePrice) requiredCurrency *= 2;

								if (player.inventory[0].amount < requiredCurrency) return "no_money";
								const itemIndex = addItemToInventory("shield_trinket_3", 1); // 2
								if (itemIndex === -1) return "full_inventory";

								updateGold(requiredCurrency*-1);
								npc.runConsequence(npc, requiredCurrency, 100);
								npc.flags.itemBought = true;
								npc.flags.shopStock["Gold Shield Necklace"] = -1; // 3
								return "shop_intro";
							},
							(npc) => {
								return npc.flags.shopStock["Gold Shield Necklace"] >= 1; // 4
							}
						),
					];
				},
				shared: ["back"]
			},
			no_money: {
				text: `"Perhaps ye best find some currency before making a purchase."`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			full_inventory: {
				text: `"//There isn't enough space in your inventory to make a purchase.//"`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			response_cloak: {
				text: `Aye, perhaps, why do ye ask?`,
				responses: (npc) => {
					return [
						createResponse(
							(npc) => {
								if (NPCs["Coward"].flags.nameKnown) {
									return `"Eteocle needs a new Cloak. A wolf tore his old one."`;
								}

								return `"A scared-looking man claimed you sold him one. A wolf tore it, now he needs a new one."`;
							},
							(npc) => "give_cloak"
						),
						createResponse(
							`"Nevermind."`,
							(npc) => "shop_intro",
						)
					];
				}
			},
			give_cloak: {
				text: `"Arr, Har Har!"\n//Beerbark laughs for a while//\n"That coward's still running around, aye?"\n"He's still gettin' 'imself in' trouble too.\n\
							  I'll tell ye what, for the laugh, take the cloak."`,
				responses: (npc) => {
					return [
						createResponse(
							`Take the cloak.`,
							(npc) => {
								questLogAPI.removeFromQuestLog("eteocle_cloak");
								questLogAPI.addToQuestLog("got_eteocle_cloak", `${State.variables.player.name} got the new cloak for the scared-looking man.`);
								NPCs["Coward"].flags.haveCloak = true;
								return "shop_intro";
							}
						)
					];
				}
			},
			response_brazier: {
				text: `"That be a Glowin' Orb!"\n//Beerbark looks excitedly at the flames//\n"Burn one an' they spit out somethin'... nice."\n`,
				responses: (npc) => {
					return [
						createResponse(
							`Ask to try.`,
							(npc) => "reject_try"
						),
						createResponse(
							`"Can the orbs be used for anything else?"`,
							(npc) => "apathy_orb"
						)
					]
				},
			},
			confrontation1: {
				text: `"If ye be not buying anythin', best ye be on yer way."\n\
							 "I care not fer yer findins."`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			confrontation2: {
				text: `//Beerbark stands, he's visibly taller than he was before.//\n\
							 "Heh. Yer findins have led ye to me now, have they?"\n\
							 //He steps closer.//\n\
							 "Aye. S'pose I am... ''involved'' as ye say, what's it to ye?"`,
				responses: (npc) => {
					return [
						createResponse(
							`"Why?"`,
							(npc) => {npc.flags.c2AClicked = true; return "confrontation2A";},
							(npc) => !npc.flags.c2AClicked
						),
						createResponse(
							`"You're vile."`,
							(npc) => {npc.flags.c2BClicked = true; return "confrontation2B";},
							(npc) => !npc.flags.c2BClicked
						),
						createResponse(
							`Attack`,
							(npc) => {
								npc.flags.safeFight = true;
								npc.flags.isHostile = true;
								return null;
							}
						),
						createResponse(
							"Leave",
							(npc) => {
								npc.flags.c2BClicked = false; 
								npc.flags.c2AClicked = false;
								return "confrontation_exit"
							},
							(npc) => npc.flags.hadConfrontation
						)
					];
				}
			},
			confrontation2A: {
				text: `//Beerbark expression shifts as he excitedly reaches for an object wrapped arond his neck//\n\
							 "Why for this here crystal ye see!"
							 //He pulls back the small green crystal, looking at it with a slightly sullen expression.//
							 "Course... 'tis not quite at the grandeur it once was."`,
				responses: (npc) => {
					return [
						createResponse(
							"Look closer at the crystal",
							(npc) => "confrontation3A",
						),
						createResponse(
							`"You're vile."`,
							(npc) => {npc.flags.c2BClicked = true; return "confrontation2B";},
							(npc) => !npc.flags.c2BClicked
						),
						createResponse(
							`Attack`,
							(npc) => {
								npc.flags.safeFight = true;
								npc.flags.isHostile = true;
								return null;
							}
						),
						createResponse(
							"Leave",
							(npc) => {
								npc.flags.c2BClicked = false; 
								npc.flags.c2AClicked = false; 
								npc.flags.hadConfrontation = true; 
								return "confrontation_exit"
							}
						)
					];
				}
			},
			confrontation2B: {
				text: `//Beerbark bellows in laughter.//\n\
							 "Efficient's the word I'd use meself."`,
				responses: (npc) => {
					return [
						createResponse(
							`"Why?"`,
							(npc) => {npc.flags.c2AClicked = true; return "confrontation2A";},
							(npc) => !npc.flags.c2AClicked
						),
						createResponse(
							`Attack`,
							(npc) => {
								npc.flags.safeFight = true;
								npc.flags.isHostile = true;
								return null;
							}
						),
						createResponse(
							"Leave",
							(npc) => {
								npc.flags.c2BClicked = false; 
								npc.flags.c2AClicked = false; 
								npc.flags.hadConfrontation = true; 
								return "confrontation_exit"
							}
						)
					];
				}
			},
			confrontation3A: {
				text: `//The crystal is cracked all along the edges.//\n\
							 //It clearly used to be part of a much larger whole.//\n\
							 //Beerbark catches $player.name's deeper look at the crystal and quickly pockets it.//
							 "Crystal's not fer sale. Don't be tryin' nothin'."\n\
							 "Only way yer gettin' it is off me corpse."\n\
							 //Beerbark snickers, landing on a rotten smile.//\n\
							 "An' best we not try that. I've gathered far more toys than ye have."`,
				responses: (npc) => {
					questLogAPI.addToQuestLog("beerbark_confront", `Beerbark has threatened ${State.variables.player.name} against trying to oppose them.`);

					return [
						createResponse(
							`"You're vile."`,
							(npc) => {npc.flags.c2BClicked = true; return "confrontation2B";},
							(npc) => !npc.flags.c2BClicked
						),
						createResponse(
							`Attack`,
							(npc) => {
								npc.flags.safeFight = true;
								npc.flags.isHostile = true;
								return null;
							}
						),
						createResponse(
							"Leave",
							(npc) => {
								npc.flags.c2BClicked = false; 
								npc.flags.c2AClicked = false;
								npc.flags.hadConfrontation = true; 
								return "confrontation_exit"
							}
						)
					];
				}
			},
			confrontation_exit: {
				text: "Now. Ye buyin' or leavin'?",
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			reject_try: {
				text: (npc) => {
					return `//He points his finger at ${State.variables.player.name}//\nI'd sooner part with me clothes! Ye best find yer own brazier, this here be mine."`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Can the orbs be used for anything else?"`,
							(npc) => {
								npc.flags.otherAsked = true;
								return "apathy_orb";
							},
							(npc) => !npc.flags.otherAsked
						),
						createResponse(
							`Change topic`,
							(npc) => {
								npc.flags.otherAsked = false;
								return npc.currDialogue;
							}
						)
					];
				}
			},
			apathy_orb: {
				text: (npc) => {
					questLogAPI.addToQuestLog("beerbark_orbs", `Beerbark wouldn't answer if the orbs could be used for anything else.`);
					return `//Beerback's face flashes with annoyance at the question//\n\
									"An' what then?"\n\
									"Wastes me time to be askin' questions like yers."`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`Ask to try.`,
							(npc) => {
								npc.flags.otherAsked = true;
								return "reject_try";
							},
							(npc) => !npc.flags.otherAsked
						),
						createResponse(
							`Change topic`,
							(npc) => {
								npc.flags.otherAsked = false;
								return npc.currDialogue;
							}
						)
					];
				}
			}
		},
		SharedResponses: {
			open_shop: {
				text: `"I want to browse your shop."`,
				onSelect: (npc) => {
					npc.flags.shopOpen = true
					return "shop"
				},
				shouldAppear: (npc) => true
			},
			first_confrontation: {
				text: (npc) => {
					if (npc.flags.lightTowerWatched) {
						return `Discuss the scene at the light tower.`
					}
					else if (npc.flags.gateWatched) {
						return `Discuss the memory at the gate.`
					}
				},
				onSelect: (npc) => {
					npc.flags.confrontState += 1;
					return "confrontation1"
				},
				shouldAppear: (npc) => {
					return npc.flags.confrontState === 0 && (npc.flags.lightTowerWatched || npc.flags.gateWatched);
				}
			},
			second_confrontation: {
				text: `Question Beebark about his involvement with the village battle.`,
				onSelect: (npc) => {
					npc.flags.confrontState += 1;
					return "confrontation2"
				},
				shouldAppear: (npc) => {
					return npc.flags.confrontState >= 1 
					       && (npc.flags.lightTowerWatched && npc.flags.gateWatched && npc.flags.memoryFound);
				}
			},
			ask_cloak: {
				text: `"Do you have a cloak by any chance?"`,
				onSelect: (npc) => {
					npc.flags.shopOpen = false
					return "response_cloak"
				},
				shouldAppear: (npc) => {
					return NPCs["Coward"].flags.pirateMention && !NPCs["Coward"].flags.haveCloak;
				}
			},
			ask_brazier: {
				text: `"What are you burning?"`,
				onSelect: (npc) => {
					npc.flags.shopOpen = false
					return "response_brazier"
				},
				shouldAppear: (npc) => npc.flags.tempDialogue != "response_brazier" && npc.flags.tempDialogue != "reject_try"
			},
			back: {
				text: `Back`,
				onSelect: (npc) => {
					npc.flags.shopOpen = false;
					return "shop_intro";
				},
				shouldAppear: (npc) => npc.flags.shopOpen
			},
			dots: {
				text: "Leave",
				onSelect: (npc) => {
					npc.flags.shopOpen = false;
					return null;
				},
				shouldAppear: (npc) => true
			},
			fight: {
				text: `Attack`,
				onSelect: (npc) => {
					let choice = true;
					if (choice) choice = window.confirm(`You can't take this choice back! (1/2)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (2/2)`);
					
					if (!choice) return npc.currDialogue;
					npc.flags.shopOpen = false;
					npc.flags.safeFight = true;
					npc.flags.isHostile = true;
					return null
				},
				shouldAppear: (npc) =>  NPCs["Coward"].flags.passageState >= 3 || NPCs["Coward"].flags.defeated
			}
		},
		runConsequence: (npc, price, total) => {
			const slayChance = price / total;
			const shouldSlay = Math.random() < slayChance;

			const preyList = ["coagulated_fear", "big_dog", "spirit_mass", 
												"two_headed_spirit", "eldritch_judge", 
												"floating_torso", "guardsman", "charred_moose",
												"floating_limbs", "merged_corpses"];

			if (!shouldSlay) return;
			
			let currPrey = "";

			for (let prey of preyList) {
				if (!hostileLocs[prey]) continue;

				currPrey = prey; break;
			}

			if (currPrey.length <= 0) return;
			const enemyMemory = enemyRewardsMap[currPrey][0];
			hostileLocs[currPrey] = undefined;
			if (enemyMemory) setMemoryStates(enemyMemory, -1);
		},
		updateNPC: (npc) => {
			return;
		},
		endNPC: (npc) => {
			questLogAPI.removeFromQuestLog("beerbark_confront");
			questLogAPI.removeFromQuestLog("beerbark_coin");
			questLogAPI.addToQuestLog("beerbark_done", `Beerbark was defeated by ${State.variables.player.name}.`);
		}
	},
	Soldier: {
		key: "Soldier",
		name: "Camilos",
		currDialogue: "first_line",
		flags: {
			orbCollected: false,
			haveMet: false,
			isHostile: false,
			safeFight: false,
			hostileForm: "camilos_dial",
			hostileText: ["The man stands ready to fight, weapons drawn."],
			hostileIndex: 0,
			foughtLocation: "",
			askedViselli: false,
			askedBeerbark: false,
			askedEteocle: false,
			creatureFound: false,
			creatureMentioned: false,
			nameKnown: false,
			firstMeeting: true,
			tookFlacon: false,
			areaMentioned: false,
			flaconMentioned: false,
			passageState: 1,
			passageHints: [
				"A man can be seen gazing at the scenery nearby.",
			],
			colosseumWatched: false,
			lastMemCount: 0,
			memoryVersion: 0,
			giftSystemActive: false,
			giftCount: 1,
			hasGifts: true,
			smallTalkState: 0,
			smallTalkActive: false
		},
		Dialogues: {
			first_line: {
				text: `"A new face? You must be..."\n//The man interrupts himself.//\n\
							 "You should take this."\n//He reaches into his uniform and pulls out a few small flacons.//`,
				responses: (npc) => {
					return [
						createResponse(
							`"Who are you?"`,
							(npc) => {
								npc.flags.nameKnown = true;
								npc.flags.haveMet = true;
								npc.currDialogue = "introduction";
							}
						),
						createResponse(
							`Take flacons.`,
							(npc) => {
								npc.flags.nameKnown = true
								npc.flags.tookFlacon = true;
								let takenFlacons = 0;
								for (let i = 0; i < npc.flags.giftCount; ++i) {
									if (addItemToInventory("flacon_defense") !== -1) takenFlacons++;
								}
								npc.flags.giftCount -= takenFlacons;
								if (npc.flags.giftCount <= 0) npc.flags.hasGifts = false;
								npc.currDialogue = "introduction2"
							}
						),
						createResponse(
							`Don't take flacons.`,
							(npc) => {
								npc.flags.nameKnown = true
								npc.flags.haveMet = true;
								npc.currDialogue = "introduction"
							}
						),
					];
				},
				shared: ["dots"]
			},
			introduction: {
				text: `"Right, I should introduce myself first."\n"I'm Camilos. Nice to meet you."\n
							 "I know I seem suspicious.\nBelieve me, I have no ill intent."\n
							 "I've just happened to see you fighting a beast earlier. Thought I could help."`,
				responses: (npc) => {
					return [
						createResponse(
							`"I have some questions."`,
							(npc) => {
								npc.flags.firstMeeting = true;
								npc.currDialogue = "default";
							}
						),
						createResponse(
							`Take flacons.`,
							(npc) => {
								npc.flags.tookFlacon = true;
								let takenFlacons = 0;
								for (let i = 0; i < npc.flags.giftCount; ++i) {
									if (addItemToInventory("flacon_defense") !== -1) takenFlacons++;
								}
								npc.flags.giftCount -= takenFlacons;
								if (npc.flags.giftCount <= 0) npc.flags.hasGifts = false;
								npc.currDialogue = "introduction2";
							}
						),
					]
				}
			},
			introduction2: {
				text: (npc) => {
					if (!npc.flags.haveMet)
						return `//The man hands $player.name the flacons.//\n"I've forgotten to introduce myself."\n\
									 "I'm Camilos. Nice to meet you."\n"I hope I haven't spooked you. I've just happened to see you fighting\
									 a beast earlier and thought I could help."`;

					return `//The man hands $player.name the flacons.//\n`
				},
				responses: (npc) => {
					return [
						createResponse(
							`"I have some questions."`,
							(npc) => {
								npc.flags.haveMet = true;
								npc.flags.firstMeeting = true;
								npc.currDialogue = "default";
							}
						)
					];
				}
			},
			default: {
				text: (npc) => {
					npc.flags.activeEteocle = false;
					npc.flags.activeBeerbark = false;
					npc.flags.activeViselli = false;

					if (npc.flags.firstMeeting)
						return `//Camilos offers a smile//\n"I can't promise I have the answers. Ask away."`;

					if (npc.flags.tippingPoint)
						return `"Yes?"`
					else if (npc.flags.giftCount > 0 && npc.flags.giftSystemActive) {
						return `"I've found some more items you might find useful."`
					}

					return `"Hello again. Need anything?"`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"I have a few more questions."`,
							(npc) => "questions_container",
							(npc) => npc.flags.areaMentioned && npc.flags.flaconMentioned && !npc.flags.tippingPoint
						),
						createResponse(
							`Take gifts.`,
							(npc) => "gift_screen",
							(npc) => npc.flags.hasGifts && !npc.flags.tippingPoint && npc.flags.giftSystemActive
						)
					];
				},
				shared: true
			},
			gift_screen: {
				text: (npc) => {
					if (npc.flags.playerFull) return `"You don't have space for these right now. No worries, I'll hold them for you."`
					return `//Camilos reveals a bag containing ${npc.flags.giftCount === 1 ? "a single flacon" : npc.flags.giftCount + " flacons"}.//`
				},
				responses: (npc) => {
					return [
						createResponse(
							`Take a flacon.`,
							(npc) => {
								const attemptTake = addItemToInventory("flacon_defense");
								if (attemptTake === -1) {npc.flags.playerFull = true; return "gift_screen";}
								--npc.flags.giftCount; 
								if (npc.flags.giftCount <= 0) npc.flags.hasGifts = false;
								
								if (npc.flags.giftCount > 0) return "gift_screen";
								if (npc.flags.smallTalkActive) return "default";
								npc.flags.smallTalkActive = true;
								npc.flags.smallTalkState++;
								npc.flags.playerFull = false;
								return "small_talk";
							},
							(npc) => npc.flags.giftCount > 0
						),
						createResponse(
							`Back`,
							(npc) => {
								if (npc.flags.smallTalkActive) return "default";
								npc.flags.smallTalkActive = true;
								npc.flags.smallTalkState++;
								npc.flags.playerFull = false;
								return "small_talk";
							}
						)
					];
				}
			},
			small_talk: {
				text: (npc) => {
					switch(npc.flags.smallTalkState) {
						case 2:
							if (npc.flags.askedViselli) return `"Have you spoken to my sister recently?"`;
							return "Have you met this one lady wearing a uniform?";
						case 3:
							if (npc.flags.askedBeerbark) return `"Sometimes I wonder how Beerbark can be so comfortable here."`;
							return `"Sometimes I wonder how this one friend of mine can be so comfortable here."`;
						case 5:
							return `"I'm curious. Why do you explore? What do you hope to find?"`;
						default:
							return `"It's not much, but it will help."`;
					}
				},
				responses: (npc) => {
					switch(npc.flags.smallTalkState) {
						case 2:
							return [
								createResponse(
									`"Yes."`,
									(npc) => "escape_discussion"
								),
								createResponse(
									`"No."`,
									(npc) => "point_viselli"
								)
							];
						case 5:
							return [
								createResponse(
									`"Riches."`,
									(npc) => "explore_advice"	
								),
								createResponse(
									`"Action and adventure."`,
									(npc) => "explore_advice"	
								),
								createResponse(
									`"I just want to escape."`,
									(npc) => "explore_advice"
								),
								createResponse(
									`"I dont know."`,
									(npc) => "uncertain_advice"
								)
							]
						default:
							return [
								createResponse(
									`Continue`,
									(npc) => "default"
								)
							]
					}
				}
			},
			escape_discussion: {
				text: (npc) => {
							 return `//Camilos sighs in relief//\n\
							 				 "Its good to know ${npc.flags.askedViselli ? "she's" : "my sister's"} still safe out there."\n\
							 				 "I can't understand why she's still so focused on escaping."`
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Isn't it obvious?"`,
							(npc) => "escape_discussion2"
						),
						createResponse(
							`"..."`,
							(npc) => "escape_discussion3"
						)
					];
				}
			},
			escape_discussion2: {
				text: `"Maybe, but I feel as though its more than-"\n\
							 "..."\n\
							 "Nevermind."\n\
							 "I'm overthinking things."`,
				responses: (npc) => {
					return [
						createResponse(
							`Continue`,
							(npc) => "default"
						)
					];
				}
			},
			escape_discussion3: {
				text: `"Maybe it's because-"\n\
							 "..."\n\
							 "Nevermind. I'm overthinking things."`,
				responses: (npc) => {
					return [
						createResponse(
							`Continue`,
							(npc) => "default"
						)
					];
				}
			},
			point_viselli: {
				text: (npc) => {
					return `"${npc.flags.askedViselli ? "" : "That's my sister. "}If you find her, let me know."`
				},
				responses: (npc) => {
					return [
						createResponse(
							`Continue`,
							(npc) => "default"
						)
					];
				}
			},
			explore_advice: {
				text: `"Simple, but I get it."\n\
							 "Word of-"\n\
							 //Camilos pauses, looking off to the side for a moment.//\n\
							 "If I were to offer you some advice, don't chase your goals too hard."\n\
							 "Don't forget everything else."\n\
							 "Its... unsatisfying."`,
				responses: (npc) => {
					return [
						createResponse(
							`Continue`,
							(npc) => "default"
						)
					];
				}
			},
			uncertain_advice: {
				text: `//Camilos cracks a smile.//\n\
				       "Yeah, who does?"\n\
							 //He looks at the ground.//\n\
							 "All we can do is hope we don't do anything we'll regret."`,
				responses: (npc) => {
					return [
						createResponse(
							`Continue`,
							(npc) => "default"
						)
					];
				}
			},
			h_creature: {
				text: `//Camilos tenses up slightly.//\n"I can't fight. Not anymore."\n\
						 "I find supplies sometimes, however."\n//Camilos nods, making eye contact.//\n\
						 "Come back around every so often. I'll save what I find for you."`,
				responses: (npc) => {
					return [];
				},
				shared: ["area_help", "flacon_help", "dots"]
			},
			h_area: {
				text: `"Your guess is as good as mine."\n"A few others and I woke along these islands with no memory of how we arrived."`,
				responses: (npc) => {
					return [
						createResponse(
							`Change topic`,
							(npc) => "default",
							(npc) => npc.flags.areaMentioned && npc.flags.flaconMentioned
						)
					];
				},
				shared: ["combat_help", "flacon_help", "dots"]
			},
			h_flacon: {
				text: `"They're interesting. I've never seen these before I arrived here."\n"You use them like you would perfume."\n\
							 "I initially expected a pleasant smell. Instead they make you feel lighter, stronger, more sturdy."`,
				responses: (npc) => {
					return [
						createResponse(
							`Change topic`,
							(npc) => "default",
							(npc) => npc.flags.areaMentioned && npc.flags.flaconMentioned
						)
					];
				},
				shared: ["combat_help", "area_help", "dots"]
			},
			take_flacon: {
				text: `"Oh, before you go, do take these flacons. I can promise they will be of help to you."`,
				responses: (npc) => {
					return [
						createResponse(
							`Take flacons and leave.`,
							(npc) => {
								npc.flags.firstMeeting = false;
								npc.tookFlacon = true;
								let takenFlacons = 0;
								for (let i = 0; i < npc.flags.giftCount; ++i) {
									if (addItemToInventory("flacon_defense") !== -1) takenFlacons++;
								}
								npc.flags.giftCount -= takenFlacons;
								if (npc.flags.giftCount <= 0) npc.flags.hasGifts = false;
								npc.currDialogue = "default";
							}
						)
					];
				},
				forceEnd: true
			},
			questions_container: {
				text: (npc) => {
					if (!npc.flags.tippingPoint) return `//Camilos offers a smile//\n"I can't promise I have the answers. Ask away."`
					return `"What do you want?"`
				},
				responses: (npc) => {
					return [
						createResponse(
							`Ask about Eteocle`,
							(npc) => {
								npc.flags.askedEteocle = true;
								npc.flags.activeEteocle = true;
								return "discuss_eteocle"},
							(npc) => NPCs.Coward.flags.nameKnown && !npc.flags.activeEteocle
						),
						createResponse(
							`Ask about Beerbark`,
							(npc) => {
								npc.flags.askedBeerbark = true; 
								npc.flags.activeBeerbark = true
								return "discuss_beerbark"},
							(npc) => NPCs.Pirate.flags.haveMet && !npc.flags.activeBeerbark
						),
						createResponse(
							`Ask about the lady in uniform`,
							(npc) => {
								npc.flags.askedViselli = true; 
								npc.flags.activeViselli = true;
								return "discuss_viselli"},
							(npc) => NPCs.General.flags.haveMet && !npc.flags.activeViselli
						),
						createResponse(
							`Change topic`,
							(npc) => "default"
						)
					];
				}
			},
			discuss_eteocle: {
				text: `"I haven't heard of that name before, but there's only one person it could be."\n\
							 "I've never met that man before entering these lands."\n\
							 "My sister tried to lead an expedition to find an escape. The plans fell apart after he ran off."\n\
							 //Camilos pauses//\n\
							 "I haven't seen him since."`,
				responses: (npc) => {
					return npc.Dialogues.questions_container.responses(npc);
				},
			},
			discuss_beerbark: {
				text: `"Ah, Beerbark. When I first met him I thought he was ridiculous."\n\
						   "But he's surprisingly fun to be around, sharp too."\n\
							 "He's a friend. Been that way far longer than we've been in these lands."`,
				responses: (npc) => {
					return npc.Dialogues.questions_container.responses(npc);
				}
			},
			discuss_viselli: {
				text: `//Camilos' eyes quickly light up after a second of thought.//\n\
							 "And what did you think of this person?"`,
				responses: (npc) => {
					return [
						createResponse(
							`"She's quite... formal."`,
							(npc) => "discuss_viselli2"
						),
						createResponse(
							`"She's uptight and rude."`,
							(npc) => "discuss_viselli2"
						)
					];
				}
			},
			discuss_viselli2: {
				text: `//Camilos breaks into a laughter//\n\
							 "Hah! That's my sister all right."\n\
							 "I get that she can be harsh, but don't hold that against her. She's just stressed trying to figure out a solution right now."\n\
							 "Believe me when I say if there's anyone to trust, it's her."`,
				responses: (npc) => {
					return [
						createResponse(
							`"Solution to what?"`,
							(npc) => {
								questLogAPI.addToQuestLog("camilos_advice", `Camilos said that his sister was interested in information from the west-most island.`);

								return "discuss_viselli3"
							}
						),
						...npc.Dialogues.questions_container.responses(npc)
					];
				}
			},
			discuss_viselli3: {
				text: `//Camilos shrugs//\n\
							 "Well we're all stuck here after all."\n\
							 "She's the only one still trying to get out."
							 //Camilos thinks for a bit.//\n\
							 "If you are going to continue exploring, I recommend sending your findings her way."\n\
							 "Last I heard, she wanted to send someone to explore the island past the far west docks."`,
				responses: (npc) => {
					return [...npc.Dialogues.questions_container.responses(npc)];
				}
			},
			colosseum_discussion: {
				text: `//He listens quietly, his face darkened.//\n\
							 "I see you've found it."\n\
							 "..."\n\
							 "I can't deny it."\n\
							 "I- murdered those people."\n\
							 //His hands tremble as he brings them together over his face.//`,
				responses: (npc) => {
					return [
						createResponse(
							`"Why did you do it?"`,
							(npc) => "colosseum_discussion2"
						)
					];
				}
			},
			colosseum_discussion2: {
				text: `"I didn't want-!"\n\
							 //He catches himself.//\n\
							 "Sorry for shouting."\n\
							 "I didn't want to."\n\
							 "My sister told me negotiations with the village failed. The EUS wanted to take control through force."\n\
							 "I tried to protest, but she convinced me."\n\
							 //His whole body begins to shake.//\n\
							 "Told me..."\n\
							 "Told me we were quitting after this last mission."`,
				responses: (npc) => {
					questLogAPI.addToQuestLog("camilos_raid", `Camilos said he was persuaded by his sister to join a raid on a village.`);
					return [
						createResponse(
							`"Then what happened?"`,
							(npc) => "colosseum_discussion3"
						),
						createResponse(
							`"Why were you so brutal?"`,
							(npc) => "colosseum_discussion3"
						)
					];
				}
			},
			colosseum_discussion3: {
				text: `"I closed my eyes and kept pushing, one last time."\n\
							 "..."\n\
							 "I lost control."`,
				responses: (npc) => {
					return [
						createResponse(
							`Change topic`,
							(npc) => "default"
						)
					];
				}
			},
			betrayal_reaction: {
				text: `"Are you having me on?"\n\
							 "How could I not? She's always been there to help."\n\
							  "Anyone could betray me. Anyone could lose my loyalty with enough time. My sister is the ''only'' exception."`,
				responses: (npc) => {
					return [
						createResponse(
							`Reveal the memory of her betrayal.`,
							(npc) => {
								npc.flags.tippingPoint = true;
								return "betrayal_reaction2";
							}
						),
						createResponse(
							`Change topic`,
							(npc) => "default"
						)
					];
				}
			},
			betrayal_reaction2: {
				text: `//He listens initially, yet quickly jumps in anger//\n\
				"I will not hear one more word from you!"\n\
				"If you are trying to turn me against my sister, it won't end well for you."\n\
				"Do not try to take this from me."`,
				responses: (npc) => {
					return [
						createResponse(
							`Continue to explain.`,
							(npc) => "betrayal_reaction3"
						),
						createResponse(
							`Back down`,
							(npc) => "default"
						)
					];
				}
			},
			betrayal_reaction3: {
				text: `"ENOUGH!"\n\
							//He's in a battle stance several feet back, one hand on his sword, the other on his flintlock.//\n\
							"I won't tell you again to stop talking."\n\
							//His face disforms with his thoughts//\n\
							"Where did you hear such an insane story anyway?"`,
				responses: (npc) => {
					return [
						createResponse(
							`Tell Camilos the location`,
							(npc) => {npc.currDialogue = "heel_turn"}
						)
					];
				}
			},
			heel_turn: {
				text: `"You can't be so naive, you really believe everything the island says?"\n\
							"Even if I saw it myself, I would not believe the 'memory'!"\n\
							"I can't stand people like you. You are no longer welcome here!"\n\
							"It's best you leave."`,
				responses: (npc) => {
					return [
						createResponse(
							`Back down`,
							(npc) => {
								return null;
							}
						),
						createResponse(
							`Try to explain further.`,
							(npc) => {
								const angeredText = [`Camilos swings his blade forward with a step.\n"I have given you enough of a warning."`];

								npc.flags.safeFight = true;
								npc.flags.isHostile = true;
								npc.flags.hostileForm = "camilos_angered";
								npc.flags.hostileText = angeredText;

								return null;
							}
						),
					]
				}
			}
		},
		SharedResponses: {
			reveal_betrayal: {
				text: "How can you still trust your sister?",
				onSelect: (npc) => {
					if (npc.flags.tippingPoint) return "betrayal_reaction3"
					else return "betrayal_reaction"
				},
				shouldAppear: (npc) => npc.flags.lastMemCount >= 3 && !npc.flags.firstMeeting && npc.flags.askedViselli
			},
			confront_colosseum: {
				text: `Talk to Camilos about what was at the colosseum.`,
				onSelect: (npc) => {
					npc.flags.confronted = true;
					return "colosseum_discussion";
				},
				shouldAppear: (npc) => npc.flags.colosseumWatched && !npc.flags.firstMeeting && !npc.flags.tippingPoint && !npc.flags.confronted
			},
			combat_help: {
				text: `Ask for help in combat.`,
				onSelect: (npc) => {
					npc.flags.creatureMentioned = true;
					npc.flags.giftSystemActive = true;
					return "h_creature"
				},
				shouldAppear: (npc) => npc.flags.creatureFound && !npc.flags.creatureMentioned
			},
			area_help: {
				text: `"Where are we?"`,
				onSelect: (npc) => {
					npc.flags.areaMentioned = true;
					return "h_area"
				},
				shouldAppear: (npc) => !npc.flags.areaMentioned
			},
			flacon_help: {
				text: `"What are these flacons?"`,
				onSelect: (npc) => {
					npc.flags.flaconMentioned = true
					return "h_flacon"
				},
				shouldAppear: (npc) => !npc.flags.flaconMentioned
			},
			dots: {
				text: "Leave",
				onSelect: (npc) => {
					if (npc.flags.firstMeeting && npc.currDialogue != "first_line") {
						npc.flags.firstMeeting = false
						if (!npc.flags.tookFlacon) return "take_flacon"
					}
					return null;
				},
				shouldAppear: (npc) => true
			},
			fight: {
				text: `Attack`,
				onSelect: (npc) => {
					let choice = true;
					if (choice) choice = window.confirm(`You can't take this choice back! (1/3)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (2/3)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (3/3)`);
					
					if (!choice) return npc.currDialogue;
					npc.flags.isHostile = true;
					npc.flags.safeFight = false;
					return null;
				},
				shouldAppear: (npc) => true
			}
		},
		updateNPC: (npc) => {
			npc.flags.activeEteocle = false;
			npc.flags.activeBeerbark = false;
			npc.flags.activeViselli = false;
			npc.flags.smallTalkActive = false;
			
			const earlierVersion = npc.flags.memoryVersion;
			const currVersion = hostileLocsVersion;
			const versionDifference = currVersion - earlierVersion;

			if (npc.flags.giftCount <= 0) npc.flags.hasGifts = false;

			// Ignore gift system if NPC is not on good terms with player

			if (npc.flags.tippingPoint && npc.flags.passageState == 1 && passage() !== "Palm_1_3") {
				npc.flags.passageState++;
				npc.flags.foughtLocation = null;

				hostileLocs["Thumb_4_7"] = "camilos_monster";
				hostileLocs["Palm_1_3"] = undefined;

				return;
			}

			if (versionDifference !== 0) {
				npc.flags.hasGifts = true;
				npc.flags.memoryVersion = currVersion;
			} else if (npc.flags.giftCount > 0) npc.flags.hasGifts = true;
			
			for (let i = 0; i < versionDifference; ++i) {
				npc.flags.giftCount += 1;
			}
		},
		endNPC: (npc) => {
			questLogAPI.removeFromQuestLog("camilos_run");
			questLogAPI.removeFromQuestLog("camilos_betrayed");
			questLogAPI.addToQuestLog("camilos_done", `Camilos was defeated by ${State.variables.player.name}.`)
		}
	},
	Coward: {
		orbCollected: false,
		key: "Coward",
		name: "Eteocle",
		currDialogue: "first_line",
		flags: {
			haveMet: false,
			passageState: 1,
			passageHints: [
				"The faint sound of a man muttering in contemplation can be heard nearby",
				"The faint sound of a man muttering in frustration can be heard nearby",
				"Faint footsteps can be heard nearby."
			],
			pirateMention: false,
			haveCloak: false,
			nameKnown: false,
			cloakGiven: false,
			patience: 3,
			OH1_Scene: false,
			OH2_Scene: false,
			WT_Scene: false,
			OH_Found: false,
			C_Scene: false,
			scenes: ["WTScene", "OH1Scene", "OH2Scene", "OH"],
			hostileText: [`The angered man has his sword drawn, preventing any further movement until defeated.`],
			hostileIndex: 0,
			isHostile: false,
			hostileForm: "eteocle_dial",
			foughtLocation: "",
			hasFought: false
		},
		Dialogues: {
			first_line: {
				text: `"What will I do..."\n"How am I supposed to get it back..."`,
				responses: (npc) => {
					return [
						createResponse(
							`"I can help."`,
							(npc) => {
								return "introduction";
							}
						)
					];
				},
				shared: ["dots"]
			},
			introduction: {
				text: `"Ah!"\n//The man jumps back in surprise.//\n"N..No thank you, I don't have any money on me."`,
				responses: (npc) => {
					return [
						createResponse(
							`"I just want to help."`,
							(npc) => {
								return "pre_question";
							}
						),
						createResponse(
							`"Nevermind."`,
							(npc) => null
						)
					];
				},
				shared: ["fight"]
			},
			pre_question: {
				text: `"Really?"\n...\n"In that case, do you think you could fight a..."\n"creature of the larger variety?"`,
				responses: (npc) => {
					return [
						createResponse(
							`"Yes."`,
							(npc) => {
								questLogAPI.addToQuestLog("eteocle_wolf", `A scared-looking man asked ${State.variables.player.name} to fight a wolf who took his cloak.`)
								npc.flags.haveMet = true;
								npc.currDialogue = "request_one";
							}
						),
						createResponse(
							`"Nevermind."`,
							(npc) => null
						)
					]
				}
			},
			request_one: {
				text: `"Then, there is a wolf just up ahead, it has my cloak. It's very important to me..."\n"Please, get it back."`,
				responses: (npc) => {
					return [];
				},
				shared: ["dots"]
			},
			after_dog: {
				text: `"Oh no no no, it's ruined..."`,
				responses: (npc) => {
					return [
						createResponse(
							`"Are you okay?"`,
							(npc) => "request_two",
						)
					];
				},
				shared: ["dots"]
			},
			request_two: {
				text: (npc) => {
					questLogAPI.removeFromQuestLog("eteocle_wolf");

					if (npc.flags.haveMet) {
						return `"Ah, hello again. Thank you for taking down the wolf.\n\
						Unfortunately, it already shredded up my cloak."\n\
										 "Could you help me get a new cloak?`;
					}
						return `"Ah, hello. We haven't met before, this wolf you just bravely fought had stolen my cloak!\n\
										 "I thought I could get it back, but unfortunately my cloak's already been shredded."\n\
										 "Could you help me get a new cloak?"`;
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Yes."`,
							(npc) => {
								questLogAPI.addToQuestLog("eteocle_cloak", `The scared-looking man asked ${State.variables.player.name} to get him a new cloak from a merchant on these islands.`);
								npc.flags.pirateMention = true;
								npc.currDialogue = "clarification";
							}
						),
						createResponse(
							`"No."`,
							(npc) => null
						)
					];
				},
				shared: ["fight"]
			},
			clarification: {
				text: `"Really? Many Thanks!"\n"There's a merchant among these islands who sold me this cloak before. I'm not sure where he is, \
								and nowhere near brave enough to go looking."\n"Please find him for me."`,
				responses: (npc) => {
					return [
						createResponse(
							`"I found the merchant."`,
							(npc) => {
								npc.currDialogue = "request_three";
								npc.flags.nameKnown = true;
							},
							(npc) => {
								return NPCs["Pirate"].flags.haveMet;
							}
						)
					];
				},
				shared: ["give_cloak", "dots"]
			},
			request_three: {
				text: `"Great! I would ask for it myself, but these lands are too dangerous for me. Let him know //Eteocle// needs a new cloak."`,
				responses: (npc) => {
					return [];
				},
				shared: ["give_cloak", "dots"]
			},
			going_home: {
				text: (npc) => {
					questLogAPI.removeFromQuestLog("got_eteocle_cloak");
					questLogAPI.addToQuestLog("eteocle_house", "Eteocle left for the house at the bottom of the west-most island.");

					if (npc.flags.nameKnown) {
						return `\\Eteocle visibly shakes with excitement.\\\n"Thank you!"\n"I'll be heading home now, thanks again for all your help!"\n \
						"If you want to stop by, just go to the house in the south part of this island. I'm happy to meet you again anytime!"`;
					}
					npc.flags.nameKnown = true;
					return `\\The man visibly shakes with excitement.\\\n"Ah, i've been rude. I haven't given you my name yet."\n"I'm //Eteocle//." \
									"I'll be heading home now, thanks again for all your help!"\n \
									"If you want to stop by, just go to the house in the south part of this island."`
				},
				responses: (npc) => {
					return [
						createResponse(
							`"Goodbye."`,
							(npc) => {
								npc.flags.passageState++;
								return null;
							}
						)
					];
				},
				shared: ["fight"]
			},
			house_intro: {
				text: `"Hello! It's nice to see you again."`,
				responses: (npc) => {
					return [
						
					];
				},
				shared: true
			},
			ruined_house: {
				text: `//A shot of worry flashes across Eteocle's face//\n\
							 "Did you see anything?"`,
				responses: (npc) => {
					questLogAPI.removeFromQuestLog("eteocle_house");
					questLogAPI.addToQuestLog("eteocle_worried", `Eteocle really does not want ${State.variables.player.name} to explore the ruined house.`)
					return [
						createResponse(
							`"No."`,
							(npc) => "warning"
						)
					];
				},
				shared: true
			},
			warning: {
				text: `//Eteocle takes a second to sigh//\n\
							 "I wouldn't go to that place if I were you, it doesn't hold anything good."`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			plead1: {
				text: `//Eteocle winces//\n"What? You saw that?"\nListen, you really shouldn't be going there."`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			plead2: {
				text: `"How do you..."\n//Eteocle goes quiet//\n"I'm pleading with you, quit doing whatever you're doing."\n\
							 //Eteocle takes a few steps backwards.//\n"You... really should stop."`,
				responses: (npc) => {
					return [];
				},
				shared: true
			},
			escape: {
				text: `//Eteocle presses his palms firmly against his ears and shuts his eyes tight.//\n"STOP!"\n\
							 //A few seconds of silence pass before Eteocle looks up again//\n//Eteocle pulls up the hood of his cloak and vanishes//`,
				responses: (npc) => {
					return [
						createResponse(
							`"Hello?"`,
							(npc) => "no_resp"
						)
					];
				},
				shared: ["dots"]
			},
			no_resp: {
				text: `//No response.//`,
				responses: (npc) => {
					return [];
				},
				shared: ["dots"]
			},
			col_response: {
				text: (npc) => `//As ${State.variables.player.name} explains what they saw, Eteocle's expression increasingly sinks with worry.//\n\
							 "Well that sounds really bad but I haven't been there myself."\n\
							 "I can't help. Sorry."`,
				responses: (npc) => {
					return [
						createResponse(
							`Mention the similarity between the villagers and Eteocle.`,
							(npc) => "prod_response"
						),
					];
				},
				shared: ["dots", "fight"]
			},
			prod_response: {
				text: `//Eteocle's skin tone shifts to a paler hue.//\n\
							 "Sorry yes that's just a coincidence truly sorry I can't help I should be going now I have things to do..."\n\
							 //Eteocle wraps the cloak around himself, disappearing.//
							 //Faint footsteps can be heard exiting the house.//`,
				responses: (npc) => {
					return [];
				},
				shared: ["dots"]
			},
			eteocle_killed: {
				text: (npc) => {
					npc.endNPC(npc);
					npc.flags.defeated = true;
					
					return `//The man is unable to react in time.//\n\
							 		//${State.variables.player.name} cuts them down in one swing.//\n`
				},
				responses: (npc) => {
					return [];
				},
				shared: ["dots"]
			}
		},
		SharedResponses: {
			colosseum: {
				text: `Mention what you saw at the colosseum.`,
				onSelect: (npc) => {
					npc.flags.C_Scene = true;
					return "col_response";
				},
				shouldAppear: (npc) => {
					return !npc.flags.C_Scene && NPCs["Soldier"].flags.colosseumWatched;
				}
			},
			old_house: {
				text: `Talk about the ruined house on the north.`,
				onSelect: (npc) => {
					npc.flags.scenes.splice(npc.flags.scenes.indexOf("OH"), 1);

					return "ruined_house";
				},
				shouldAppear: (npc) => {
					return npc.flags.OH_Found && npc.flags.scenes.length === 4;
				}
			},
			OH_pillar1: {
				text: `Talk about what the pillar with the carving of a mother and daughter.`,
				onSelect: (npc) => {
					npc.flags.patience--;
					npc.flags.scenes.splice(npc.flags.scenes.indexOf("OH1Scene"), 1);

					if (npc.flags.patience === 0) npc.flags.passageState++;

					switch(npc.flags.patience) {
						case 2:
							return "plead1"
						case 1:
							return "plead2"
						case 0:
							return "escape"
					}
				},
				shouldAppear: (npc) => {return npc.flags.OH1_Scene && npc.flags.scenes.indexOf("OH1Scene") !== -1 && !npc.flags.scenes.includes("OH");}
			},
			OH_pillar2: {
				text: `Talk about the pillar with the carving of a dog.`,
				onSelect: (npc) => {
					npc.flags.patience--;
					npc.flags.scenes.splice(npc.flags.scenes.indexOf("OH2Scene"), 1);

					if (npc.flags.patience === 0) npc.flags.passageState++;

					switch(npc.flags.patience) {
						case 2:
							return "plead1"
						case 1:
							return "plead2"
						case 0:
							return "escape"
					}
				},
				shouldAppear: (npc) => {return npc.flags.OH2_Scene && npc.flags.scenes.indexOf("OH2Scene") !== -1 && !npc.flags.scenes.includes("OH");}
			},
			watch_tower: {
				text: `Talk about the pillar on the watch tower.`,
				onSelect: (npc) => {
					npc.flags.patience--;
					npc.flags.scenes.splice(npc.flags.scenes.indexOf("WTScene"), 1);

					if (npc.flags.patience === 0) npc.flags.passageState++;

					switch(npc.flags.patience) {
						case 2:
							return "plead1"
						case 1:
							return "plead2"
						case 0:
							return "escape"
					}
				},
				shouldAppear: (npc) => {return npc.flags.WT_Scene && npc.flags.scenes.indexOf("WTScene") !== -1 && !npc.flags.scenes.includes("OH");}
			},
			give_cloak: {
				text: `Give the cloak.`, 
				onSelect: (npc) => {
					npc.currDialogue = "going_home";
					npc.flags.cloakGiven = true;

					const player = State.variables.player;
					const inventory = player.inventory;

					const idx = inventory.findIndex(it => it && it.name == "Cloak of Invisibility");
					if (idx !== -1) inventory[idx] = null;
				}, 
				shouldAppear: (npc) => {return npc.flags.haveCloak && !npc.flags.cloakGiven}
			},
			dots: {
				text: "Leave",
				onSelect: (npc) => null,
				shouldAppear: (npc) => true
			},
			fight: {
				text: `Attack`,
				onSelect: (npc) => {
					let choice = true;
					if (choice) choice = window.confirm(`You can't take this choice back! (1/3)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (2/3)`);
					if (choice) choice = window.confirm(`You can't take this choice back! (3/3)`);
					
					if (!choice) return npc.currDialogue;
					npc.flags.isHostile = true;
					npc.flags.hasFought = true;
					return "eteocle_killed"
				},
				shouldAppear: (npc) => true
			}
		},
		endNPC: (npc) => {
			console.log(questLogAPI.logUnfinished);
			const eteocleLogs = questLogAPI.logUnfinished.filter(log => log.id.includes("eteocle") && log.id != "eteocle_done");
			for (const log of eteocleLogs) questLogAPI.removeFromQuestLog(log.id);
			questLogAPI.addToQuestLog("eteocle_done", `Eteocle was defeated by ${State.variables.player.name}.`);
		},
		updateNPC: (npc) => {
			if (npc.flags.passageState == 1 && hostileLocs["Pinky_6_3"] == undefined && !npc.flags.defeated) {
				npc.flags.passageState++;
				npc.currDialogue = "after_dog";
			}
			if (npc.flags.passageState == 3 && passage() === "Pinky_13_2" && !npc.flags.defeated) {
				npc.currDialogue = "house_intro";
			}
			if (npc.flags.patience <= 1 && (npc.flags.OH1_Scene && npc.flags.OH2_Scene && npc.flags.WT_Scene)
					&& passage() != "Pinky_13_2" && npc.flags.passageState === 3 && !npc.flags.defeated) {
				npc.flags.passageState++;
			}
		}
	}
};

Macro.add('showNPC', {
	tags: null,
	handler: function() {
		const NPC = NPCs[this.args[0]];
		const stateCondition = this.args[1];
		const bodyText = this.payload[0].contents;

		if (NPC.flags.passageState != stateCondition && NPC.flags.foughtLocation !== passage()) return;

		NPC.updateNPC(NPC);

		const NPCStateMap = {
			"General": "Mem_Gnrl",
			"Soldier": "Mem_Sldr",
			"Pirate": "Mem_Prt",
			"Coward": "Mem_Cwd"
		}

		if (!NPC.flags.isHostile) {
			const link = createLink(bodyText, () => {
				State.variables.activeNPC = this.args[0];
				State.variables.dialogueLocation = passage();
				Engine.play("DialogueScreen");
			});
		
			this.output.appendChild(link);

			return;
		}

		console.log(NPC.flags.foughtLocation);
		if (!NPC.flags.foughtLocation) NPC.flags.foughtLocation = passage();
		console.log(NPC.flags.foughtLocation);
		if (NPC.flags.foughtLocation != passage()) return;
		
		console.log(NPC.flags.defeated, enemyRewardsMap[NPC.flags.hostileForm]);
		if (NPC.flags.defeated && !!enemyRewardsMap[NPC.flags.hostileForm]) {
			console.log(NPC.flags.safeFight);
			console.log(NPC.flags.hostileForm);
			if (!NPC.flags.safeFight) setMemoryStates(NPCStateMap[NPC.key], -1); //State.variables.memoryStates.memories[NPCStateMap[NPC.name]] = -1;
			else setMemoryStates(NPCStateMap[NPC.key], 1); //State.variables.memoryStates.memories[NPCStateMap[NPC.name]] = 1;

			if (NPC.flags.deathText) {
				$(this.output).wiki(NPC.flags.deathText);
				$(this.output).wiki(`\n\n`);
			}
			
			$(this.output).wiki(`<<giveBattleRewards "${NPC.flags.hostileForm}">>`);
			return;
		}

		if (NPC.key != "Coward" && NPC.key != "Soldier" && NPC.key != "Pirate") {
			NPC.updateHostileNPC(NPC);
			$(this.output).wiki(NPC.flags.hostileText[NPC.flags.hostileIndex]);
		}
		else {
			$(this.output).wiki(NPC.flags.hostileText[NPC.flags.hostileIndex]);
			if (NPC.flags.hostileIndex < NPC.flags.hostileText.length - 1) NPC.flags.hostileIndex++;
		}

		if (NPC.flags.hasFought) return;

		NPC.flags.hasFought = true;
		hostileLocs[passage()] = NPC.flags.hostileForm;
	}
});

Macro.add('handleNPC', {
	handler: function() {
		const NPC = NPCs[this.args[0]];
		const type = this.args[1];
		const variable = this.args[2];
		const value = this.args[3];
		
		switch(type) {
			case "flag":
				NPC.flags[variable] = value;
				break;
			case "name":
				NPC.name = value;
				break;
			case "update":
				NPC.updateNPC(NPC);
				const passageState = NPC.flags.passageState;
				const passageHints = NPC.flags.passageHints;

				if (!variable || passageState != variable) break;
				const hintText = passageHints[Math.min(passageState - 1, passageHints.length - 1)];
				
				if (!NPC.flags.defeated) $(this.output).wiki(hintText);
				break;
			case "info":
				if (!NPC.flags.infoData) return UI.alert("No info data exists for this NPC!");
				const initVal = NPC.flags.infoData[variable].value;
				NPC.flags.infoData[variable].value = Math.max(value, initVal);
				break;
			case "end":
				if (NPC.endNPC) NPC.endNPC(NPC);
		}
	}
})