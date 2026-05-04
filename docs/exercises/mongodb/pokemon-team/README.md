### Pokemon Team 

Maak een nieuw project aan met de naam `pokemon-team` en installeer de `mongodb` package. Je kan hiervoor starten vanuit het project [pokemon-team](../../node-typescript/pokemon-team/) dat je al eerder hebt gemaakt.

Pas de code aan zodat je een MongoDB database gebruikt om je pokemon team op te slaan. Gebruik als db "exercises" en als collection "pokemon-team". In de originele oefening werd je team opgeslagen in een array van strings. In een mongoDB database kan je niet rechtstreeks een array van strings opslaan, dus je zal moeten werken met objecten met de interface `TeamPokemon` die er als volgt uitziet:

```typescript
interface TeamPokemon {
    _id?: ObjectId;
    pokemon: string;
}
```

Voor de rest moet de werking van de applicatie hetzelfde blijven. Met het verschil dat je nu de data uit de database haalt in plaats van uit een array en je dus je team kan bewaren tussen verschillende sessies.