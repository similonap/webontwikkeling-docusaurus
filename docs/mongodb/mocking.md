# Mocking

Unit testen wordt vaak lastiger wanneer je code interageert met "de buitenwereld": filesystemen, databanken, invoer van de gebruiker, uitvoer naar de terminal, externe servers,...

Om deze reden wordt vaak gebruik gemaakt van "mocks": waarden die de plaats innemen van onderdelen die het moeilijk maken om unit testen te schrijven. Deze leveren vooraf vastgelegde data af eerder dan de echte handelingen uit te voeren. Achteraf kunnen we ook controleren dat deze gebruikt zijn zoals verwacht. Dit past binnen het black box principe dat gehanteerd wordt voor unit testen. Jest bevat ingebouwde functionaliteit voor het maken van mocks.

## Database

We hebben gekozen om onze database altijd in een aparte module te steken die onze collection exporteert. Dit maakt het makkelijk om deze te mocken. We gaan hierbij gebruik maken van de `spyOn` functie van Jest om de functies van de database module te mocken.

```typescript
app.get("/pets", async (req, res) => {
    let pets : Pet[] = await getPets();
    res.render("pets", { pets });
});
```

```typescript
import { collection, getPets } from "./database";
import request from "supertest";
import app from "./app";

test("that /pets calls the getPets function", async () => {
    const mockPets = [
        { name: "Fido", species: "dog" },
        { name: "Milo", species: "cat" },
    ];
    const toArrayMock = jest.fn().mockResolvedValue(mockPets);
    const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
        toArray: toArrayMock
    }) as any);
    const response = await request(app).get("/pets");
    expect(response.status).toBe(200);
    expect(findMock).toHaveBeenCalledWith({});
});
```

De `spyOn` functie maakt een mock van de `find` functie van de `collection` module. We geven aan dat deze mock de `toArray` functie moet teruggeven met de waarde `mockPets`. We controleren dan of de `find` functie van de `collection` module aangeroepen is met de juiste parameters.

## Fetch

We gebruiken fetch om requests op externe services te doen. Omdat dit iets is dat je vaak wil mocken (om te vermijden dat netwerkstoringen testen doen falen, om te vermijden dat je API-limieten bereikt,...) is hier speciale ondersteuning voor.

We installeren eerst fetch-mock-jest (als development dependency).

De clientcode:

```typescript
interface Pokemon {
    name: string,
    url: string,
}

app.get("/pokemon", async (req: Request, res: Response) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2");
    const pokemon = (await response.json()).results as Pokemon[];
    res.render("pokemon", { names: pokemon.map(({name}) => name) });
});
```

De testcode:

```typescript
import fetchMock from 'fetch-mock-jest';

describe("pokemon", () => {
  it("Should display Pokemon names based on request result", async () => {
    const mockResponse = { results: [{ name: "squirtle" }, { name: "wartortle" }] };
    // deze is automatisch gepatcht na de import
    fetchMock.get("https://pokeapi.co/api/v2/pokemon?limit=2", mockResponse);
    const response = await request(Server.getServer()).get('/pokemon');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<li>');
    expect(response.text).toContain('squirtle');
    expect(response.text).toContain('wartortle');
  })
});
```

## Neveneffecten vermijden

Om te vermijden dat andere operaties die fs.readFile nodig hebben niet fout lopen, moeten we zorgen dat de mock enkel in deze testfunctie gebruikt wordt. Daarom voegen we in de testfile deze regel toe:

```typescript
afterEach(() => jest.clearAllMocks());
```

Als we dit buiten de describe-blokken doen, gebeurt dit na elke test.
