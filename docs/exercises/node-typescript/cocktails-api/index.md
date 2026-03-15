### Cocktail API

Maak een nieuw project aan met de naam `cocktails-api`.

Maak gebruik van de cocktail API om de gebruiker een ingrediënt te laten opgeven. Vervolgens toon je alle cocktails waarin dit ingrediënt voorkomt.

Je kan de cocktails met een bepaald ingrediënt opvragen via de volgende URL:
```
https://www.thecocktaildb.com/api/json/v1/1/search.php?s=kiwi
```

Blijf cocktails opvragen tot de gebruiker een lege string opgeeft.

#### Voorbeeld interactie

```plaintext
-------------------------------------------
| Welcome to the cocktail lookup service. |
-------------------------------------------
Please provide an ingredient: Kiwi
Cocktails with Kiwi:
- Kiwi Lemon
- Kiwi Martini
- Kiwi Papaya Smoothie
Please provide an ingredient: lemon
Cocktails with lemon:
- Gin Lemon
- Lemon Shot
- Lemon Drop
- Kiwi Lemon
- Vodka Lemon
- New York Lemonade
- California Lemonade
- Strawberry Lemonade
- Cherry Electric Lemonade
- Lemon Elderflower Spritzer
- Grape lemon pineapple Smoothie
Please provide an ingredient: 
```