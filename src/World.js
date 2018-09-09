import { setFlag } from "./Actions";

export const world = {
    "throne": {
        name: "Selaion throne room",
        description: "The throne room of the palace. A bit bare but majestic.",
        npcs: ["Peleus"],
        weapons: [],
        questItems: [],
        potions: [],
        exits: [{"key":"study"}]
    },
    "study": {
        name: "The study",
        description: "A small room, with a table and stool facing the windows. A chest of books is on the side.",
        npcs: ["Cretien"],
        exits: [{"key":"throne"}]
    }


}

export const npcs = {
    "Peleus": {
        name: "Peleus, your brother",
        interactions: [{"text":"I am NOT going to let a girl go chasing a ghost. Your duty is stay here and marry to strenghten my kingdom."},
            {"ifFlag":"hairCut",
            "actions": [()=>setFlag("allowedToLeave")],
            "text":"I see you're determined enough get rid of the hair you were so proud of. Allright, I will give orders that you're allowed to leave."}
        ]
    },
    "Cretien": {
        name: "Cretien, your old teacher",
        interactions: [{"text":"I'm always on the lookout for new knowledge"}]
    }
}

export const HEALING_LIFE = 10;
export const POISON_LIFE = -8;

