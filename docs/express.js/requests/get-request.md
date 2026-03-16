# GET Request

Wanneer een gebruiker naar het domein van onze website surft, stuurt zijn browser een `GET`-request naar de route `/` van onze applicatie.

Die kunnen we bijvoorbeeld zo afhandelen:

```typescript
app.get("/",(req,res)=>{
    res.type("text/html")
    res.send("hello");
});
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

app.get("/person",(req,res)=>{
    res.type("text/html")
    // TypeScript kan niet garanderen dat deze parameter een geldige waarde heeft gekregen
    // de if staat ons toe binnen dat block te veronderstellen dat string het type is
    if (typeof req.query.index === "string") {
      let index = parseInt(req.query.index);
      res.send(people[index]);
    }
    else {
      res.send("Ongeldige parameterwaarde.");
    }
});
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
<form action="/" method="get">
    <label for="search">Search for a name:</label>
    <input type="text" id="search" name="q" value="<%= q %>">
    <button type="submit">Search</button>
</form>
<% for (let person of persons) { %>
    <p><%= person.name %> (<%= person.age %>)</p>
<% } %> 
```

We gebruiken hier de query string `q` om de zoekterm mee te geven. De gebruiker kan een zoekterm invullen in het input veld en op de knop drukken. De browser zal een `GET` request sturen naar `/search?q=zoekterm`. We kunnen dit request afhandelen in onze Express applicatie:

```typescript
interface Person {
    name: string;
    age: number;
}

const persons: Person[] = [
    { name: "Sven", age: 25 },
    { name: "Andie", age: 24 },
    { name: "George", age: 30 },
    { name: "Zeoff", age: 28 },
    ...
]

app.get("/", (req, res) => {
    let q : string = typeof req.query.q === "string" ? req.query.q : "";
    let filteredPersons: Person[] = persons.filter((person) => {
        return person.name.toLowerCase().startsWith(q.toLowerCase());
    });
    res.render("index", {
        persons: filteredPersons,
        q: q
    });
});
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
let sortedPersons = [...persons].sort((a, b) => {
    if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortField === "age") {
        return sortDirection === "asc" ? a.age - b.age : b.age - a.age;
    } else {
        return 0;
    }
});
```

We geven nu deze gesorteerde namen mee aan de view:

```typescript
res.render("index", {
    persons: sortedPersons
});
```

Dan kunnen we nu de gesorteerde namen tonen in de view. We voorzien ook al een formulier om de gebruiker toe te laten om de namen te sorteren:

```html
<form action="/" method="get">
    <select name="sortField">
        <option value="name">Name</option>
        <option value="age">Age</option>
    </select>
    <select name="sortDirection">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
    </select>
    <button type="submit">Sort</button>
</form>
<% for (let person of persons) { %>
    <p><%= person.name %> (<%= person.age %>)</p>
<% } %>
```

Als we de sorteerrichting willen bijhouden in de view, kunnen we dit doen door de `selected` property van de optie te gebruiken.

```html
<form action="/" method="get">
    <select name="sortField">
        <option value="name" <%= sortField === "name" ? "selected" : "" %>>Name</option>
        <option value="age" <%= sortField === "age" ? "selected" : "" %>>Age</option>
    </select>
    <select name="sortDirection">
        <option value="asc" <%= sortDirection === "asc" ? "selected" : "" %>>Ascending</option>
        <option value="desc" <%= sortDirection === "desc" ? "selected" : "" %>>Descending</option>
    </select>
    <button type="submit">Sort</button>
</form>
```

We moeten dan wel de `sortField` en `sortDirection` variabelen meegeven aan de view:

```typescript
res.render("index", {
    persons: sortedPersons,
    sortField: sortField,
    sortDirection: sortDirection
});
```

Bij veel velden kan het handig zijn om de opties voor de select elementen te genereren in de route. Dit kan je doen door een array van objecten te maken en deze door te geven aan de view:

```typescript
const sortFields = [
    { value: "name", text: "Name", selected: sortField === "name" ? "selected" : "" },
    { value: "age", text: "Age", selected: sortField === "age" ? "selected" : ""}
];

const sortDirections = [
    { value: "asc", text: "Asc", selected: sortDirection === "asc" ? "selected" : ""},
    { value: "desc", text: "Desc", selected: sortDirection === "desc" ? "selected" : ""}
];
```

en kan je deze doorgeven aan de view:

```typescript
res.render("index", {
    persons: sortedPersons,
    sortFields: sortFields,
    sortDirections: sortDirections
});
```

In onze ejs kunnen we dan de select elementen genereren:

```html
<form action="/" method="get">
    <select name="sortField">
        <% for (let field of sortFields) { %>
            <option value="<%= field.value %>" <%= field.selected %>><%= field.text %></option> 
        <% } %>
    </select>
    <select name="sortDirection">
        <% for (let direction of sortDirections) { %>
            <option value="<%= direction.value %>" <%= direction.selected %>><%= direction.text %></option> 
        <% } %>
    </select>
    <button type="submit">Sort</button>
</form>
<% for (let person of persons) { %>
    <p><%= person.name %> (<%= person.age %>)</p>
<% } %>
```

### **Route Parameters**

In plaats van query strings te gebruiken, kunnen we ook gestructureerde routes maken die parameters integreren in het pad zelf. Route parameters laten ons toe parameters te definiëren in onze route. Bijvoorbeeld:

```typescript
let people = ["Sven","Andie","George","Geoff"];
app.get("/person/:index",(req,res)=>{
    let index = parseInt(req.params.index);
    res.type("text/html")
    res.send(people[index]);
})
```

Parameters van een route starten met `:`. De gebruiker moet een waarde achter `/person/` plaatsen om de route aan te spreken.

Door `:index` bepaal je de naam van de property die de waarde van de parameter zal bevatten. Deze naam kan je dan gebruiken om de property terug te vinden in het object `params` van het request object.

Je kan ook meerdere parameters meegeven:

```typescript
let people = ["Sven","Andie","George","Geoff"];
app.get("/person/:index/replace/:newname",(req,res)=>{
    let index = parseInt(req.params.index);
    let oldName = people[index];
    people[index] = req.params.newname;
    res.type("text/html")
    res.send(`Old name was ${oldName}, new name is ${people[index]}`);
})
```
