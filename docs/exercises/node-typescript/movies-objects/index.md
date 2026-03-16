### Oefening: Movies

Maak een nieuw project aan met de naam `movies-objects`.

Maak een JSON bestand `movie.json` met de volgende inhoud:

```json
{
    "title": "The Matrix",
    "year": 1999,
    "actors": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    "metascore": 73,
    "seen": true
}
```

Maak een interface voor het bovenstaande Movie object en lees het in aan de hand van een `import` statement. Ken deze toe aan een variabele `movie` en print deze af.

Maak een tweede variable aan myfavoritemovie van het type Movie en geef die een object mee die de info over jouw favoriete film bevat en print deze af.

Maak een derde variable aan myworstmovie van het type Movie en geef die een object mee die de info over jouw meest gehate film bevat en print deze af.

#### Voorbeeld interactie

```bash
Movie from file:
The Matrix (1999)
Actors: Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss
Metascore: 73
Seen: NO

My favorite movie:
The Shawshank Redemption (1994)
Actors: Tim Robbins, Morgan Freeman, Bob Gunton
Metascore: 80
Seen: YES

My worst movie:
The Room (2003)
Actors: Tommy Wiseau, Juliette Danielle, Greg Sestero
Metascore: 9
Seen: YES
```