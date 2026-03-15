# Find

## findOne

Net zoals we een select kunnen doen op een relationele database, gebruiken we find and findOne om onze objecten terug op te roepen.

findOne geeft ons 1 element terug, nl. het eerste element dat matcht met de query:

```typescript
let result: Pokemon = await client.db("Les").collection("pokemon").findOne&lt;Pokemon>(&#123;&#125;);
console.log(result);
```

Merk op dat we als parameter &#123;&#125; meegeven. Dit komt overeen met een lege "where" clause in relationele database termen. Wanneer we bepaalde velden willen matchen, moeten we een object meegeven. Dit object bevat properties. Deze properties komen overeen met de namen van de properties van het object waar je naar zoekt:

```typescript
let result: Pokemon = await client.db("Les").collection("pokemon").findOne&lt;Pokemon>(&#123;name:"eevee"&#125;);
console.log(result);
```

Pokemon objecten hebben de property name. Hierboven zoeken we dus alle Pokemon met "name" gelijk aan "eevee".

Je kan ook een ObjectId gebruiken om te zoeken naar een specifiek object:

```typescript
let result: Pokemon = await client.db("Les").collection("pokemon").findOne&lt;Pokemon>(&#123;_id: new ObjectId("5f3b3b3b3b3b3b3b3b3b3b3b")&#125;);
console.log(result);
```
Je moet hier uiteraard ook de ObjectId importeren:

```typescript
import &#123; MongoClient, ObjectId &#125; from "mongodb";
```

:::info

## find

Wanneer we meerdere objecten willen ophalen, gebruiken we find:

```typescript
let cursor =  client.db("Les").collection("pokemon").find&lt;Pokemon>(&#123;&#125;);
let result = await cursor.toArray();
console.log(result);
```

:::info
Let op: find geeft niet direct een resultaat terug, maar een cursor. Je kan dit cursor object gebruiken om de resultaten op te halen, door bv. toArray() te gebruiken (deze geeft een promise terug!).
:::

Als we dit allemaal bij elkaar zetten, krijgen we volgende code:

```typescript
import &#123; MongoClient, ObjectId &#125; from "mongodb";

const uri = "mongodb+srv://&lt;username>:&lt;password>@&lt;your-cluster-url>/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

interface Pokemon &#123;
    _id?: ObjectId,
    name: string,
    age: number
&#125;

async function main() &#123;
    try &#123;
        // Connect to the MongoDB cluster
        await client.connect();
 
        let pikachu: Pokemon = &#123; name:"pikachu", age:12 &#125;;
        const result = await client.db("Les").collection("pokemon").insertOne(pikachu);
        console.log(`New document created with the following id: $&#123;result.insertedId&#125;`);

        let cursor =  client.db("Les").collection("pokemon").find&lt;Pokemon>(&#123;&#125;);
        let pokemons = await cursor.toArray();
        console.log(pokemons);
    &#125; catch (e) &#123;
        console.error(e);
    &#125; finally &#123;
        await client.close();
    &#125;
&#125;
```
