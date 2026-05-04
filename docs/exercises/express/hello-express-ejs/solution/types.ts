export interface Person {
    name: string;
    age: number;
    profilePic: string;
}

export interface PokemonSprites {
    front_default: string;
    back_default: string; 
}

export interface Pokemon {
    name: string;
    id: number;
    weight: number;
    sprites: PokemonSprites;
  }
  