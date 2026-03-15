# Testing

Testen van applicaties gebeurt op verschillende niveaus. Hoewel niet iedereen dezelfde niveaus van elkaar onderscheidt, maakt men in het algemeen een onderscheid tussen **unit testing** en **end-to-end testing**.

Unit testing omvat het testen van individuele onderdelen van de code, zoals functies of methoden. Meestal wordt hier een white-box principe gehanteerd: de tester kent de inhoud van de unit en mag code schrijven die gebruik maakt van deze kennis. Typische frameworks voor unit testing van Express applicaties zijn Mocha en Jest.

End-to-end testing omvat het testen "zoals een gebruiker". Deze vorm volgt het black-box principe. In essentie omvat dit het automatiseren van volledige browserinteracties. Typische frameworks zijn Cypress of Selenium.

## Jest

Jest is een testframework dat origineel ontwikkeld werd door Facebook. Het is een van de meest populaire testframeworks voor JavaScript. Jest is een all-in-one oplossing die zowel de testrunner als de assertion library bevat. Jest is zeer eenvoudig in gebruik en heeft een goede documentatie.

### Installatie

Om Jest te installeren, voer je volgend commando uit:

```bash
npm i --save-dev jest ts-jest @types/jest
```

### Configuratie

Om Jest te kunnen gebruiken (met TypeScript), voer je dit commando uit:

```bash
npx ts-jest config:init
```

Om te zorgen dat je al je Jest-tests kan laten lopen met npm test, voeg je dit toe aan package.json:

```json
"scripts": &#123;
  "test": "jest"
&#125;
```

### Node.js testen

#### Basis

Om een bepaalde functie te kunnen testen, moet je deze functie exporteren. Daarom is het belangrijk om zoveel mogelijk modules te gebruiken die je kan exporteren.

Stel dat je een functie hebt die een string omzet naar hoofdletters in een bestand `string-utils.ts`:

```typescript
export function toUpperFunction(input: string): string &#123;
    let chars: string = "";
    for (let char of input) &#123;
        const code = char.charCodeAt(0);
        if (code >= 97 && code &lt;= 122) &#123;  // Checking if the character is a lowercase letter
            chars += String.fromCharCode(code - 32);  // Converting to uppercase
        &#125; else &#123;
            chars += char;  // Adding non-lowercase characters unchanged
        &#125;
    &#125;
    return chars;
&#125;
```

Om deze functie te testen, maak je een bestand `string-utils.test.ts`:

```typescript
import &#123; toUpperFunction &#125; from "./string-utils";

describe("toUpperFunction", () => &#123;
    it("should convert a string to uppercase", () => &#123;
        expect(toUpperFunction("hello")).toBe("HELLO");
    &#125;);

    it("should not convert a string that is already uppercase", () => &#123;
        expect(toUpperFunction("HELLO")).toBe("HELLO");
    &#125;);

    it("should not convert a string that is not a letter", () => &#123;
        expect(toUpperFunction("123")).toBe("123");
    &#125;);
&#125;);
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
it("should convert a string with umlauts to uppercase", () => &#123;
    expect(toUpperFunction("äöü")).toBe("ÄÖÜ");
&#125;);
```

Deze test zal falen. De correcte implementatie van de functie zou zijn:

```typescript
export function toUpperFunction(input: string): string &#123;
    return input.toUpperCase();
&#125;
```

#### Exceptions

Als je een functie hebt die een exception kan gooien, kan je dit testen met `toThrow`:

```typescript
export function calculateSquareRoot(num: number): number &#123;
    if (num &lt; 0) &#123;
        throw new Error("Cannot calculate the square root of a negative number.");
    &#125;
    return Math.sqrt(num);
&#125;
```

We kunnen deze nu testen met:

```typescript
import &#123; calculateSquareRoot &#125; from "./math-utils";

describe("calculateSquareRoot", () => &#123;
    it("should calculate the square root of a positive number", () => &#123;
        expect(calculateSquareRoot(4)).toBe(2);
    &#125;);

    it("should throw an error when calculating the square root of a negative number", () => &#123;
        expect(() => calculateSquareRoot(-4)).toThrow("Cannot calculate the square root of a negative number.");
    &#125;);
&#125;);
```

Let op dat we hier een arrow functie gebruiken om de functie `calculateSquareRoot` op te roepen. Dit is nodig omdat we anders de exception niet zouden kunnen opvangen en de test zou falen.

#### Asynchronous code

Als je een functie hebt die asynchroon werkt, kan je dit testen met `async` en `await`:

```typescript
export async function fetchUser(id: number): Promise&lt;string> &#123;
    return new Promise((resolve, reject) => &#123;
        setTimeout(() => &#123;
            if (id === 1) &#123;
                resolve("John Doe");
            &#125; else &#123;
                reject(new Error("User not found"));
            &#125;
        &#125;, 1000);
    &#125;);
&#125;
```

We kunnen deze nu testen met:

```typescript
import &#123; fetchUser &#125; from "./user-service";

describe("fetchUser", () => &#123;
    it("should fetch a user by id", async () => &#123;
        const user = await fetchUser(1);
        expect(user).toBe("John Doe");
    &#125;);

    it("should throw an error when the user is not found", async () => &#123;
        try &#123;
            await fetchUser(2);
        &#125; catch (error: any) &#123;
            expect(error.message).toBe("User not found");
        &#125;
    &#125;);
&#125;);
```

#### Test setup en teardown

Als je bepaalde code wil uitvoeren voor en na elke test, kan je dit doen met `beforeEach`, `afterEach`, `beforeAll` en `afterAll`. Deze kunnen zich in de `describe` blokken bevinden of globaal in het bestand.

```typescript
beforeAll(() => &#123;
    console.log("Before all tests");
&#125;);

beforeEach(() => &#123;
    console.log("Before each test");
&#125;);

afterEach(() => &#123;
    console.log("After each test");
&#125;);

afterAll(() => &#123;
    console.log("After all tests");
&#125;);
```

Dit wordt gebruikt om bijvoorbeeld een database connectie te openen en te sluiten voor en na elke test.

### Express testen

Als we een Express applicatie willen testen, kunnen we gebruik maken van de `supertest` library. Deze library maakt het mogelijk om HTTP requests te versturen naar een Express applicatie en de response te testen.

We moeten deze dan ook nog installeren:

```bash
npm i --save-dev supertest @types/supertest
```

Stel dat we een Express applicatie hebben die een GET request afhandelt op de route `/hello`:

```typescript
import express from "express";

const app = express();

app.get("/hello", (req, res) => &#123;
    res.send("Hello, world!");
&#125;);

app.listen(3000, () => &#123;
    console.log("Server is running on http://localhost:3000");
&#125;);

export default app;
```

Let wel op dat we nu wel de app moeten exporteren. Dit is nodig om de app te kunnen testen.

We kunnen deze nu testen met:

```typescript
import request from "supertest";

import app from "./index";

describe("GET /hello", () => &#123;
    it("should return Hello, world!", async () => &#123;
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    &#125;);
&#125;);
```

Als je deze test nu uitvoert met `npm test`, dan krijg je de volgende error:

```bash
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

Om dit op te lossen kunnen we de app code in een apart bestand zetten en de code in `index.ts` aanpassen:

```typescript
import app from "./app";

app.listen(3000, () => &#123;
    console.log("Server is running on http://localhost:3000");
&#125;);
```

en de rest van de code in `app.ts`:

```typescript
import express from "express";

const app = express();

app.get("/hello", (req, res) => &#123;
    res.send("Hello, world!");
&#125;);

export default app;
```

#### Query parameters

Als je een route hebt die query parameters verwacht, kan je deze testen met:

```typescript
app.get("/hello", (req, res) => &#123;
    const name = req.query.name;
    res.send(`Hello, $&#123;name&#125;!`);
&#125;);
```

en de test:

```typescript
describe("GET /hello", () => &#123;
    it("should return Hello, world!", async () => &#123;
        const response = await request(app).get("/hello").query(&#123; name: "world" &#125;);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    &#125;);

    it("should return Hello, John!", async () => &#123;
        const response = await request(app).get("/hello").query(&#123; name: "John" &#125;);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, John!");
    &#125;);
&#125;);
```

#### POST requests

Als je een route hebt die POST requests afhandelt, kan je deze testen met:

```typescript
app.post("/hello", (req, res) => &#123;
    const name = req.body.name;
    res.send(`Hello, $&#123;name&#125;!`);
&#125;);
```

en de test:

```typescript
describe("POST /hello", () => &#123;
    it("should return Hello, world!", async () => &#123;
        const response = await request(app).post("/hello").send(&#123; name: "world" &#125;);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    &#125;);

    it("should return Hello, John!", async () => &#123;
        const response = await request(app).post("/hello").send(&#123; name: "John" &#125;);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, John!");
    &#125;);
&#125;);
```

#### HTML responses

Als je een route hebt die HTML responses teruggeeft, kan je deze testen met:

```typescript
app.get("/hello", (req, res) => &#123;
    res.send("<h1>Hello, world!</h1>");
&#125;);
```

en de test:

```typescript
describe("GET /hello", () => &#123;
    it("should return Hello, world!", async () => &#123;
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("<h1>Hello, world!</h1>");
    &#125;);
&#125;);
```

of je kan de HTML parsen met `node-html-parser` en dan de inhoud van de h1 tag testen:

```typescript
import &#123; parse &#125; from "node-html-parser";

describe("GET /hello", () => &#123;
    it("should return Hello, world!", async () => &#123;
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const h1 = root.querySelector("h1");
        if (h1) &#123;
            expect(h1.innerText).toBe("Hello, world!");
        &#125;
    &#125;);
&#125;);
```

### Coverage

Jest kan ook gebruikt worden om de code coverage te berekenen. Dit is het percentage van de code dat door de tests gedekt wordt. Hoe hoger dit percentage, hoe beter je code getest is. Eerst moet je wel in je `package.json` de volgende lijn toevoegen bij de scripts.

```json
"scripts": &#123;
  "coverage": "jest --coverage"
&#125;
```

Nu kan je de coverage berekenen met `npm run coverage`. Je krijgt dan een overzicht van de coverage van je code.

Je krijgt een uitgebreid overzicht van welke lijnen er wel en niet getest zijn. Dit kan je helpen om te zien welke delen van je code nog niet getest zijn en waar je nog extra tests moet schrijven. Je kan dit verslag vinden in de map `coverage/lcov-report/index.html`.

### Mocking

Unit testen wordt vaak lastiger wanneer je code interageert met "de buitenwereld": filesystemen, databanken, invoer van de gebruiker, uitvoer naar de terminal, externe servers,...

Om deze reden wordt vaak gebruik gemaakt van "mocks": waarden die de plaats innemen van onderdelen die het moeilijk maken om unit testen te schrijven. Deze leveren vooraf vastgelegde data af eerder dan de echte handelingen uit te voeren. Achteraf kunnen we ook controleren dat deze gebruikt zijn zoals verwacht. Dit past binnen het black box principe dat gehanteerd wordt voor unit testen. Jest bevat ingebouwde functionaliteit voor het maken van mocks.

#### Database

We hebben gekozen om onze database altijd in een aparte module te steken die onze collection exporteert. Dit maakt het makkelijk om deze te mocken. We gaan hierbij gebruik maken van de `spyOn` functie van Jest om de functies van de database module te mocken.

```typescript
app.get("/pets", async (req, res) => &#123;
    let pets : Pet[] = await getPets();
    res.render("pets", &#123; pets &#125;);
&#125;);
```

```typescript
import &#123; collection, getPets &#125; from "./database";
import request from "supertest";
import app from "./app";

test("that /pets calls the getPets function", async () => &#123;
    const mockPets = [
        &#123; name: "Fido", species: "dog" &#125;,
        &#123; name: "Milo", species: "cat" &#125;,
    ];
    const toArrayMock = jest.fn().mockResolvedValue(mockPets);
    const findMock = jest.spyOn(collection, 'find').mockImplementation(() => (&#123;
        toArray: toArrayMock
    &#125;) as any);
    const response = await request(app).get("/pets");
    expect(response.status).toBe(200);
    expect(findMock).toHaveBeenCalledWith(&#123;&#125;);
&#125;);
```

De `spyOn` functie maakt een mock van de `find` functie van de `collection` module. We geven aan dat deze mock de `toArray` functie moet teruggeven met de waarde `mockPets`. We controleren dan of de `find` functie van de `collection` module aangeroepen is met de juiste parameters.

#### Fetch

We gebruiken fetch om requests op externe services te doen. Omdat dit iets is dat je vaak wil mocken (om te vermijden dat netwerkstoringen testen doen falen, om te vermijden dat je API-limieten bereikt,...) is hier speciale ondersteuning voor.

We installeren eerst fetch-mock-jest (als development dependency).

De clientcode:

```typescript
interface Pokemon &#123;
    name: string,
    url: string,
&#125;

app.get("/pokemon", async (req: Request, res: Response) => &#123;
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2");
    const pokemon = (await response.json()).results as Pokemon[];
    res.render("pokemon", &#123; names: pokemon.map((&#123;name&#125;) => name) &#125;);
&#125;);
```

De testcode:

```typescript
import fetchMock from 'fetch-mock-jest';

describe("pokemon", () => &#123;
  it("Should display Pokemon names based on request result", async () => &#123;
    const mockResponse = &#123; results: [&#123; name: "squirtle" &#125;, &#123; name: "wartortle" &#125;] &#125;;
    // deze is automatisch gepatcht na de import
    fetchMock.get("https://pokeapi.co/api/v2/pokemon?limit=2", mockResponse);
    const response = await request(Server.getServer()).get('/pokemon');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<li>');
    expect(response.text).toContain('squirtle');
    expect(response.text).toContain('wartortle');
  &#125;)
&#125;);
```

#### Neveneffecten vermijden

Om te vermijden dat andere operaties die fs.readFile nodig hebben niet fout lopen, moeten we zorgen dat de mock enkel in deze testfunctie gebruikt wordt. Daarom voegen we in de testfile deze regel toe:

```typescript
afterEach(() => jest.clearAllMocks());
```

Als we dit buiten de describe-blokken doen, gebeurt dit na elke test.
