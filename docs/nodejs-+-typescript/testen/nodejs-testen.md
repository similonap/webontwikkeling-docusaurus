# Node.js testen

### Basis

Om een bepaalde functie te kunnen testen, moet je deze functie exporteren. Daarom is het belangrijk om zoveel mogelijk modules te gebruiken die je kan exporteren.

Stel dat je een functie hebt die een string omzet naar hoofdletters in een bestand `string-utils.ts`:

```typescript
export function toUpperFunction(input: string): string {
    let chars: string = "";
    for (let char of input) {
        const code = char.charCodeAt(0);
        if (code >= 97 && code <= 122) {  // Checking if the character is a lowercase letter
            chars += String.fromCharCode(code - 32);  // Converting to uppercase
        } else {
            chars += char;  // Adding non-lowercase characters unchanged
        }
    }
    return chars;
}
```

Om deze functie te testen, maak je een bestand `string-utils.test.ts`:

```typescript
import { toUpperFunction } from "./string-utils";

describe("toUpperFunction", () => {
    it("should convert a string to uppercase", () => {
        expect(toUpperFunction("hello")).toBe("HELLO");
    });

    it("should not convert a string that is already uppercase", () => {
        expect(toUpperFunction("HELLO")).toBe("HELLO");
    });

    it("should not convert a string that is not a letter", () => {
        expect(toUpperFunction("123")).toBe("123");
    });
});
```

`it` is een functie die een test definieert. De eerste parameter is een beschrijving van de test, de tweede parameter is een functie die de test uitvoert. Je kan ook `test` gebruiken in plaats van `it`.

We kunnen nu de tests uitvoeren met `npm test`. We krijgen dan volgende output:

```bash
PASS  ./string-utils.test.ts
  toUpperFunction
    ✓ should convert a string to uppercase (2 ms)
    ✓ should not convert a string that is already uppercase
    ✓ should not convert a string that is not a letter
```

Jammer genoeg is hier de tester hier niet in geslaagd om de bug te vinden. De functie `toUpperFunction` is namelijk niet correct. Als de input speciale tekens bevat zoals de duitse karacters met umlauten, dan zal de functie deze niet omzetten naar hoofdletters. De volgende test zou dit kunnen aantonen:

```typescript
it("should convert a string with umlauts to uppercase", () => {
    expect(toUpperFunction("äöü")).toBe("ÄÖÜ");
});
```

Deze test zal falen. De correcte implementatie van de functie zou zijn:

```typescript
export function toUpperFunction(input: string): string {
    return input.toUpperCase();
}
```

#### Exceptions

Als je een functie hebt die een exception kan gooien, kan je dit testen met `toThrow`:

```typescript
export function calculateSquareRoot(num: number): number {
    if (num < 0) {
        throw new Error("Cannot calculate the square root of a negative number.");
    }
    return Math.sqrt(num);
}
```

We kunnen deze nu testen met:

```typescript
import { calculateSquareRoot } from "./math-utils";

describe("calculateSquareRoot", () => {
    it("should calculate the square root of a positive number", () => {
        expect(calculateSquareRoot(4)).toBe(2);
    });

    it("should throw an error when calculating the square root of a negative number", () => {
        expect(() => calculateSquareRoot(-4)).toThrow("Cannot calculate the square root of a negative number.");
    });
});
```

Let op dat we hier een arrow functie gebruiken om de functie `calculateSquareRoot` op te roepen. Dit is nodig omdat we anders de exception niet zouden kunnen opvangen en de test zou falen.

#### Asynchronous code

Als je een functie hebt die asynchroon werkt, kan je dit testen met `async` en `await`:

```typescript
export async function fetchUser(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 1) {
                resolve("John Doe");
            } else {
                reject(new Error("User not found"));
            }
        }, 1000);
    });
}
```

We kunnen deze nu testen met:

```typescript
import { fetchUser } from "./user-service";

describe("fetchUser", () => {
    it("should fetch a user by id", async () => {
        const user = await fetchUser(1);
        expect(user).toBe("John Doe");
    });

    it("should throw an error when the user is not found", async () => {
        try {
            await fetchUser(2);
        } catch (error: any) {
            expect(error.message).toBe("User not found");
        }
    });
});
```

#### Test setup en teardown

Als je bepaalde code wil uitvoeren voor en na elke test, kan je dit doen met `beforeEach`, `afterEach`, `beforeAll` en `afterAll`. Deze kunnen zich in de `describe` blokken bevinden of globaal in het bestand.

```typescript
beforeAll(() => {
    console.log("Before all tests");
});

beforeEach(() => {
    console.log("Before each test");
});

afterEach(() => {
    console.log("After each test");
});

afterAll(() => {
    console.log("After all tests");
});
```

Dit wordt gebruikt om bijvoorbeeld een database connectie te openen en te sluiten voor en na elke test.

## Coverage

Jest kan ook gebruikt worden om de code coverage te berekenen. Dit is het percentage van de code dat door de tests gedekt wordt. Hoe hoger dit percentage, hoe beter je code getest is. Eerst moet je wel in je `package.json` de volgende lijn toevoegen bij de scripts.

```json
"scripts": {
  "coverage": "jest --coverage"
}
```

Nu kan je de coverage berekenen met `npm run coverage`. Je krijgt dan een overzicht van de coverage van je code.

Je krijgt een uitgebreid overzicht van welke lijnen er wel en niet getest zijn. Dit kan je helpen om te zien welke delen van je code nog niet getest zijn en waar je nog extra tests moet schrijven. Je kan dit verslag vinden in de map `coverage/lcov-report/index.html`.
