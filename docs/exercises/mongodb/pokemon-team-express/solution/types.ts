import { ObjectId } from "mongodb";

export interface TeamPokemon {
    _id?: ObjectId;
    pokemon: string;
}