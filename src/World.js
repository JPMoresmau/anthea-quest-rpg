export const world = {
    "throne": {
        name: "Selaion throne room",
        description: "The throne room of the palace. A bit bare but majestic.",
        npcs: ["Peleus"],
        weapons: [],
        questItems: [],
        potions: [],
        exits: ["study"]
    },
    "study": {
        name: "The study",
        description: "A small room, with a table and stool facing the windows. A chest of books is on the side.",
        npcs: ["Cretien"],
        exits: ["throne"]
    }


}

export const npcs = {
    "Peleus": {
        name: "Peleus, your brother"
    },
    "Cretien": {
        name: "Cretien, your old teacher"
    }
}

export const HEALING_LIFE = 10;
export const POISON_LIFE = -8;

