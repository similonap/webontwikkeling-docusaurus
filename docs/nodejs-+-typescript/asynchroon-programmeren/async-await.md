# Async/Await

Naast de then en catch functies kan je ook gebruik maken van de async en await keywords. Deze keywords zorgen ervoor dat je code eruit ziet alsof het synchroon is, maar dat het eigenlijk asynchroon is. Over het algemeen wordt het gebruik van async en await aangeraden boven het gebruik van then en catch omdat het de code leesbaarder maakt. 

We grijpen terug naar het voorbeeld van de `multiply` functie:

```typescript
function multiply(number1: number, number2: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(number1 * number2);
        }, 1000);
    });
};
```

Stel je voor dat we eerst de getallen 2 en 2 willen vermenigvuldigen en daarna het resultaat willen vermenigvuldigen met 5. We kunnen dit doen met de then functie:

```typescript
multiply(2, 2).then((result) => {
    multiply(result, 5).then((result) => {
        console.log(result);
    });
});
```

Dit valt nog mee, maar als we nog een vermenigvuldiging willen uitvoeren wordt het al snel onleesbaar:

```typescript
multiply(2, 2).then((result) => {
    multiply(result, 5).then((result) => {
        multiply(result, 10).then((result) => {
            console.log(result);
        });
    });
});
```

Dit probleem noemen we ook wel de callback hell. Om dit probleem op te lossen kunnen we gebruik maken van async en await. We maken de functie waarin we de vermenigvuldigingen willen uitvoeren async. We kunnen dan de await keyword gebruiken om te wachten tot de Promise is afgerond. 

```typescript
let result : number = await multiply(2, 2);
result = await multiply(result, 5);
result = await multiply(result, 10);
console.log(result);
```

Let wel op dat als je deze code plaatst in de globale scope, je een error zal krijgen. Dit komt omdat je de await keyword enkel kan gebruiken in een async functie. Je kan dit oplossen door de code in een async functie te plaatsen of door de code in een IIFE (Immediately Invoked Function Expression) te plaatsen. 

```typescript
async function main() {
    let result : number = await multiply(2, 2);
    result = await multiply(result, 5);
    result = await multiply(result, 10);
    console.log(result);
}
main();
```

```typescript
(async () => {
    let result : number = await multiply(2, 2);
    result = await multiply(result, 5);
    result = await multiply(result, 10);
    console.log(result);
})();
```

Ook de catch functie kan je vervangen door een try catch blok. 

```typescript
try {
    let result : number = await multiply(2, 2);
    result = await multiply(result, 5);
    result = await multiply(result, 10);
    console.log(result);
} catch (error) {
    console.log(error);
}
```