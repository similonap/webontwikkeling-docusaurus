### Oefening: Short Notation

Maak een nieuw project aan met de naam `short-notation`

* Deze oefening maak je in bestand `short-notation.ts`.
* Schrijf de volgende functies in de kortst mogelijke arrow notaties:

```typescript
const printStuff = (amount: number, text: string):void => {
    console.log(`Hello ${text}, you are number ${amount}`);
}
const twoDArray = (element1: string, element2: string): string[] => {
    return [element1, element2];
}
const numberToString = (number: number): string => {
    return `${number}`;
}
```