# Express testen

Nu je weet hoe je Node.js functies test met Jest, kan je ook je Express routes testen. Hiervoor gebruik je de `supertest` library, die het mogelijk maakt om HTTP requests te versturen naar een Express applicatie en de response te testen.

We moeten deze dan ook nog installeren:

```bash
npm i --save-dev supertest @types/supertest
```

Stel dat we een Express applicatie hebben die een GET request afhandelt op de route `/hello`:

```typescript
import express from "express";

const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

export default app;
```

Let wel op dat we nu wel de app moeten exporteren. Dit is nodig om de app te kunnen testen.

We kunnen deze nu testen met:

```typescript
import request from "supertest";

import app from "./index";

describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    });
});
```

Als je deze test nu uitvoert met `npm test`, dan krijg je de volgende error:

```bash
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

Om dit op te lossen kunnen we de app code in een apart bestand zetten en de code in `index.ts` aanpassen:

```typescript
import app from "./app";

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
```

en de rest van de code in `app.ts`:

```typescript
import express from "express";

const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello, world!");
});

export default app;
```

#### Query parameters

Als je een route hebt die query parameters verwacht, kan je deze testen met:

```typescript
app.get("/hello", (req, res) => {
    const name = req.query.name;
    res.send(`Hello, ${name}!`);
});
```

en de test:

```typescript
describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello").query({ name: "world" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    });

    it("should return Hello, John!", async () => {
        const response = await request(app).get("/hello").query({ name: "John" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, John!");
    });
});
```

#### POST requests

Als je een route hebt die POST requests afhandelt, kan je deze testen met:

```typescript
app.post("/hello", (req, res) => {
    const name = req.body.name;
    res.send(`Hello, ${name}!`);
});
```

en de test:

```typescript
describe("POST /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).post("/hello").send({ name: "world" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    });

    it("should return Hello, John!", async () => {
        const response = await request(app).post("/hello").send({ name: "John" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, John!");
    });
});
```

#### HTML responses

Als je een route hebt die HTML responses teruggeeft, kan je deze testen met:

```typescript
app.get("/hello", (req, res) => {
    res.send("<h1>Hello, world!</h1>");
});
```

en de test:

```typescript
describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("<h1>Hello, world!</h1>");
    });
});
```

of je kan de HTML parsen met `node-html-parser` en dan de inhoud van de h1 tag testen:

```typescript
import { parse } from "node-html-parser";

describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const h1 = root.querySelector("h1");
        if (h1) {
            expect(h1.innerText).toBe("Hello, world!");
        }
    });
});
```

### Coverage

Jest kan ook gebruikt worden om de code coverage te berekenen. Dit is het percentage van de code dat door de tests gedekt wordt. Hoe hoger dit percentage, hoe beter je code getest is. Eerst moet je wel in je `package.json` de volgende lijn toevoegen bij de scripts.

```json
"scripts": {
  "coverage": "jest --coverage"
}
```

Nu kan je de coverage berekenen met `npm run coverage`. Je krijgt dan een overzicht van de coverage van je code.

Je krijgt een uitgebreid overzicht van welke lijnen er wel en niet getest zijn. Dit kan je helpen om te zien welke delen van je code nog niet getest zijn en waar je nog extra tests moet schrijven. Je kan dit verslag vinden in de map `coverage/lcov-report/index.html`.
