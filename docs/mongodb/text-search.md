# Text Search

Tot nu toe hebben we enkel gezien hoe we exacte waarden kunnen gebruiken om te filteren. MongoDB heeft ook een text search functionaliteit die je kan gebruiken om tekstuele velden te doorzoeken. Dit kan je gebruiken om bijvoorbeeld een zoekfunctionaliteit te maken.

Stel dat we een collectie hebben met de naam `books` en we willen alle boeken vinden waarvan de titel het woord "MongoDB" bevat. 

```typescript
interface Book &#123;
    _id: ObjectId;
    title: string;
    summary: string;
&#125;
```

en

```typescript
const collection : Collection&lt;Book> = client.db("library").collection&lt;Book>("books");
```

Deze collection bevat de volgende boeken: 

```typescript
 const books: Book[] = [
    &#123; title: "The Great Gatsby", summary: "A book about a rich guy" &#125;,
    &#123; title: "MongoDB for Dummies", summary: "A book about a database" &#125;,
    &#123; title: "The Catcher in the Rye", summary: "A book about a kid" &#125;,
    &#123; title: "The Da Vinci Code", summary: "A book about a code" &#125;,
    &#123; title: "The Hobbit", summary: "A book about a hobbit" &#125;,
    &#123; title: "Star Wars: The novel", summary: "A book about a galaxy far far away" &#125;,
    &#123; title: "Lief klein konijn", summary: "Een boek over een konijntje" &#125;
]
```


## Reguliere expressies

Je kan reguliere expressies gebruiken om tekstuele velden te doorzoeken. Je kan een reguliere expressie meegeven aan de `find` methode om te filteren op een bepaald patroon. 

```typescript
const result = await collection.find(&#123; title: /MongoDB/ &#125;).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` het woord "MongoDB" bevat.

Als je een case-insensitive zoekopdracht wil uitvoeren, dan kan je de `i` vlag toevoegen aan de reguliere expressie.

```typescript
const result = await collection.find(&#123; title: /mongodb/i &#125;).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` het woord "MongoDB" bevat, ongeacht de case. 

Wil je nu zoeken op een bepaalde variabelen, dan kan je de reguliere expressie dynamisch maken.

```typescript
const search : string = "MongoDB";
const result : Book[] = await collection.find&lt;Book>(&#123; title: new RegExp(search, "i") &#125;).toArray();
```

## Text search

### Index aanmaken

Je kan ook een text index aanmaken op een veld om te zoeken op tekst. Je kan een text index aanmaken door de `createIndex` methode aan te roepen met als argument een object met als key het veld dat je wil indexeren en als value `"text"`. 

```typescript
await collection.createIndex(&#123; title: "text" &#125;);
```

Dit zal een text index aanmaken op het veld `title`. Je kan nu de `$text` operator gebruiken om te zoeken op tekst.

### Zoeken op een woord

```typescript
const result = await collection.find(&#123; $text: &#123; $search: "MongoDB" &#125; &#125;).toArray();
```

Over het algemeen is het aanmaken van een text index en text search efficiënter dan het gebruik van reguliere expressies. 

### Zoeken op meerdere woorden

```typescript
const result = await collection.find(&#123; $text: &#123; $search: "MongoDB database" &#125; &#125;).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` de woorden "MongoDB" en "database" bevat.

### Enkelvoud en meervoud

Text search is zelfs zo krachtig dat het het onderscheid kan maken tussen enkelvoud en meervoud.

```typescript
const result = await collection.find(&#123; $text: &#123; $search: "dummy" &#125; &#125;).toArray();
```

zal ook het boek "MongoDB for Dummies" teruggeven want het bevat het woord "dummy" in het meervoud.

### Stopwoorden

Text search houdt ook rekening met stopwoorden. Dit zijn woorden die vaak voorkomen en geen betekenis hebben. Deze worden genegeerd in de zoekopdracht. 

```typescript
const result = await collection.find(&#123; $text: &#123; $search: "the" &#125; &#125;).toArray();
```

Dit geeft geen resultaten terug omdat "the" een stopwoord is.

### Zoeken op meerdere velden

Als je wil zoeken op meerdere velden, dan kan je een text index aanmaken op meerdere velden.

```typescript
await collection.createIndex(&#123; title: "text", summary: "text" &#125;);
```

De kans bestaat dat je een foutmelding krijgt omdat er al een index bestaat op het title veld. Je kan dit oplossen door eerst de index te verwijderen.

```typescript
await collection.dropIndex("*")
```

Dit zal alle indexen verwijderen.

Je kan nu zoeken op meerdere velden.

```typescript
const result = await collection.find(&#123; $text: &#123; $search: "database" &#125; &#125;).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` of `summary` het woord "database" bevat.

### Language optie

Je kan ook de `$language` optie meegeven aan de `$text` operator om de taal van de tekst te specificeren.

```typescript
const result = await collection.find(&#123; $text: &#123; $search: "konijnen", $language: "nl" &#125; &#125;).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` of `summary` het woord "konijnen" bevat in het Nederlands. En ja, het boek "Lief klein konijn" zal teruggegeven worden.

Wil je volledig taal onafhankelijk zoeken dan moet je de index aanmaken met de `default_language` optie en deze op `none` zetten.

```typescript
await collection.createIndex(&#123; title: "text", summary: "text" &#125;, &#123; default_language: "none" &#125;);
```

Dit is ook handig als je meerdere talen in je collectie hebt en je geen rekening wil houden met stopwoorden en dergelijke.