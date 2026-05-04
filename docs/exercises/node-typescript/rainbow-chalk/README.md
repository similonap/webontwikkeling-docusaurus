### Rainbow Chalk

Maak een nieuw project aan met de naam `rainbow-chalk`.

Installeer de volgende npm packages:
- chalk@4 (https://www.npmjs.com/package/chalk)
- rainbow-color-array-ts (https://www.npmjs.com/package/rainbow-colors-array-ts)

Bekijk goed de documentatie van de packages om te zien hoe je deze packages kunt gebruiken.

Maak een nieuwe file aan met de naam `index.ts`. Importeer de packages die je hebt geïnstalleerd. Gebruik de packages om een regenboog van kleuren te loggen naar de console.

Volg het volgende stappenplan om de oefening te maken:
1. Importeer de RgbColor en rainbow functies uit de rainbow-colors-array-ts module.
2. Importeer de chalk module.
3. Bepaal de hoogte en breedte van de terminal. Dit kan je doen aan de hand van de `process.stdout.rows` en `process.stdout.columns` eigenschappen.
4. Genereer een array van kleuren aan de hand van de rainbow functie. Gebruik de hoogte van de terminal als eerste argument en "rgb" als tweede argument. Kijk zeker eerst naar wat exact de functie teruggeeft. Je kan dit doen door de console log functie te gebruiken op de array van kleuren.
5. Loop over de array van kleuren en print een regel met een achtergrondkleur voor elke kleur. Gebruik hiervoor de `bgRgb` functie van de chalk module. Gebruik de breedte van de terminal om te bepalen hoeveel karakters je moet printen. 
6. Sit back and enjoy the rainbow!

#### Voorbeeld interactie

![alt text](rainbow.png)