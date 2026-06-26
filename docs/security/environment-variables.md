# Environment Variabelen

Soms wil je bepaalde gegevens niet hard coderen in je code. Dit kan bijvoorbeeld het geval zijn wanneer je een geheime sleutel hebt die je niet wil delen met anderen of wanneer je een bepaalde instelling wilt kunnen wijzigen zonder je code te moeten aanpassen. In deze gevallen kan je gebruik maken van environment variabelen.

Omgevingsvariabelen in Node worden gebruikt om:
- Gevoelige gegevens op te slaan, zoals wachtwoorden, API-referenties en andere informatie die niet rechtstreeks in je code mag worden geschreven om beveiligingsrisico's te voorkomen.
- Instellingen te configureren die kunnen verschillen tussen omgevingen. Denk maar aan poorten en verwijzingen naar databanken (development, staging, test of productie).

## Terminal

Je hebt out of the box toegang tot omgevingsvariabelen in Node.js. Wanneer je een Node server opstart, biedt het automatisch toegang tot alle bestaande omgevingsvariabelen door een env-object te maken binnen het globale process object.

Als je bijvoorbeeld:

```
PORT=3000 node server.ts
```

uitvoert in de terminal, kan je de waarde van de omgevingsvariabele `PORT` ophalen met `process.env.PORT`.

```javascript
console.log( process.env.PORT)
```

Als je deze niet hebt ingesteld, zal de waarde `undefined` zijn. We kunnen dit oplossen door er een default waarde aan toe te kennen.

```javascript
const port = process.env.PORT || 3000;

console.log(port);
```

## Dotenv bestand

Als je er eenmaal een aantal hebt gedefinieerd, zal je snel merken dat het een onderhoudsnachtmerrie wordt. Stel je voor dat je een tiental omgevingsvariabelen gebruikt. Dit schaalt niet goed als je ze allemaal op één regel moet typen.

Omgevingsvariabelen uitvoeren vanaf een terminal is zeker handig. Maar het heeft zijn nadelen:
- Je kan de lijst met variabelen niet raadplegen;
- Het is veel te gemakkelijk om een typfout te maken;

Een veel gebruikte oplossing voor het organiseren en onderhouden van je omgevingsvariabelen is het gebruik van een .env-bestand. Het helpt ons om alle omgevingsvariabelen op één plek te definiëren en indien nodig te wijzigen.

Bijvoorbeeld, in een .env-bestand:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017
```

Om een `.env` bestand te gebruiken in je Node.js project, moet je de `dotenv` package installeren.

```
npm install dotenv
```

Vervolgens moet je de package importeren in je code en de `config` methode aanroepen. Op dat moment zal de package de variabelen uit het `.env` bestand laden in `process.env`.

```javascript
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.PORT);
console.log(process.env.MONGO_URI);
```

Doe je dit niet, dan zal je `undefined` zien in de console.

## Gitignore

Het is belangrijk om te weten dat omgevingsvariabelen of een `.env` bestand nooit mogen worden opgenomen in je versiebeheer. Dit is een beveiligingsrisico omdat het gevoelige informatie bevat. Zorg ervoor dat je deze bestanden toevoegt aan je `.gitignore` bestand.

```plaintext
.env
```