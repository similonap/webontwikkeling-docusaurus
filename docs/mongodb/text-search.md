# Text Search

Tot nu toe hebben we enkel gezien hoe we exacte waarden kunnen gebruiken om te filteren. MongoDB heeft ook een text search functionaliteit die je kan gebruiken om tekstuele velden te doorzoeken. Dit kan je gebruiken om bijvoorbeeld een zoekfunctionaliteit te maken.

Stel dat we een collectie hebben met de naam `books` en we willen alle boeken vinden waarvan de titel het woord "MongoDB" bevat. 

```typescript
interface Book {
    _id: ObjectId;
    title: string;
    summary: string;
}
```

en

```typescript
const collection : Collection<Book> = client.db("library").collection<Book>("books");
```

Deze collection bevat de volgende boeken: 

```typescript
 const books: Book[] = [
    { title: "The Great Gatsby", summary: "A book about a rich guy" },
    { title: "MongoDB for Dummies", summary: "A book about a database" },
    { title: "The Catcher in the Rye", summary: "A book about a kid" },
    { title: "The Da Vinci Code", summary: "A book about a code" },
    { title: "The Hobbit", summary: "A book about a hobbit" },
    { title: "Star Wars: The novel", summary: "A book about a galaxy far far away" },
    { title: "Lief klein konijn", summary: "Een boek over een konijntje" }
]
```


## Reguliere expressies

Je kan reguliere expressies gebruiken om tekstuele velden te doorzoeken. Je kan een reguliere expressie meegeven aan de `find` methode om te filteren op een bepaald patroon. 

```typescript
const result = await collection.find({ title: /MongoDB/ }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` het woord "MongoDB" bevat.

Als je een case-insensitive zoekopdracht wil uitvoeren, dan kan je de `i` vlag toevoegen aan de reguliere expressie.

```typescript
const result = await collection.find({ title: /mongodb/i }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` het woord "MongoDB" bevat, ongeacht de case. 

Wil je nu zoeken op een bepaalde variabelen, dan kan je de reguliere expressie dynamisch maken.

```typescript
const search : string = "MongoDB";
const result : Book[] = await collection.find<Book>({ title: new RegExp(search, "i") }).toArray();
```

## Text search

### Index aanmaken

Je kan ook een text index aanmaken op een veld om te zoeken op tekst. Je kan een text index aanmaken door de `createIndex` methode aan te roepen met als argument een object met als key het veld dat je wil indexeren en als value `"text"`. 

```typescript
await collection.createIndex({ title: "text" });
```

Dit zal een text index aanmaken op het veld `title`. Je kan nu de `$text` operator gebruiken om te zoeken op tekst.

### Zoeken op een woord

```typescript
const result = await collection.find({ $text: { $search: "MongoDB" } }).toArray();
```

Over het algemeen is het aanmaken van een text index en text search efficiënter dan het gebruik van reguliere expressies. 

### Zoeken op meerdere woorden

```typescript
const result = await collection.find({ $text: { $search: "MongoDB database" } }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` de woorden "MongoDB" en "database" bevat.

### Enkelvoud en meervoud

Text search is zelfs zo krachtig dat het het onderscheid kan maken tussen enkelvoud en meervoud.

```typescript
const result = await collection.find({ $text: { $search: "dummy" } }).toArray();
```

zal ook het boek "MongoDB for Dummies" teruggeven want het bevat het woord "dummy" in het meervoud.

### Stopwoorden

Text search houdt ook rekening met stopwoorden. Dit zijn woorden die vaak voorkomen en geen betekenis hebben. Deze worden genegeerd in de zoekopdracht. 

```typescript
const result = await collection.find({ $text: { $search: "the" } }).toArray();
```

Dit geeft geen resultaten terug omdat "the" een stopwoord is.

### Zoeken op meerdere velden

Als je wil zoeken op meerdere velden, dan kan je een text index aanmaken op meerdere velden.

```typescript
await collection.createIndex({ title: "text", summary: "text" });
```

De kans bestaat dat je een foutmelding krijgt omdat er al een index bestaat op het title veld. Je kan dit oplossen door eerst de index te verwijderen.

```typescript
await collection.dropIndex("*")
```

Dit zal alle indexen verwijderen.

Je kan nu zoeken op meerdere velden.

```typescript
const result = await collection.find({ $text: { $search: "database" } }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` of `summary` het woord "database" bevat.

### Language optie

Je kan ook de `$language` optie meegeven aan de `$text` operator om de taal van de tekst te specificeren.

```typescript
const result = await collection.find({ $text: { $search: "konijnen", $language: "nl" } }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `title` of `summary` het woord "konijnen" bevat in het Nederlands. En ja, het boek "Lief klein konijn" zal teruggegeven worden.

Wil je volledig taal onafhankelijk zoeken dan moet je de index aanmaken met de `default_language` optie en deze op `none` zetten.

```typescript
await collection.createIndex({ title: "text", summary: "text" }, { default_language: "none" });
```

Dit is ook handig als je meerdere talen in je collectie hebt en je geen rekening wil houden met stopwoorden en dergelijke.