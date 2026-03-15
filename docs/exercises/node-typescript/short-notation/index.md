### Oefening: Short Notation

Maak een nieuw project aan met de naam `short-notation`

* Deze oefening maak je in bestand `short-notation.ts`.
* Schrijf de volgende functies in de kortst mogelijke arrow notaties:

```typescript
const printStuff = (amount: number, text: string):void => &#123;
    console.log(`Hello $&#123;text&#125;, you are number $&#123;amount&#125;`);
&#125;
const twoDArray = (element1: string, element2: string): string[] => &#123;
    return [element1, element2];
&#125;
const numberToString = (number: number): string => &#123;
    return `$&#123;number&#125;`;
&#125;
```