### Movies DB

Maak een nieuw project aan met de naam `movies-db` en installeer de `mongodb` package. 

Maak volgende variabele aan:

```typescript
let movies = [
    {name: "The Matrix", myScore: 90, timesViewed: 10},
    {name: "Pulp Fuction", myScore: 100, timesViewed: 100},
    {name: "Monster Hunter", myScore: 5, timesViewed:1},
    {name: "Blade Runner", myScore: 100, timesViewed:30},
    {name: "Austin Powers", myScore: 80, timesViewed:10},
    {name: "Jurasic Park 2", myScore: 40, timesViewed:1},
    {name: "Ichi the Killer", myScore: 80, timesViewed:1}
];
```

#### Stap 1: Toevoegen van de films aan de database

- Maak een interface aan die overeenkomt met de objecten in movies. 
- Geef movies het juiste type
- Zorg dat deze films in jouw collection Movies in MongoDB terechtkomen. Je kan hiervoor gebruik maken van een lokale MongoDB database of een MongoDB Atlas database. Gebruik als db "exercises" en als collection "movies".
- Kijk na via de mongoDB vscode extension of de films in de database zitten.

#### Stap 2: Films tonen

- Zet de de code die de insert doet in de database in commentaar anders worden de films telkens opnieuw toegevoegd. We zien later nog hoe we dit kunnen oplossen.
- Doe een query op de database en toon de eerste film via de console.
- Doe een query op de database en toon alle films via de console.

#### Voorbeeld interactie

```
First movie:
Movie: The Matrix, My Score: 90, Times Viewed: 10
All movies:
Movie: The Matrix, My Score: 90, Times Viewed: 10
Movie: Pulp Fuction, My Score: 100, Times Viewed: 100
Movie: Monster Hunter, My Score: 5, Times Viewed: 1
Movie: Blade Runner, My Score: 100, Times Viewed: 30
Movie: Austin Powers, My Score: 80, Times Viewed: 10
Movie: Jurasic Park 2, My Score: 40, Times Viewed: 1
Movie: Ichi the Killer, My Score: 80, Times Viewed: 1
```
