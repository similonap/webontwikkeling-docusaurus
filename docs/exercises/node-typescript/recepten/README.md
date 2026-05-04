### Oefening: Recepten

Maak een nieuw project aan met de naam `recepten`.

Je maakt eerst een interface voor het \`Recept\`\` object. Dit bevat een

* naam (tekst)
* beschrijving (tekst)
* personen (getal)
* ingredienten (array van ingredienten)

voor de ingredienten maak je een interface `Ingredient`. Dit bevat een

* naam (tekst)
* hoeveelheid (tekst) (bv "1 stuk", "1 kg")
* prijs (number)

Maak nu een object aan voor een lasagne recept. Je kan de ingredienten zelf kiezen. Print het recept af en bereken de totale kostprijs van het recept.

#### Voorbeeld interactie

```bash
Recept: Lasagne
Beschrijving: Lekkere lasagne
Personen: 4
Ingredienten:
- 1 pak lasagnevellen
- 500g gehakt
- 1 ui
- 1 teentje look
Totale kostprijs: 10 euro
```