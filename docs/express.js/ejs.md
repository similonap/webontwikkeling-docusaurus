# EJS

Dankzij Express kunnen we nu dynamisch HTML terugsturen naar de client. Bekijk eventjes dit voorbeeld:

```typescript
import express from "express";

const app = express();

app.set("port", 3000);

app.get("/",(req,res)=>{
    let randomGetal = Math.random()*100;
    res.type("text/html");
    res.send(`Het random getal is ${randomGetal}`);
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
```

Bezoek `http://localhost:3000` en merk op wat er gebeurt.

Bij elke refresh verandert de waarde van het random getal. Kijk naar de source code van deze pagina. Je ziet enkel een getal, geen scripts! Express stuurt een nieuwe inhoud van de pagina bij elke refresh! Laten we het voorbeeld even analyseren:

```typescript
let randomGetal = Math.random()*100;
```

Deze lijn geeft een willekeurig getal terug. We gebruiken Math.random dat een random getal geeft tussen 0 en 1 en vermenigvuldigen dat met 100.&#x20;

```typescript
res.send(`Het random getal is ${randomGetal}`);
```

In plaats van een vaste string, geven we nu het randomgetal mee. Elke refresh voert de callback in app.get uit, dus elke refresh zorgt voor een ander getal.

## Templates

Volledige web paginas in variabelen steken is niet ideaal. Wanneer je weet dat ook nog CSS en scripts erbij moeten, dan is het duidelijk dat we een andere oplossing nodig hebben. Express laat toe templates te gebruiken.

&#x20;We kunnen bv een Hello World pagina maken:

```markup
<html>
<body>
Hello world!
</body>
</html>
```

Maar wat als we nu een willekeurige boodschap willen tonen? &#x20;

```markup
<html>
<body>
[DIT MOET DYNAMISCH ZIJN]
</body>
</html>
```

Templates laten ons toe HTML paginas te schrijven zoals we dat gewoon zijn maar met variabele inhoud. Express ondersteunt verschillende template "engines". Hier gaan we gebruik maken van EJS.

## Ejs installeren

Om EJS (Embedded JavaScript templating) te gebruiken installeren we de ejs module:

```markup
npm install ejs
```

en we installeren ook de TypeScript types:

```
npm install --save-dev @types/ejs
```

We stellen onze express app in om EJS als default view engine te gebruiken:

```typescript
import express from "express";
import ejs from "ejs";

const app = express();

app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);
```

Net zoals we "port" de waarde 3000 geven, zetten we de property "view engine" op ejs.

## Ejs render

EJS bestanden lijken op HTML files maar bevatten wat extras. Laten we starten met een simpel EJS bestand.

```markup
<h1>Hello World!</h1>
This is yet another boring hello world app
```

Dit bestand bewaren we als **index.ejs** in de folder **/views**. Merk op, dit is HTML in een EJS bestand, niets speciaals.

:::danger
Alle EJS files moeten de extensie .ejs hebben.

Alle EJS files moeten in de _views_ folder staan (die zich in de folder van jouw applicatie bevindt)
:::

Nu passen we onze applicatie aan om de index.ejs te tonen (renderen: omzetten van EJS naar HTML):

```typescript
import express from "express";
const app = express();

app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);

app.get("/",(req,res)=>{
  res.render("index");
})

app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));
```

Merk op hoe eenvoudig onze route naar / is geworden:

```typescript
app.get("/",(req,res)=>{
    res.render("index");
})
```

Ipv `res.send` gebruiken we `res.render`. Render verwacht als parameter de naam van een template die zich in de views folder bevindt. Hier tonen we de index file. Ga naar localhost:3000/ om jouw EJS file als HTML te zien.

Je kan nu verschillende EJS files toevoegen. Render ze via verschillende routes en kijk hoe je nu volledige control hebt over routes en de html die getoond wordt.

## Dynamische Content

Templates helpen ons de HTML dynamisch te maken. Laten we ons voorbeeld aanpassen zodat we het willekeurig getal weer zien verschijnen. Eerst passen we onze TypeScript aan.

```typescript
app.get("/",(req,res)=>{
    let randomGetal : number = Math.random()*100;
    res.render("index", {aRandomNumber: randomGetal});
})
```

`res.render()` heeft ook een tweede optionele parameter: een object waar elke property een variabel is die beschikbaar zal zijn in de EJS file.

In dit voorbeeld heeft de tweede parameter maar 1 property: `aRandomNumber`. We geven dit de waarde van de variabele `randomGetal`. `aRandomNumber` zal dus bij elke refresh een willekeurig getal tussen 0 en 100 bevatten.

We kunnen ook meerdere properties meegeven:

```typescript
app.get("/",(req,res)=>{
    let randomGetal : number = Math.random()*100;
    let randomGetal2 : number = randomGetal * 2;
    res.render("index", 
        {    
            aRandomNumber: randomGetal,
            name: "Sven",
            age: 40,
            someOtherNumber: randomGetal2
        });
})
```

Express zal nu index tonen, maar geeft eerst deze lijst van properties mee. Deze properties zijn nu beschikbaar als variabelen in de EJS file!

Laten we de index.ejs file aanpassen:

```
<h1>Hello World!</h1>
<p>
    This is yet another boring hello world app.
</p>
<p>
    But this time we have a random 
    number which is <%= aRandomNumber %>
</p>
```

Wanneer je nu naar localhost:3000 gaat, zal je het random getal in de tekst zien staan.

## Variabelen tonen

Om een variabele te tonen die werd meegegeven in de render functie, gebruiken we volgende notatie:

```markup
<%= variable_name %>
```

Het is perfect mogelijk om ook properties van een object te tonen:

```markup
<%= person.name %>
```

Als je een array hebt, kan je ook een element tonen:

```markup
<%= people[0] %>
```

### JavaScript in EJS

EJS laat ons toe JavaScript te gebruiken om meer controle te hebben over de dynamische inhoud van het template. Tussen &lt;% %> kunnen we JavaScript plaatsen:

```markup
<% 
    let firstName = "John";
    let lastName = "Smith";
    let age = Math.random() * 100;
%>

<h1>Hi</h1>
<p>
    My name is <%= firstName %> <%= lastName %> 
    and I"m <%= age %> years old.
</p>
```

:::danger
In EJS bestanden kan je geen TypeScript types gebruiken. Let hier zeker op dat je enkel aan de controller kant TypeScript kan gebruiken.
:::

### If statements

Een if statement kan ook toegevoegd worden:

```markup
<% if (age > 50) { %>
    <p>Je bent oud</p>
<% } else { %>
    <p>Je bent jong</p>
<% } %>
```

Let hier op dat de if statement en het afsluiten van het `&#125;` teken tussen `&lt;% %>` moet staan.

### Loops

Er bestaat ook een mogelijkheid om een loop toe te voegen. We hebben al gezien dat we &lt;% %> gebruiken om JavaScript uit te voeren. Stel je voor dat 10 keer "Hallo" getoond moet worden. We kunnen dit doen met een for loop:

```markup
<% for(let i=1; i<10;i++) { %>
    <p>Hallo</p>
<% } %>
```

Het is belangrijk om te weten dat alle javascript code tussen `&lt;% %>` moet staan en dus ook de for statement en het afsluiten van het `&#125;` teken. 

Wil je de waarde van `i` tonen, dan moet je `&lt;%= i %>` gebruiken. 

```markup
<% for(let i=1; i<10;i++) { %>
    <p><%= i %></p>
<% } %>
```

### Voorbeeld lijst

Laten we een voorbeeld bekijken waar we een lijst van mensen tonen. We hebben een array van mensen en we willen de naam van elke persoon tonen.

```typescript
app.get("/",(req,res)=>{
    let people : string[] = ["Sven", "Andie", "Sam", "Barbara"];
    res.render("index", { people: people });
});
```

In de index.ejs file tonen we nu de lijst van mensen:

```markup
<h1>People</h1>
<ul>
    <% for(let person of people) { %>
        <li><%= people[i] %></li>
    <% } %>
</ul>
```

### Voorbeeld tabel

Laten we een voorbeeld bekijken waar we een tabel tonen. We hebben een array van mensen. Deze keer worden deze mensen voorgesteld als objecten. We willen de naam, stad en leeftijd van elke persoon tonen.

```typescript
interface Person {
    name: string;
    city: string;
    age: number;
}

app.get("/",(req,res)=>{
    let persons : Person[] = [
        {name: "Sven", city: "Antwerpen", age: 40},
        {name: "Andie", city: "Gent", age: 30},
        {name: "Sam", city: "Brussel", age: 25},
        {name: "Barbara", city: "Leuven", age: 35}
    ];
    res.render("index", { persons: persons });
});
```

In de index.ejs file tonen we nu de tabel van mensen:

```markup
<h1>People</h1>
<table>
    <tr>
        <th>Name</th>
        <th>City</th>
        <th>Age</th>
    </tr>
    <% for(let person of persons) { %>
        <tr>
            <td><%= person.name %></td>
            <td><%= person.city %></td>
            <td><%= person.age %></td>
        </tr>
    <% } %>
</table>
```

Het is ook mogelijk om een if statement toe te voegen. Stel dat we enkel personen willen tonen die ouder zijn dan 30:

```markup
<h1>People</h1>
<table>
    <tr>
        <th>Name</th>
        <th>City</th>
        <th>Age</th>
    </tr>
    <% for(let person of persons) { %>
        <% if (person.age > 30) { %>
            <tr>
                <td><%= person.name %></td>
                <td><%= person.city %></td>
                <td><%= person.age %></td>
            </tr>
        <% } %>
    <% } %>
</table>
```

## Include files

Je kan ook andere EJS files includen in een EJS file. Dit is handig wanneer je bv een header en footer hebt die je in elke pagina wil tonen. Stel je voor dat we de volgende pagina hebben:

```markup
<!DOCTYPE html>
<html>
<head>
    <title>My website</title>
</head>
<body>
    <header>
        <h1>My website</h1>
    </header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
    <main>
        <h1>Home</h1>
        <p>Welcome to my website</p>
    </main>
    <footer>
        <p>&copy; 2021</p>
    </footer>
</body>
</html>
```

In principe wil je op elke pagina dezelfde header en footer tonen. We kunnen de header en footer in aparte EJS files steken en deze includen in de index.ejs file. Deze EJS files bewaren we meestal in een directory genaamd partials in de view directory.

We maken dus een header.ejs file:

```markup
<!DOCTYPE html>
<html>
<head>
    <title>My website</title>
</head>
<body>
    <header>
        <h1>My website</h1>
    </header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
    <main>
```

En een footer.ejs file:

```markup
    </main>
    <footer>
        <p>&copy; 2021</p>
    </footer>
</body>
</html>
```

nu kunnen we in elke EJS file de header en footer includen:

```markup
<%- include("partials/header") %>
    <h1>Home</h1>
    <p>Welcome to my website</p>
<%- include("partials/footer") %>
```

Alle variabelen die doorgegeven worden met de render functie zijn ook beschikbaar in de included files.
