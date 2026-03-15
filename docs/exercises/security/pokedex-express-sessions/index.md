### Pokedex Express Sessions

We gaan verder op de code van [Pokedex Express](../../mongodb/pokedex-mongo-express/) en voegen sessions toe. In plaats van de player bij te houden in de URL via path parameters gaan we nu een sessie gebruiker om het player object bij te houden (met bijbehorende pokemon). Zo veranderd er wel wat aan de structuur van de applicatie en de routes.

De routes zullen er als volgt uitzien:
- GET `/`: Toont de startpagina met een lijst van alle spelers.
- POST `/createPlayer`: Maakt een nieuwe speler aan met de naam uit de request body.
- GET `/login/:id`: Logt een speler in door hun ID. Een sessie wordt aangemaakt en de gebruiker wordt doorgestuurd naar het menu.
- GET `/menu`: Toont het menu van de speler.
- GET `/pokemon`: Toont een lijst van Pokémon van de speler en de mogelijkheid om een Pokémon toe te voegen.
- POST `/add/:pokeId`: Voegt een Pokémon toe aan de speler's collectie.
- POST `/delete/:pokeId`: Verwijdert een Pokémon uit de speler's collectie.
- POST `/exit`: Beëindigt de sessie van de speler.

Je merkt op dat er nu nergens nog een player ID in de URL staat buiten uiteraard in de login route. Dit is omdat we nu de speler bijhouden in de sessie. Dit is een veel veiligere manier om data bij te houden dan in de URL.

Gebruik een middleware om te controleren of er een player object zich in de sessie bevindt. Als dit niet het geval is, stuur de gebruiker terug naar de startpagina.