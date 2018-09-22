import { setFlag, raiseXP, useQuestItem, addDiary, updateCharacter } from "./Actions";

export const world = {
    "throne": {
        name: "Selaion throne room",
        description: "The throne room of the palace. A bit bare but majestic.",
        npcs: ["Peleus"],
        weapons: [],
        questItems: [],
        potions: [],
        exits: ["study","garden"]
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
        exits: ["study","garden"]
    },
    "garden": {
        name: "The royal garden",
        description: "The garden where you played for hours as a little girl",
        exits: ["bedroom","throne"],
        questItems: ["scissors"]
    }

}

export const allNpcs = {
    "Peleus": {
        name: "Peleus, your brother",
        interactions: [
            {"text":"I am NOT going to let a girl go chasing a ghost. Your duty is to stay here and marry to strenghten my kingdom.",
             "actions":[setFlag("PeleusForbidden"),addDiary("Peleus forbids me to leave. He'll see!")]
            },
            {"ifFlag":"PeleusForbidden",
            "text":"Once again, I am NOT going to let a girl go chasing a ghost. Your duty is to stay here and marry to strenghten my kingdom. Don't insist!",
            },
            {"ifFlag":"hairCut",
            "actions": [setFlag("allowedToLeave"),addDiary("Peleus has allowed me to leave on my quest for Father!")],
            "text":"I see you're determined enough get rid of the hair you were so proud of. Allright, I will give orders that you're allowed to leave."}
        ]
    },
    "Cretien": {
        name: "Cretien, your old teacher",
        interactions: [{"text":"I'm always on the lookout for new knowledge"}]
    },
    "Nerita": {
        name: "Nerita, your maid",
        interactions: [{"text":"You'll always be a little girl to me. Let me comb your hair!"},
            {"ifQuestItem":"scissors",
             "type":"question",
             "beforeText":"You really want me to cut your hair with these scissors?",
             "actions": [setFlag("hairCut"),useQuestItem('scissors'),raiseXP(2),updateCharacter('charisma',1),addDiary("Nerita cut my hair so I don't look too much like a girl now. I think it suits me")],
             "afterText":"Really a shame to cut such beautiful hair!"},
            {"ifFlag":"hairCut",
                "text":"You look like a boy now! A pretty boy!"
            }
        ]
    }
}

export const HEALING_LIFE = 10;
export const POISON_LIFE = -8;

export const allPotions = {
    "healing": {
        "name": "Healing potion",
        "effects":[{characteristic:'life',diff:HEALING_LIFE}]
    },
    "poison": {
        "name": "A strong poison",
        "effects":[{characteristic:'life',diff:POISON_LIFE}]
    }
}

export const allQuestItems = {
    "scissors": {
        "name": "Sharp scissors"
    }
}

export const allWeapons  = {
    "sword" : {name:"Sword",damage:{low:1,high:6}},
    "dagger" : {name:"Dagger",damage:{low:1,high:4}}
}