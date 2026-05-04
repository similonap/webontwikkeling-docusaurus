### Games-DB

Maak een nieuw project aan met de naam `games-db` en installeer de `mongodb` package.

In deze oefening gaan we een node js applicatie maken die gebruik maakt van een MongoDB database. We gaan een eenvoudige applicatie maken met een lijst van games.
Voorbeeld data

We beginnen met een lijst van Game objecten volgens de volgende interface:

```typescript
interface Game {
    _id?: ObjectId;
    name: string;
    price: number;
    releaseDate: Date;
    rating: number;
    publisher: string;
}
```

en de volgende data:

```typescript
[
    {
        name: 'The Witcher 3: Wild Hunt',
        price: 39.99,
        releaseDate: new Date('2015-05-19'),
        rating: 9.3,
        publisher: 'CD Projekt',
    },
    {
        name: 'Red Dead Redemption 2',
        price: 59.99,
        releaseDate: new Date('2018-10-26'),
        rating: 9.7,
        publisher: 'Rockstar Games',
    },
    {
        name: 'The Legend of Zelda: Breath of the Wild',
        price: 59.99,
        releaseDate: new Date('2017-03-03'),
        rating: 9.6,
        publisher: 'Nintendo',
    },
    {
        name: 'The Elder Scrolls V: Skyrim',
        price: 39.99,
        releaseDate: new Date('2011-11-11'),
        rating: 9.5,
        publisher: 'Bethesda Softworks',
    },
    {
        name: 'The Last of Us Part II',
        price: 59.99,
        releaseDate: new Date('2020-06-19'),
        rating: 9.2,
        publisher: 'Sony Interactive Entertainment',
    },
    {
        name: 'God of War',
        price: 39.99,
        releaseDate: new Date('2018-04-20'),
        rating: 9.4,
        publisher: 'Sony Interactive Entertainment',
    },
    {
        name: 'Dark Souls III',
        price: 59.99,
        releaseDate: new Date('2016-04-12'),
        rating: 9.1,
        publisher: 'FromSoftware',
    },
    {
        name: 'Grand Theft Auto V',
        price: 29.99,
        releaseDate: new Date('2013-09-17'),
        rating: 9.8,
        publisher: 'Rockstar Games',
    },
];
```

#### Opdracht 1

Zorg ervoor dat de data van de games in een MongoDB database terecht komt. Je kan deze data toevoegen in de collection games. De databasenaam mag je zelf kiezen. Kijk eerst na of er al games in de collection staan. Als dat zo is, dan voeg je de games niet toe.

#### Opdracht 2

Maak een functie `showAllGames` die alle games uit de database ophaalt en in de console toont. Toon alleen de naam, de prijs, de release date en de rating van de games. Je kan console.table gebruiken om de data in een tabel te tonen.

#### Opdracht 3

Maak een functie `showGamesByPublisher` die alle games uit de database ophaalt die gepubliceerd zijn door een bepaalde uitgever. De functie heeft als parameter een uitgever. De functie toont de games in de console. Toon alleen de naam, de prijs, de release date en de rating van de games. Je kan console.table gebruiken om de data in een tabel te tonen.

Gebruik deze functie met de parameter "Sony Interactive Entertainment" om te testen of de functie werkt.

#### Opdracht 4

Maak een functie `showGamesCheaperThan` die alle games uit de database ophaalt die goedkoper zijn dan een bepaald bedrag. De functie heeft als parameter een bedrag. De functie toont de games in de console. Toon alleen de naam, de prijs, de release date en de rating van de games. Je kan console.table gebruiken om de data in een tabel te tonen.

Gebruik deze functie met de parameter 40 om te testen of de functie werkt.

#### Opdracht 5
Pas de `showAllGames` functie aan zodat een parameter sort kan meegegeven worden. De parameter sort kan de volgende waarden hebben: name, price, releaseDate en rating. De functie sorteert de games op basis van de parameter sort.

#### Opdracht 6

Maak een functie `showHighestRatedGame` die de game met de hoogste rating uit de database ophaalt en in de console toont. Toon alleen de naam, de prijs, de release date en de rating van de game. Je kan console.table gebruiken om de data in een tabel te tonen (zelfs al is er maar 1 game).

Gebruik deze functie om te testen of de functie werkt.

#### Opdracht 7
Maak een functie `showGamesWithPriceBetween` die alle games uit de database ophaalt die tussen een bepaald bedrag liggen. De functie heeft als parameters een minimum en een maximum bedrag. De functie toont de games in de console. Toon alleen de naam, de prijs, de release date en de rating van de games. Je kan console.table gebruiken om de data in een tabel te tonen.

Gebruik deze functie met de parameters 40 en 50 om te testen of de functie werkt.

#### Opdracht 8
Maak een functie `discountAllGames` die een parameter discount heeft. De parameter discount is een percentage. De functie verlaagt de prijs van alle games met het percentage dat meegegeven is. De functie toont de games in de console. Toon alleen de naam, de prijs, de release date en de rating van de games. Je kan console.table gebruiken om de data in een tabel te tonen.

Toon de games voor en na de korting om te testen of de functie werkt.

#### Opdracht 9

Maak een functie `deleteAllGames` die alle games uit de database verwijdert.

Voer deze functie uit om te testen of de functie werkt. Toon de games in de console om te testen of de games verwijderd zijn.