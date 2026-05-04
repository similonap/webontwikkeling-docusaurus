### Oefening: Pokemon team

Maak een nieuw project aan met de naam `pokemon`&#x20;

Gegeven is de volgende array van 20 pokemon:

```
let pokemon: string[] = [
    "Bulbasaur",
    "Ivysaur",
    "Venusaur",
    "Charmander",
    "Charmeleon",
    "Charizard",
    "Squirtle",
    "Wartortle",
    "Blastoise",
    "Caterpie",
    "Metapod",
    "Butterfree",
    "Weedle",
    "Kakuna",
    "Beedrill",
    "Pidgey",
    "Pidgeotto",
    "Pidgeot",
    "Rattata",
    "Raticate",
    "Spearow",
];
```

* Maak een variabele `team`van het type string\[]. Deze array bevat de pokemon van de gebruiker van het programma.
* Gebruik een lus om de pokemon te tonen aan de gebruiker. Toon eerst de index gevolgd door de naam van de pokemon. Je gebruikt dus nog NIET de ingebouwde `keyInSelect` van de readline-sync library.

```
0. Bulbasaur
1. Ivysaur
2. Venusaur
3. Charmander
4. Charmeleon
...
```

* Vraag daarna aan de gebruiker welke pokemon er moet toegevoegd worden aan het team. Dit doe je aan de hand van de index van de pokemon. Dit doe je tot de gebruiker STOP ingeeft. Je kan dit doen aan de hand van een `do while` loop.

```
Welke pokemon wil je in je team? [0-20]: 4
Welke pokemon wil je in je team? [0-20]: 3
Welke pokemon wil je in je team? [0-20]: STOP
```

* Als de gebruiker een pokemon ingeeft die al in het team zet dan krijgt hij hiervan een melding en wordt de pokemon niet toegevoegd:

```
Welke pokemon wil je in je team? [0-20]: 4
Welke pokemon wil je in je team? [0-20]: 3
Welke pokemon wil je in je team? [0-20]: 4
Deze pokemon zit al in je team
Welke pokemon wil je in je team? [0-20]: 2
Welke pokemon wil je in je team? [0-20]: STOP
```

* Als de pokemon niet bekend is (dus het ingegeven nummer groter is dan de lengte van de array) wordt er ook een melding gegeven:

```
Welke pokemon wil je in je team? [0-20]: 21
Deze pokemon ken ik niet
Welke pokemon wil je in je team? [0-20]: 4
```

* Als je STOP hebt ingegeven dan wordt het team van de gebruiker op het scherm getoond:

```
Welke pokemon wil je in je team? [0-20]: 1
Welke pokemon wil je in je team? [0-20]: 2
Welke pokemon wil je in je team? [0-20]: 3
Welke pokemon wil je in je team? [0-20]: 4
Welke pokemon wil je in je team? [0-20]: 5
Welke pokemon wil je in je team? [0-20]: 6
Welke pokemon wil je in je team? [0-20]: STOP
Jouw team van pokemon is: 
1. Ivysaur
2. Venusaur
3. Charmander
4. Charmeleon
5. Charizard
6. Squirtle
```

**Voorbeeld interactie:**

![](pokemon.gif)