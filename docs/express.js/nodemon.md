# Nodemon

Nodemon is een npm package die het ontwikkelen van een express applicatie makkelijker maakt. Het zorgt ervoor dat de server automatisch herstart wordt wanneer er een bestand veranderd wordt. Dit is handig omdat je dan niet telkens de server handmatig moet herstarten.

## Installatie via scripts (voorkeur)

Als je nodemon wil gebruiken in je project kan je dit installeren met het volgende commando:

```bash
npm install --save-dev nodemon 
```

Vervolgens kan je in je `package.json` file een script toevoegen dat nodemon gebruikt. Dit kan gedaan worden door het volgende toe te voegen aan je `package.json` file:

```json
"scripts": {
    "start": "nodemon index.ts"
}
```

In dit voorbeeld wordt ervan uitgegaan dat de server file `index.js` heet. Vervang dit door de naam van jouw server file. Vervolgens kan je nodemon starten door het volgende commando uit te voeren in de terminal:

```bash
npm start
```

Het voordeel hierbij is dat de andere developers in je team niet nodemon moeten installeren. Wanneer zij het project clonen en `npm install` uitvoeren, zal nodemon automatisch geïnstalleerd worden en kan het gebruikt worden door `npm start` uit te voeren.

## Globale installatie

Nodemon kan geïnstalleerd worden via npm. Dit kan gedaan worden door het volgende commando uit te voeren. Dit installeert nodemon globaal op je systeem en moet dus maar één keer uitgevoerd worden.

```bash
npm install -g nodemon
```

Nadat nodemon geïnstalleerd is kan het gebruikt worden door het volgende commando uit te voeren in de terminal:

```bash
nodemon index.ts
```

In dit voorbeeld wordt ervan uitgegaan dat de server file `index.js` heet. Vervang dit door de naam van jouw server file. Hij zal zelf de server starten en herstarten wanneer nodig. Je hoeft ook niet meer het `ts-node` commando te gebruiken, nodemon zal dit zelf doen.

## Via npx

Nodemon kan ook gebruikt worden zonder het te installeren. Dit kan gedaan worden door het volgende commando uit te voeren in de terminal:

```bash
npx nodemon index.ts
```

npx is een package runner die standaard bij npm geleverd wordt. Het zal nodemon downloaden en uitvoeren. Het voordeel hiervan is dat nodemon niet geïnstalleerd moet worden op je systeem. Het nadeel is dat het telkens opnieuw gedownload moet worden wanneer je het commando uitvoert.
