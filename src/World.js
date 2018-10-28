/**
 * Definition of the game content itself: the locations, NPCs, quest, items, weapons, etc.
 * Potentially the game could be extended just by adding to this, or totally changed, while keeping the same mechanics
 */
import { STARTED, setFlag, raiseXP, useQuestItem, addDiary, updateCharacter, removeFlag, startQuest, achieveQuest, addExit, pickUpPotion, learnSpell, removeMonster } from "./Actions";

/**
 * locations with everything in them: NPCs, weapons, quest items, potions exits between locations
 */
export const world = {
    "throne": {
        name: "Selaion throne room",
        description: "The throne room of the palace. A bit bare but majestic.",
        npcs: ["Peleus"],
        weapons: [],
        questItems: [],
        potions: [],
        exits: ["study","garden","courtyard"]
    },
    "study": {
        name: "The study",
        description: "A small room, with a table and stool facing the windows. A chest of books is on the side.",
        npcs: ["Cretien"],
        exits: ["throne","bedroom"]
    },
    "bedroom": {
        name: "Your bedroom",
        description: "Your bedroom, that for years you shared with Peleus.",
        npcs: ["Nerita"],
        exits: ["study","garden"],
        affordances: ["bedroomMirror"]
    },
    "garden": {
        name: "The royal garden",
        description: "The garden where you played for hours as a little girl",
        exits: ["bedroom","throne","kitchen"],
        questItems: ["scissors"],
        affordances: ["gardenFountain"]         
    },
    "kitchen": {
        name: "The kitchen",
        description: "The kitchen where all meals are prepared. Nice smells make you feel hungry a little.",
        npcs: ["Cherise"],
        exits: ["courtyard","garden","cellar"],
    },
    "cellar": {
        name: "The cellar",
        description: "Dark and a little bit damps. Amphoras and jars line up the walls.",
        exits: ["kitchen"],
        questItems: ["scroll"],
        monster: "rats"
    },
    "courtyard": {
        name: "The courtyard",
        description: "The main courtyard of the castle, where soldiers train.",
        exits: ["throne","armory","gate","kitchen"],
        npcs: ["Scopas"]
    },
    "armory": {
        name: "The armory",
        description: "The guards weapons are kept here, in neat rows",
        exits: ["courtyard"],
        weapons: ["sword"]
    },
    "gate": {
        name: "The castle gate",
        description: "The main - and only - gate to the castle",
        exits: ["courtyard"],
        npcs: ["Theon"]
    },
    "outside": {
        name: "Outside the castle",
        description: "Just outside the castle",
        exits: ["gate","vegetable","village"]
    },
    "vegetable": {
        name: "The vegetable garden",
        description: "The vegetable garden where what you eat grows",
        exits: ["outside"],
        monster: "wildboar"
    },
    "village": {
        name: "Selaion's village",
        description: "The villagers live in these small houses. The game ends here for now, thanks for playing!",
        exits:["outside"]
    }

}

/**
 * NPCs with their possible interactions
 */
export const allNpcs = {
    "Peleus": {
        name: "Peleus, your brother",
        interactions: [
            {text:"I am NOT going to let a girl go chasing a ghost. Your duty is to stay here and marry to strenghten my kingdom.",
             actions:[setFlag("main","PeleusForbidden"),addDiary("main","Peleus forbids me to leave. He'll see!")]
            },
            {ifFlag:{quest:"main",flag:"PeleusForbidden"},
            text:"Once again, I am NOT going to let a girl go chasing a ghost. Your duty is to stay here and marry to strenghten my kingdom. Don't insist!",
            },
            {ifFlag:{quest:"main",flag:"hairCut"},
            actions: [setFlag("main","allowedToLeave"),addDiary("main","Peleus has allowed me to leave on my quest for Father!")],
            text:"I see you're determined enough get rid of the hair you were so proud of. Allright, I will give orders that you're allowed to leave."}
        ]
    },
    "Cretien": {
        name: "Cretien, your old teacher",
        interactions: [{text:"I'm always on the lookout for new knowledge"},
        {
            ifQuestItem:"scroll",
            text:"Ooohh, this scroll is magic spell! Let me see if I can teach you the incantation",
            actions: [useQuestItem("scroll"),learnSpell('fear',1)]
        }]
    },
    "Nerita": {
        name: "Nerita, your maid",
        interactions: [{text:"You'll always be a little girl to me. Let me comb your hair!"},
            {
             ifQuestItem:"scissors",
             type:"question",
             beforeText:"You really want me to cut your hair with these scissors?",
             actions: [setFlag("main","hairCut"),useQuestItem('scissors'),raiseXP(2),updateCharacter('charisma',1),addDiary("main","Nerita cut my hair so I don't look too much like a girl now. I think it suits me.")],
             afterText:"Really a shame to cut such beautiful hair!"
            },{
             ifFlag:{quest:"main",flag:"hairCut"},
             text:"You look like a boy now! A pretty boy!"
            },{
            ifFlag:{quest:"main",flag:"hairCutSelf"},
            type:"question",
            beforeText:"What have you done to your hair? Shall I fix it for you?",
            actions: [removeFlag("main","hairCutSelf"),raiseXP(1),updateCharacter('charisma',1),addDiary("main","Nerita fixed my hair so it doesn't look as bad as it used to.")],
            afterText:"Now, you look a bit better now!"
         }
        
        ]
    },
    "Cherise": {
        name: "Cherise, the cook",
        interactions: [{text: "Don't tell your brother, but there are rats in the cellar. I can't get rid of them, I wish somebody would kill them all!",
                actions:[startQuest("cellarRats"),addDiary("cellarRats","Cherise would like somebody to kill the rats in the cellar.")]}
            ,{  ifFlag:{quest:"cellarRats",flag:STARTED},
                text: "These rats are still roaming the cellar. Can nobody get a sword to them?"
             }
            ,{  ifFlag:{quest:"cellarRats",flag:"killedRats"},
                actions:[achieveQuest("cellarRats",1),addDiary("cellarRats","I killed the rats Cherise was complaining about."),pickUpPotion("healing")],
                text: "Thanks for killing these rats! Here's a little pick-me-up I've made!"
             }
            ,{ ifQuestAchieved: "cellarRats",
               text: "Thanks again for killing these rats!"
            }
        ]
    },
    "Scopas": {
        name: "Scopas, the weapons master",
        interactions: [{
            type:"question",
            beforeText:"You want me to give you a quick training?",
            actions: [setFlag("main","trained"),raiseXP(1),updateCharacter('dexterity',1),addDiary("main","Scopas gave me a hard fighting lesson.")],
            afterText:"You're getting better with a weapon, but you still need to practise!"
           },{
            ifFlag:{quest:"main",flag:"trained"},
            text:"You trained enough for today, don't tire yourself out"
           }
        ]
    },
    "Theon": {
        name: "Theon, a palace guard",
        interactions: [
            {text:"You are forbidden to go outside. I'm sorry my lady, your brother's orders"},
            {
                ifFlag:{quest:"main",flag:"allowedToLeave"},
                text:"Peleus told us we could let you go. Good luck, my lady",
                actions:[raiseXP(2),setFlag("main","exitedPalace"),addDiary("main","I can now go out of the palace"),addExit("outside")]
            },
            {
                ifFlag:{quest:"main",flag:"exitedPalace"},
                text:"Good day, my lady"
            }

        ]
    }
}

/**
 * affordances with their possible interactions
 */
export const allAffordances = {
    "bedroomMirror": {
        name: "A little mirror",
        interactions: [{
            text: "You look at yourself in the mirror"
        },{
            ifQuestItem:"scissors",
            type:"question",
            beforeText:"Cut your hair with the scissors?",
            actions: [setFlag("main","hairCut"),useQuestItem('scissors'),raiseXP(2),addDiary("main","I cut my hair short using the bedroom mirror.")],
            afterText:"You cut your hair short."
        }, {
            ifFlag:{quest:"main",flag:"hairCut"},
            text:"Your look at yourself and your short hair..."
        }
        ]
    },
    "gardenFountain": {
        name: "The garden fountain",
        interactions: [{
            text: "The water is refreshing."
        },{
            ifQuestItem:"scissors",
            type:"question",
            beforeText:"Cut your hair with the scissors while using the fountain as a mirror?",
            actions: [setFlag("main","hairCut"),setFlag("main","hairCutSelf"),useQuestItem('scissors'),raiseXP(2),updateCharacter('charisma',-1),addDiary("main","I cut my hair short using the fountain as a mirror. Not sure I did a great job.")],
            afterText:"You feel you've made a mess, but you cut your hair short."
        }, {
            ifFlag:{quest:"main",flag:"hairCut"},
            text:"Your reflection in the water looks like a grinning boy..."
        }]
    }
}

export const HEALING_LIFE = 10;
export const POISON_LIFE = -8;

/**
 * potions and their effect
 */
export const allPotions = {
    "healing": {
        name: "Healing potion",
        effects:[{characteristic:'life',diff:HEALING_LIFE}]
    },
    "poison": {
        name: "A strong poison",
        effects:[{characteristic:'life',diff:POISON_LIFE}]
    }
}

/**
 * quest items
 */
export const allQuestItems = {
    "scissors": {
        name: "Sharp scissors"
    },
    "scroll": {
        name: "A scroll enscribed with weird characters"
    }
}

/**
 * weapons
 */
export const allWeapons  = {
    "sword" : {name:"Sword",damage:{low:1,high:6}},
    "dagger" : {name:"Dagger",damage:{low:1,high:4}}
}

/**
 * quests
 */
export const allQuests = {
    "main" : {
        text: "Find out what has happened to Creon, your father."
    },
    "cellarRats": {
        text: "Kill the rats in the cellar for Cherise the cook"
    }
}

/**
 * monsters
 */
export const allMonsters = {
    "rats": {
        'name': "Small kitchen rats",
        'character': {
            strength: 3,
            dexterity: 8,
            willpower: 3,
            intelligence: 2,
            charisma: 1,
            level: 1,
            xp: 1,
            life: 4
        },
        'inventory': {
            mainWeapon: {
                name:"Bites",damage:{low:1,high:4}
            }
        },
        'attacks': ["The rats bite you for ${damages} damages","The rats scratch you for ${damages} damages"],
        'miss': "None of the rats manages to hurt you",
        'quest':{name:"cellarRats",flag:"killedRats"}
    },
    "wildboar": {
        'name': "Wild boar",
        'character': {
            strength: 8,
            dexterity: 4,
            willpower: 3,
            intelligence: 2,
            charisma: 1,
            level: 1,
            xp: 3,
            life: 10
        },
        'inventory': {
            mainWeapon: {
                name:"Horns",damage:{low:1,high:6}
            }
        }
    }
}

/**
 * spells
 */
export const allSpells= {
    "fear": {
        'name': "Fear",
        'description': "Causes ennemies to flee in panic",
        'cast': (_state,monster) => {
            const acts=[removeMonster(),raiseXP(monster.character.xp)];
            if (monster && monster.quest){
                acts.push(setFlag(monster.quest.name,monster.quest.flag));
            }
            
            return {
                'description': "The spell causes "+monster.name+" to flee in panic!",
                'death':true,
                'actions': acts
            }
        }
    }
}