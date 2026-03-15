# Promises

Een belangrijk mechanisme om asynchrone code te schrijven is het gebruik van Promises. Een Promise is een object dat een waarde bevat die pas op een later moment beschikbaar zal zijn. Zoals het engelse woord al aangeeft, is een Promise een belofte dat de functie die een promise teruggeeft, op een later moment een waarde zal teruggeven.

Een van de meest bekende functies die een Promise gebruikt is de fetch functie. Deze functie wordt gebruikt om data op te halen van een server. Alle communicatie tussen je programma en de server moet asynchroon gebeuren. Dit komt omdat je niet wil dat je programma wacht tot er een antwoord komt van de server. Zelfs al gaat de communicatie met de server heel snel, ze gaat in vergelijking met de uitvoering van een gewone instructie veel trager.

## Aanmaken van een Promise

We gaan het gebruik van een Promise bekijken aan de hand van een voorbeeld. We gaan een Promise maken die een getal teruggeeft. Deze zal een vermenigvuldiging uitvoeren. We maken een Promise aan met de new Promise constructor. Deze constructor heeft als argument een functie die twee argumenten heeft: resolve en reject. Deze twee argumenten zijn functies die we kunnen aanroepen om de Promise te laten veranderen van status. Het type dat de promise teruggeeft zetten we tussen de &lt; > tekens. In ons geval is dit een number.

```typescript
const promise = new Promise&lt;number>((resolve, reject) => &#123;
    setTimeout(() => &#123;
        resolve(2*2);
    &#125;, 1000);
&#125;);
```

Je ziet dat we hier een setTimeout functie gebruiken om de Promise na 1 seconde te laten de promise te resolven. De resolve functie wordt aangeroepen met de waarde die de Promise zal teruggeven. In dit geval is dit het getal 4. 

Het gebruiken van de promise gebeurt net zoals in JavaScript met de then functie. Deze functie heeft als argument een functie die de waarde van de promise zal ontvangen. Deze functie wordt pas uitgevoerd als de promise resolved is. 

```typescript
promise.then((result : number) => &#123;
    console.log(result);
&#125;);
```

Het datatype van het result argument is het type dat we hebben opgegeven bij het aanmaken van de promise. In dit geval is dit een number. Je mag het type ook weglaten. TypeScript zal dan zelf het type bepalen aan de hand van het type dat je hebt opgegeven bij het aanmaken van de promise.

## Promise als return type

Meestal maken we niet zelf een Promise aan, maar gebruiken we een functie die een Promise teruggeeft. Deze functie kan dan als return type Promise hebben. We breiden ons voorbeeld uit met een functie die een Promise teruggeeft. Deze functie zal een vermenigvuldiging uitvoeren. We geven de functie een argument mee: number1 en number2. Deze functie zal de vermenigvuldiging van deze twee getallen teruggeven.

```typescript
function multiply(number1: number, number2: number): Promise&lt;number> &#123;
    return new Promise&lt;number>((resolve, reject) => &#123;
        setTimeout(() => &#123;
            resolve(number1 * number2);
        &#125;, 1000);
    &#125;);
&#125;;
```

Als je deze functie gewoon aanroept alsof het een normale functie is kan je zien dat deze een Promise teruggeeft.

```typescript
const result = multiply(2, 2);
console.log(result); 
```

Je zal hier als output het volgende krijgen:

```
Promise &#123; &lt;pending> &#125;
```

Dit betekent dat de Promise nog niet afgerond is. We kunnen de then functie aanroepen op deze Promise om de waarde te gebruiken.

```typescript
const result = multiply(2, 2);
result.then((result) => &#123;
    console.log(result);
&#125;);
```

of we kunnen de then functie meteen aanroepen op de functie.

```typescript
multiply(2, 2).then((result) => &#123;
    console.log(result);
&#125;);
```

## Catch

Als je zelf een promise maakt, dan kan je ook een reject functie aanroepen. Deze functie heeft als argument een error object. Dit object kan je zelf aanmaken. Het is een goed idee om een error object te maken dat een boodschap bevat die uitlegt wat er fout is gegaan. 

```typescript
function multiply(number1: number, number2: number): Promise&lt;number> &#123;
    return new Promise&lt;number>((resolve, reject) => &#123;
        setTimeout(() => &#123;
            if (number1 * number2 > 10) &#123;
                reject(new Error("Result is greater than 10"));
            &#125; else &#123;
                resolve(number1 * number2);
            &#125;
        &#125;, 1000);
    &#125;);
&#125;;
```

Als je een reject functie aanroept, dan zal de then functie niet uitgevoerd worden. Je kan een catch functie aanroepen om de fout af te handelen. Deze functie heeft als argument een functie die het error object zal ontvangen.

```typescript
multiply(4,10)
    .then((result) => console.log(result))
    .catch((error) => console.log(error.message))
```

## Promise All

Als je meerdere promises hebt die je tegelijkertijd wil uitvoeren, dan kan je de Promise.all functie gebruiken. Deze functie heeft als argument een array van promises. Deze functie zal een nieuwe promise teruggeven die resolved is als alle promises in de array resolved zijn. De waarde die deze promise teruggeeft is een array van de waarden van de promises.

```typescript
Promise.all([multiply(2, 2), multiply(3, 3), multiply(4, 4)])
    .then((results: number[]) => console.log(results))
    .catch((error) => console.log(error.message));
```

Het resultaat hier is dus:

```
[4, 9, 16]
```

## Built-in promises

### Filesystem

Toegang tot het filesysteem is iets dat over het algemeen traag gaat, dus is het ook een ideaal voorbeeld van asynchrone code. De `fs` module heeft een aantal functies die je kan gebruiken om bestanden te lezen en te schrijven. Deze functies hebben een variant die promises gebruikt. Deze functies kan je importeren uit de `fs/promises` module.

```typescript
import &#123; readFile &#125; from "fs/promises";

readFile("test.txt", "utf-8")
    .then((result: string) => console.log(result))
    .catch((error) => console.log(error.message));
```

Deze functie zal de inhoud van het bestand `test.txt` inlezen en teruggeven als een string. Als er een fout optreedt, dan zal de catch functie uitgevoerd worden. Bijvoorbeeld als het bestand niet bestaat.

### DNS lookup

Nog een voorbeeld van een ingebouwde promise is de `lookup` functie van de `dns` module. Deze functie zal een IP adres teruggeven als een string. Als er een fout optreedt, dan zal de catch functie uitgevoerd worden.

```typescript
import &#123; lookup &#125; from 'dns/promises';

lookup('ap.be')
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```
