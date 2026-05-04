### Oefening: at least two

Maak een nieuw project aan met een bestand `at-least-two` met de volgende inhoud:

```typescript
interface TestFunction {
    (n: number): boolean
}
```

* Schrijf een arrow functie `isOdd` die deze interface implementeert die teruggeeft of een getal oneven is.
* Schrijf een arrow functie `isEven` die deze interface implementeert die teruggeeft of een getal even is.
* Verzin twee andere functie's die deze interface implementeert.
* Schrijf een arrow functie genaamd `atLeastTwo` die twee argumenten aanvaard. Het eerste argument is een array van getallen en de tweede argument is een functie van het type `TestFunction`
* Deze functie geeft true terug als minstens twee elementen voldoen aan de meegegeven functie.

Bijvoorbeeld:

```typescript
console.log(atLeastTwo([2,3,4,6,8], isOdd));
console.log(atLeastTwo([2,3,4,5,6,8], isOdd));
```

geeft de volgende output:

```
false
true
```
