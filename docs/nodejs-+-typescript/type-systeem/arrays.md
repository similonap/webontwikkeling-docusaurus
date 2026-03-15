# Arrays

Tijdens het onderdeel van datatypes hebben we heel kort het concept `Array` laten vallen. In TypeScript is een Array een lijst van waarden. Elke waarde kan aangesproken worden aan de hand van een index.

### Gebruik

Net zoals bij andere variabelen moeten we in TypeScript bij het maken van een variabele voor een array een type geven. Dit type kan je op twee verschillende manieren uitdrukken. Het is in TypeScript niet de bedoeling om verschillende types in een array te steken. Als je kiest voor 1 type dan moeten de rest van de elementen van hetzelfde type zijn.

We kiezen bijvoorbeeld een array van getallen (numbers). De declaratie van de variabele zal er als volgt uit zien

```typescript
let numbers : number[];
```

We willen meestal ook als begin waarde een lege array meegeven. Er zitten dus op dat moment nog geen waarden in. We kunnen een lege array toekennen aan de variabele op de volgende manier:

```typescript
let numbers : number[] = [];
```

:::info
In andere talen zoals Java en C# moet je de lengte van de array meegeven. In JavaScript en TypeScript is dat niet zo. De array zal groeien met het aantal elementen er in geplaatst worden.
:::

Je kan ook op voorhand al een aantal elementen meegeven:

```typescript
let numbers : number[] = [1,2,3,4,5];
```

Om een element op te vragen van een array kan je dat doen aan de hand van vierkante haakjes met daarin een getal. Dit getal komt overeen met de positie van het element dat je wil opvragen. Let op: ook in TypeScript begint het eerste element bij 0.

```typescript
let fruits : string[] = ["Banana","Apple","Orange"];

console.log(fruits[0]); // Banana
console.log(fruits[1]); // Apple
console.log(fruits[2]); // Orange
```

Vraag je een element voor een index op die niet bestaat dan krijg je undefined

```typescript
console.log(fruits[3]); // undefined
```

Als je een element wil vervangen kan je dit op de volgende manier doen:

```typescript
fruits[2] = "Pear";
```

Je kan ook elementen toevoegen nadat je de array hebt gedeclareerd:

```typescript
fruits[3] = "Kiwi";
```

Soms is het nodig om te weten hoeveel elementen er in de array zitten. Dit kan je met `length` doen.

```typescript
let fruits : string[] = ["Banana","Apple","Orange"];

console.log(fruits.length); // 3
```

Je kan ook de array uitprinten in je console venster. Dit is vooral handig tijdens het debuggen

```typescript
let fruits : string[] = ["Banana","Apple","Orange"];

console.log(fruits); // [ 'Banana', 'Apple', 'Orange' ]
```

Ook een loop over een array is zeer gelijkaardig aan JavaScript.

```typescript
let fruits : string[] = ["Banana","Apple","Orange"];

for (let i : number = 0; i &lt; fruits.length; i++) &#123;
    console.log(fruits[i]);
&#125;
```

Door type inference is het ook mogelijk het type van `i` weg te laten. TypeScript zal dit automatisch als een `number` type beschouwen.

```typescript
let fruits : string[] = ["Banana","Apple","Orange"];

for (let i = 0; i &lt; fruits.length; i++) &#123;
    console.log(fruits[i]);
&#125;
```

In de `for...of` loop wordt in TypeScript de types van het element automatisch ingevuld. Je moet dus ook het type van `fruit` weglaten.

```typescript
let fruits : string[] = ["Banana","Apple","Orange"];

for (let fruit of fruits) &#123;
    console.log(fruit);
&#125;
```

### Multi-dimensionale arrays

Een array kan ook een array bevatten. Dit noemen we een multi-dimensionale array. Je kan dit op de volgende manier doen:

```typescript
let matrix : number[][] = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];
```

Je kan deze array op dezelfde manier gebruiken als een gewone array. Je kan bijvoorbeeld het eerste element van de eerste array opvragen op de volgende manier:

```typescript
console.log(matrix[0][0]); // 1
```

Nog een voorbeeld:

```typescript
let starterPokemon : string[][] = [
    ["Bulbasaur","Charmander","Squirtle"],
    ["Chikorita","Cyndaquil","Totodile"],
    ["Treecko","Torchic","Mudkip"]
];
```

Als je hier over wil itereren met een for loop kan je dit op de volgende manier doen:

```typescript
for (let i=0;i&lt;starterPokemon.length;i++) &#123;
    console.log(`Generation $&#123;i+1&#125;:`);
    for (let j=0;j&lt;starterPokemon[i].length;j++) &#123;
        console.log(starterPokemon[i][j])
    &#125;
&#125;
```

### Tuples

Tuples zijn een speciaal soort array waar je een vast aantal elementen kan aan toevoegen waarvan het type van bekend is.

Bijvoorbeeld als je een coordinaat op een kaart zou willen in een array steken weet je dat de x coordinaat op index 0 staat en de y coordinaat op index 1. Dit kan je aan de hand van een tuple op de volgende manier schrijven

```typescript
const coordinate: [number, number] = [50,3];
```

je kan deze voor de rest op dezelfde manier als een andere array gebruiken

```typescript
console.log(coordinate[0]);
console.log(coordinate[1]);
```

Je kan ook meer dan twee types meegeven in een tuple. Als we bijvoorbeeld ook de stad willen bijhouden die op die coordinaten liggen kan je dit op de volgende manier doen:

```typescript
let country : [string, number, number] = [
    "Rotterdam", 51.926517, 4.462456
];
```

Je kan ook arrays maken van tuples. Bijvoorbeeld als we een lijst van landen willen maken

```typescript
let countries : [string, number, number][] = [
    ["Rotterdam", 51.926517, 4.462456],
    ["Amsterdam", 52.374021, 4.88969],
    ["Utrecht", 52.0908, 5.1214],
    ["Antwerpen", 51.227741, 4.402465],
    ["Brussel", 50.85467, 4.351697],
    ["Gent", 51.05, 3.7167]
];
```

We kunnen hier ook over loopen met een for...of lus:

```typescript
for (let country of countries) &#123;
    console.log(`$&#123;country[0]&#125; $&#123;country[1]&#125; $&#123;country[2]&#125;`)
&#125;
```

