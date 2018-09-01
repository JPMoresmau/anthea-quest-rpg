export const CHARACTER_UPDATE = 'CHARACTER_UPDATE'

export function updateCharacter(characteristic, diff) {
    return {
      type: CHARACTER_UPDATE,
      characteristic,
      diff
    }
  }
