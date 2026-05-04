### Oefening: slow-sum

Maak een nieuw project aan met de naam `slow-sum` waarin je jouw bronbestanden voor deze oefening kan plaatsen.

Plaats de onderstaande code in een bestand `index.ts`

```typescript
const slowSum = (a: number, b: number) => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(a+b);
        },1000)
    });
}

const slowMult = (a: number, b: number) => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(a*b);
        },1500)
    });
}
```

Dit zijn 2 functies die een promise terug geven. Ze simuleren een trage som functie en een trage vermenigvuldigings functie.

1. Roep de `slowSum` functie aan met de getallen 1 en 5 en zorg dat ze het resultaat van deze functie op het scherm laat zien. (zie output)
2. Roep de `slowSum` functie opnieuw aan met de getallen 1 en 5 maar zorg deze keer dat na het optellen de vermenigvuldigings functie \``slowMult` wordt aangeroepen dat het resultaat vermenigvuldigd met 2 en dan op het scherm laat zien. (zie output)
3. Maak een eigen `slowDiv` functie dat een deling doet (laat deze 2000 milliseconden duren). Zorg ervoor dat als je een deling door nul doet dat je de promise afkeurt met de melding "You cannot divide by zero".
4. Roep deze functie aan met de getallen 6 en 3 en laat het resultaat op het scherm zien. (zie output)
5. Roep deze functie aan met de getallen 6 en 0 en laat de error op het scherm zien. (zie output)

#### Voorbeeld interactie

```
You cannot divide by zero
1 + 5 = 6
(6 / 3) = 2
(1 + 5) * 2 = 12
```

#### Uitbreiding

Maak een kopie van het `index.ts` oefening en noem deze `index_async.ts`

Gebruik nu **async/await** in plaats van promises.