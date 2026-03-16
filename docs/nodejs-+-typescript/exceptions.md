# Exceptions

## Throw

Soms kan het gebeuren dat er een fout optreedt tijdens het uitvoeren van je programma. Dit kan bijvoorbeeld gebeuren als je een bestand wil openen dat niet bestaat. In dit geval zal je programma crashen of vreemd gedrag beginnen vertonen. Bijvoorbeeld als je een functie wil schrijven voor het delen van twee getallen. Als je de functie aanroept met een deler die gelijk is aan 0, dan zal de functie een foutmelding moeten geven. 

```typescript
function divide(a: number, b: number): number {
    return a / b;
}

console.log(divide(5, 0)); // Output: Infinity
```

In dit geval krijg je geen foutmelding maar een vreemd resultaat, je krijgt `Infinity` als resultaat. Dit is niet wat we willen. We willen dat de functie een foutmelding geeft als de deler gelijk is aan 0. Dit kunnen we doen aan de hand van een `if` statement en de `throw` statement.

```typescript
function divide(a: number, b: number): number {
    if (b == 0) {
        throw new Error("Division by zero is not allowed");
    }
    return a / b;
}

console.log(divide(5, 0)); // Error: Division by zero is not allowed
```

Let nu wel op dat je de functie niet meer kan gebruiken zoals hieronder. Als je de functie aanroept met een deler die gelijk is aan 0 dan zal de functie een foutmelding geven en zal je programma stoppen met uitvoeren (en dus "crashen").

## Try catch

Willen we nu deze foutmelding opvangen en zelf een foutmelding geven aan de gebruiker dan kunnen we dit doen aan de hand van een `try catch` statement. We kunnen de functie aanroepen in een `try` block en de foutmelding opvangen in een `catch` block. In het `catch` block kunnen we dan zelf een foutmelding geven aan de gebruiker.

```typescript
try {
    console.log(divide(5, 0));
} catch (error) {
    console.log("Je kan niet delen door 0");
}
```

Natuurlijk is dit een beetje een nutteloos voorbeeld, want je weet op voorhand dat deze functie een fout zal geven omdat je zelf als programmeur de deler op 0 hebt gezet. Maar als je de twee getallen afhankelijk maakt van de input van een gebruiker dan kan je niet op voorhand weten of de deler gelijk zal zijn aan 0. In dat geval kan je de foutmelding opvangen en zelf een foutmelding geven aan de gebruiker en opnieuw vragen naar de input.

```typescript
import * as readline from 'readline-sync';

function divide(a: number, b: number): number {
    if (b == 0) {
        throw new Error("Division by zero is not allowed");
    }
    return a / b;
}

let result : number | undefined = undefined;

while (result == undefined) {
    let a = readline.questionInt("Geef een getal: ");
    let b = readline.questionInt("Geef een getal: ");
    try {
        result = divide(a, b);
    } catch (error) {
        console.log("Je kan niet delen door 0");
    }
}

console.log("Het resultaat is " + result);
```

### Finally

Je kan ook een `finally` block toevoegen aan je `try catch` statement. Dit block zal altijd uitgevoerd worden, ook als er geen foutmelding is opgetreden. Dit kan handig zijn als je bijvoorbeeld een bestand hebt geopend en je wil dit bestand altijd sluiten, ook als er een foutmelding is opgetreden. Dus bijvoorbeeld:

```typescript
try {
    console.log(divide(5, 0));
} catch (error) {
    console.log("Je kan niet delen door 0");
} finally {
    console.log("Dit print altijd");
}
```

Met het bovenstaande voorbeeld krijg je de volgende output:

```
Je kan niet delen door 0
Dit print altijd
```

### Error object

Als je een foutmelding opvangt in een `catch` block dan kan je deze foutmelding gebruiken in je code. Tot nu toe hebben we altijd een nieuw Error object aangemaakt en zelf een foutmelding gegeven. Maar je kan ook de foutmelding die je opvangt gebruiken. Dit is een object met een aantal properties die je kan gebruiken. Zo heeft dit object een `message` property die de foutmelding bevat. Je kan deze property gebruiken om de foutmelding te tonen aan de gebruiker. Let er op dat je hier het type `unknown` (of `any`) moet gebruiken omdat je niet weet welk type de foutmelding zal hebben.

```typescript
try {
    console.log(divide(5, 0));
} catch (error : any) {
    console.log(error.message);
}
```

```typescript
try {
    console.log(divide(5, 0));
} catch (error : unknown) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}
```

Dit zal de volgende output geven:

```
Division by zero is not allowed
```



In principe is het ook mogelijk om een foutmelding op te gooien zonder een Error object te gebruiken. Je kan bijvoorbeeld een string opgooien als foutmelding. 

```typescript
function divide(a: number, b: number): number {
    if (b == 0) {
        throw "Division by zero is not allowed";
    }
    return a / b;
}
```

Dan kan je uiteraard wel niet meer gebruik maken van de `message` property van het Error object.