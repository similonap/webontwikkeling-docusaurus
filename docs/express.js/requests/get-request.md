# GET Request

Wanneer een gebruiker naar het domein van onze website surft, stuurt zijn browser een `GET`-request naar de route `/` van onze applicatie.

Die kunnen we bijvoorbeeld zo afhandelen:

```typescript
app.get("/",(req,res)=>&#123;
    res.type("text/html")
    res.send("hello");
&#125;);
```

De gebruiker vraagt bijvoorbeeld naar `localhost:3030` en krijgt zo de tekst "hallo" te zien.

Wat als we de gebruiker wat meer controle willen geven over de request?

## **GET requests**

`GET`-requests zijn de "default". Express-applicaties bevatten vaak calls van de vorm `app.get` en deze dienen dus om aan te geven hoe een `GET`-request moet worden afgehandeld. Met andere woorden: wat moet gebeuren wanneer de gebruiker naar een bepaalde pagina surft. Om meer data mee te geven kunnen we gebruik maken van query strings, bijvoorbeeld:

```typescript
https://www.google.be/search?q=ap&client=safari
```

Dit is een `GET` request naar Google. De domeinnaam is `google.be`. Het pad is `/search`. Alles achter `?` is de query string: `q=ap&client=safari`

De query string bepaalt de velden en waarden die we naar de server willen sturen. In dit geval sturen we q met de waarde "ap" (de zoekterm) en client met de waarde "safari" (de gebruike web browser).

### **Query**

Om de waarden in een query string te raadplegen, maken we gebruik de property `query` van het request object.

:::info
Het request object is de eerste parameter in de callback functie van `app.get`. Dit object bevat informatie van de request die de gebruiker/browser stuurt.
:::

Veronderstel dat we een array met namen hebben. We willen een naam opzoeken door een index mee te geven.

```typescript
let people = ["Sven","Andie","George","Geoff"];

app.get("/person",(req,res)=>&#123;
    res.type("text/html")
    // TypeScript kan niet garanderen dat deze parameter een geldige waarde heeft gekregen
    // de if staat ons toe binnen dat block te veronderstellen dat string het type is
    if (typeof req.query.index === "string") &#123;
      let index = parseInt(req.query.index);
      res.send(people[index]);
    &#125;
    else &#123;
      res.send("Ongeldige parameterwaarde.");
    &#125;
&#125;);
```

`req` is het Request object. De property `query` bevat alle query velden die meegestuurd worden.

:::info
Probeer zelf eens een lijst van query velden toe te voegen aan de URL en print de inhoud van `req.query` naar de console.
:::

:::danger
Let op welke characters je gebruikt in een query string. Je kan bv. geen spaties gebruiken. Wil je in jouw client applicatie een random string meegeven als waarde, gebruik dan [URI Encode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) om deze om te zetten in een geldige string!
:::

#### Use case - Zoeken

Zoals al vermeld hebben gebruikt Google de query string om zoektermen mee te geven. We kunnen dit ook doen in onze eigen applicatie. Stel dat we een zoekfunctie willen maken die de gebruiker toelaat om een naam op te zoeken in een array van namen. We kunnen dit doen met een formulier in ons ejs bestand:

```html
&lt;form action="/" method="get">
    &lt;label for="search">Search for a name:&lt;/label>
    &lt;input type="text" id="search" name="q" value="&lt;%= q %>">
    &lt;button type="submit">Search&lt;/button>
&lt;/form>
&lt;% for (let person of persons) &#123; %>
    <p>&lt;%= person.name %> (&lt;%= person.age %>)</p>
&lt;% &#125; %> 
```

We gebruiken hier de query string `q` om de zoekterm mee te geven. De gebruiker kan een zoekterm invullen in het input veld en op de knop drukken. De browser zal een `GET` request sturen naar `/search?q=zoekterm`. We kunnen dit request afhandelen in onze Express applicatie:

```typescript
interface Person &#123;
    name: string;
    age: number;
&#125;

const persons: Person[] = [
    &#123; name: "Sven", age: 25 &#125;,
    &#123; name: "Andie", age: 24 &#125;,
    &#123; name: "George", age: 30 &#125;,
    &#123; name: "Zeoff", age: 28 &#125;,
    ...
]

app.get("/", (req, res) => &#123;
    let q : string = typeof req.query.q === "string" ? req.query.q : "";
    let filteredPersons: Person[] = persons.filter((person) => &#123;
        return person.name.toLowerCase().startsWith(q.toLowerCase());
    &#125;);
    res.render("index", &#123;
        persons: filteredPersons,
        q: q
    &#125;);
&#125;);
```

We gebruiken hier de `filter` methode van een array om enkel de namen te tonen die beginnen met de zoekterm. We zetten de zoekterm en de gefilterde namen in een object en sturen dit naar de view.

Het is belangrijk om de zoekterm te normaliseren. We willen niet dat de zoekterm "Sven" niet gevonden wordt omdat de gebruiker "sven" heeft ingegeven. Daarom zetten we de zoekterm en de namen om naar kleine letters met de `toLowerCase` methode. Let hier op dat we zoeken op de beginletters van de namen. Als je wil zoeken op een deel van de naam, kan je de `includes` methode gebruiken.

Merk op dat we de `q` variabele ook meegeven aan de view. Zo kunnen we de zoekterm tonen in het input veld en blijft deze behouden wanneer de pagina herladen wordt.

#### Use case - Sorteren

Sorteren is een andere use case waarbij we de query string kunnen gebruiken. De opzet is iets complexer dan de zoekfunctie, maar het principe blijft hetzelfde. We willen de gebruiker toelaten om de namen te sorteren op basis van een bepaald veld.

Het eerste wat we gaan doen is twee query parameters kiezen voor de sorteerfunctie: `sortField` en `sortDirection`. De gebruiker kan een veld kiezen om op te sorteren en een richting. We halen deze als volgt op:

```typescript
const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
```

We kijken hier of de query parameters bestaan. Als ze bestaan, gebruiken we de waarde. Als ze niet bestaan, gebruiken we een default waarde. We gebruiken de `sort` methode van een array om de namen te sorteren. De richting van de sortering bepalen we door de return waarde van de sorteerfunctie om te keren. Als de richting "asc" is, sorteren we de namen in oplopende volgorde. Als de richting "desc" is, sorteren we de namen in aflopende volgorde.

```typescript
let sortedPersons = [...persons].sort((a, b) => &#123;
    if (sortField === "name") &#123;
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    &#125; else if (sortField === "age") &#123;
        return sortDirection === "asc" ? a.age - b.age : b.age - a.age;
    &#125; else &#123;
        return 0;
    &#125;
&#125;);
```

We geven nu deze gesorteerde namen mee aan de view:

```typescript
res.render("index", &#123;
    persons: sortedPersons
&#125;);
```

Dan kunnen we nu de gesorteerde namen tonen in de view. We voorzien ook al een formulier om de gebruiker toe te laten om de namen te sorteren:

```html
&lt;form action="/" method="get">
    &lt;select name="sortField">
        &lt;option value="name">Name&lt;/option>
        &lt;option value="age">Age&lt;/option>
    &lt;/select>
    &lt;select name="sortDirection">
        &lt;option value="asc">Ascending&lt;/option>
        &lt;option value="desc">Descending&lt;/option>
    &lt;/select>
    &lt;button type="submit">Sort&lt;/button>
&lt;/form>
&lt;% for (let person of persons) &#123; %>
    <p>&lt;%= person.name %> (&lt;%= person.age %>)</p>
&lt;% &#125; %>
```

Als we de sorteerrichting willen bijhouden in de view, kunnen we dit doen door de `selected` property van de optie te gebruiken.

```html
&lt;form action="/" method="get">
    &lt;select name="sortField">
        &lt;option value="name" &lt;%= sortField === "name" ? "selected" : "" %>>Name&lt;/option>
        &lt;option value="age" &lt;%= sortField === "age" ? "selected" : "" %>>Age&lt;/option>
    &lt;/select>
    &lt;select name="sortDirection">
        &lt;option value="asc" &lt;%= sortDirection === "asc" ? "selected" : "" %>>Ascending&lt;/option>
        &lt;option value="desc" &lt;%= sortDirection === "desc" ? "selected" : "" %>>Descending&lt;/option>
    &lt;/select>
    &lt;button type="submit">Sort&lt;/button>
&lt;/form>
```

We moeten dan wel de `sortField` en `sortDirection` variabelen meegeven aan de view:

```typescript
res.render("index", &#123;
    persons: sortedPersons,
    sortField: sortField,
    sortDirection: sortDirection
&#125;);
```

Bij veel velden kan het handig zijn om de opties voor de select elementen te genereren in de route. Dit kan je doen door een array van objecten te maken en deze door te geven aan de view:

```typescript
const sortFields = [
    &#123; value: "name", text: "Name", selected: sortField === "name" ? "selected" : "" &#125;,
    &#123; value: "age", text: "Age", selected: sortField === "age" ? "selected" : ""&#125;
];

const sortDirections = [
    &#123; value: "asc", text: "Asc", selected: sortDirection === "asc" ? "selected" : ""&#125;,
    &#123; value: "desc", text: "Desc", selected: sortDirection === "desc" ? "selected" : ""&#125;
];
```

en kan je deze doorgeven aan de view:

```typescript
res.render("index", &#123;
    persons: sortedPersons,
    sortFields: sortFields,
    sortDirections: sortDirections
&#125;);
```

In onze ejs kunnen we dan de select elementen genereren:

```html
&lt;form action="/" method="get">
    &lt;select name="sortField">
        &lt;% for (let field of sortFields) &#123; %>
            &lt;option value="&lt;%= field.value %>" &lt;%= field.selected %>>&lt;%= field.text %>&lt;/option> 
        &lt;% &#125; %>
    &lt;/select>
    &lt;select name="sortDirection">
        &lt;% for (let direction of sortDirections) &#123; %>
            &lt;option value="&lt;%= direction.value %>" &lt;%= direction.selected %>>&lt;%= direction.text %>&lt;/option> 
        &lt;% &#125; %>
    &lt;/select>
    &lt;button type="submit">Sort&lt;/button>
&lt;/form>
&lt;% for (let person of persons) &#123; %>
    <p>&lt;%= person.name %> (&lt;%= person.age %>)</p>
&lt;% &#125; %>
```

### **Route Parameters**

In plaats van query strings te gebruiken, kunnen we ook gestructureerde routes maken die parameters integreren in het pad zelf. Route parameters laten ons toe parameters te definiëren in onze route. Bijvoorbeeld:

```typescript
let people = ["Sven","Andie","George","Geoff"];
app.get("/person/:index",(req,res)=>&#123;
    let index = parseInt(req.params.index);
    res.type("text/html")
    res.send(people[index]);
&#125;)
```

Parameters van een route starten met `:`. De gebruiker moet een waarde achter `/person/` plaatsen om de route aan te spreken.

Door `:index` bepaal je de naam van de property die de waarde van de parameter zal bevatten. Deze naam kan je dan gebruiken om de property terug te vinden in het object `params` van het request object.

Je kan ook meerdere parameters meegeven:

```typescript
let people = ["Sven","Andie","George","Geoff"];
app.get("/person/:index/replace/:newname",(req,res)=>&#123;
    let index = parseInt(req.params.index);
    let oldName = people[index];
    people[index] = req.params.newname;
    res.type("text/html")
    res.send(`Old name was $&#123;oldName&#125;, new name is $&#123;people[index]&#125;`);
&#125;)
```
