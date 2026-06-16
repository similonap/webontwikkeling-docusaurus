# Client Side JavaScript

Tot nu toe lag de focus in deze cursus op TypeScript aan de serverkant: alle code in de routes werd op de server uitgevoerd. Dat geldt ook voor de code in EJS-templates. Dit kan verwarrend lijken, omdat die code verweven is met HTML en je daardoor zou verwachten dat ze in de browser draait. In werkelijkheid is het gewoon server-side code die HTML genereert. Express en EJS zijn dus eigenlijk niets meer dan hulpmiddelen om HTML op te bouwen: de client ontvangt enkel het eindresultaat (pure HTML) en heeft er geen weet van dat daar TypeScript-code achter zit.

In de praktijk zul je vaak ook JavaScript-code hebben die in de browser draait, bijvoorbeeld om interactieve elementen toe te voegen of om data op te halen van de server zonder de pagina te herladen. In dit hoofdstuk gaan we kijken hoe je dat aanpakt in een Express-applicatie. We zullen een eenvoudige client-side JavaScript-bestand maken en dat integreren in onze EJS-templates.

## Server-side vs. client-side: wie doet wat?

Voor we client-side JavaScript schrijven, moet glashelder zijn welk stuk code **wáár** wordt uitgevoerd. Neem deze eenvoudige Express-applicatie:

```typescript title="server.ts"
app.get("/hello", (req, res) => {
    const name = req.query.name;
    res.render("hello", { name: name });
});
```

```html title="views/hello.ejs"
<html>
  <body>
    <h1><%= name %></h1>
    <button onclick="alert('Hallo!')">
      Klik mij
    </button>
  </body>
</html>
```

Wat gebeurt er precies wanneer iemand naar `http://localhost:3000/hello?name=Joske` surft?

1. **Client (browser):** de browser verstuurt een HTTP GET-request naar de server. Er is nog geen enkele regel van onze code uitgevoerd.
2. **Server:** Express matcht het pad `/hello` met de route en voert de handler uit. `req.query.name` bevat `"Joske"`.
3. **Server:** `res.render("hello", { name: name })` geeft de data door aan de EJS-template. EJS vervangt `<%= name %>` door `Joske` en bouwt zo pure HTML op. De `<button>` met `onclick` is voor de server gewoon tekst — er wordt niets mee gedaan.
4. **Client (browser):** de browser ontvangt de kant-en-klare HTML en rendert de pagina. In de broncode zie je enkel `<h1>Joske</h1>` — geen spoor van EJS of TypeScript.
5. **Client (browser):** klikt de gebruiker op de knop, dan voert de **browser** de `alert('Hallo!')` uit. Daar komt geen netwerkverkeer aan te pas: de server merkt er zelfs niets van.

De `onclick="alert('Hallo!')"` is dus ons allereerste stukje client-side JavaScript: code die de server enkel als tekst doorstuurt, maar die pas in de browser tot leven komt.

### Probeer het zelf

Volg hieronder stap voor stap hoe de request door elke laag reist. Let bij elke stap op de badge: gebeurt dit op de **client**, op de **server**, of onderweg op het **netwerk**? Klik op het einde zeker zelf op de knop in de browser.

import InteractiveClientServer from '@site/src/components/InteractiveClientServer';

<InteractiveClientServer />

Experimenteer gerust: verander de naam in de adresbalk (bv. `/hello?name=Pol`), laat de `name`-parameter weg, of bezoek een pad dat niet bestaat.

:::info Onthoud
De server doet maar één ding: HTML-tekst opbouwen en opsturen. Zodra die HTML afgeleverd is, is de server klaar. Alles wat daarna op de pagina gebeurt — een klik, een `alert()`, een animatie — is client-side JavaScript dat volledig in de browser draait.
:::

## Client side TypeScript in de browser

Nu we weten dat client-side JavaScript in de browser draait, kunnen we ook client-side TypeScript schrijven. Dat is eigenlijk niet anders dan server-side TypeScript, behalve dat je het moet compileren naar JavaScript voordat het in de browser kan worden gebruikt. Een browser kan namelijk geen TypeScript uitvoeren, maar alleen JavaScript. We zouden hier kunnen kiezen om gewoon terug te vallen op JavaScript, maar dat zou zonde zijn van alle voordelen die TypeScript biedt. Gelukkig zijn er tools zoals `esbuild` die het compileren van TypeScript naar JavaScript heel eenvoudig maken. We zullen een eenvoudige client-side TypeScript-bestand maken, dat een bericht in de console logt wanneer de pagina geladen is. Daarna integreren we dat bestand in onze EJS-template.

Normaal gezien plaatsen we onze client-side JavaScript-bestanden in een `public`-folder, zodat Express ze als statische bestanden kan serveren, maar zoals we al gezegd hebben kan een browser geen TypeScript uitvoeren dus is het ook niet wenselijk om TypeScript-bestanden in de `public`-folder te plaatsen. In plaats daarvan kunnen we een aparte folder maken, bijvoorbeeld `scripts`, waarin we onze TypeScript-bestanden plaatsen. 

We zullen beginnen met een eenvoudig `index.ts`-bestand in de `scripts`-folder:

```typescript title="scripts/index.ts"
window.addEventListener("load", () => {
    console.log("De pagina is geladen! (client-side TypeScript)");
});
```

Als je deze code in de browser wilt laten werken, moet je deze eerst compileren naar JavaScript. We kunnen `esbuild` gebruiken om dit te doen. 

```bash
npx esbuild scripts/index.ts --bundle --outfile=public/js/index.js --platform=browser
```

We geven hier aan dat we `scripts/index.ts` willen bundelen en het resultaat willen opslaan als `public/js/index.js`. De `--platform=browser`-vlag zorgt ervoor dat `esbuild` de code optimaliseert voor gebruik in de browser.

We kunnen ook de hele `scripts`-folder bundelen door `scripts/*` te gebruiken in plaats van `scripts/index.ts`. Dit is handig als we meerdere TypeScript-bestanden hebben die we willen bundelen.

```bash
npx esbuild scripts/* --bundle --outdir=public/js --platform=browser
```

Zodra we het JavaScript-bestand hebben, kunnen we het integreren in onze EJS-template. We voegen een `<script>`-tag toe die verwijst naar ons gecompileerde JavaScript-bestand:

```html title="views/hello.ejs"
<html>
  <body>
    <h1><%= name %></h1>
    <button onclick="alert('Hallo! (client-side JavaScript)')">
      Klik mij
    </button>
    <script src="/js/index.js"></script>
  </body>
</html>
```

met de volgende route in `index.ts`:

```typescript title="index.ts"
app.get("/hello", (req, res) => {
    const name = req.query.name;
    console.log(`Hallo! (server-side TypeScript)`);
    res.render("hello", { name: name });
});
```

Nu, wanneer je de pagina laadt, zal de browser het `index.js`-bestand laden en uitvoeren. Je zou in de console van de browser de boodschap "De pagina is geladen! (client-side TypeScript)" moeten zien verschijnen.

## Package.json scripts

Om het compileren van TypeScript naar JavaScript gemakkelijker te maken, kunnen we een script toevoegen aan onze `package.json`-file. Dit maakt het mogelijk om gewoon `npm run build:client` te typen in plaats van de volledige `esbuild`-opdracht telkens te moeten intypen. 

```json title="package.json"
{
  "scripts": {
    "test": "jest",
    "build:client": "esbuild scripts/* --minify --bundle --outdir=public/js --platform=browser",
    "start": "npm run build:client && nodemon index.ts",
    "dev": "concurrently \"npm run start\" \"npm run build:client -- --watch\""
  },
}
```

Vergeet niet om `esbuild` en `concurrently` toe te voegen aan je `devDependencies` als je deze nog niet hebt geïnstalleerd.

```bash
npm install --save-dev esbuild
```

Als je nu `npm run dev` uitvoert, zal het script automatisch zowel de server starten als je client-side TypeScript-bestanden bundelen en opnieuw bundelen telkens je een wijziging aanbrengt.

## DOM manipulaties in TypeScript

### Wat is de DOM?

Met client-side TypeScript kunnen we ook de DOM (Document Object Model) manipuleren, wat betekent dat we elementen op de pagina kunnen wijzigen, toevoegen of verwijderen. Het Document Object Model is de representatie van de HTML pagina in het werkgeheugen van de browser.

Programmeurs gebruiken de DOM om een web pagina te veranderen zonder dat deze opnieuw ingeladen moet worden. We kunnen bijvoorbeeld :

- Tekst veranderen
- Kleuren aanpassen
- Een afbeelding laten verdwijnen en verschijnen

De DOM kan je tekenen als een boomstructuur.

Neem bijvoorbeeld volgende HTML pagina:

import InteractiveDOMTree from '@site/src/components/InteractiveDOMTree';

<InteractiveDOMTree />

### querySelector

De server side TypeScript code in Express kan na het versturen van de HTML pagina geen invloed meer hebben op de DOM, maar client-side TypeScript kan dat wel. We kunnen bijvoorbeeld een knop toevoegen die, wanneer erop geklikt wordt, de tekst van een paragraaf verandert. 

We gebruiken hiervoor de `querySelector`-methode om elementen in de DOM te selecteren en vervolgens hun eigenschappen aan te passen.

```typescript title="scripts/index.ts"
window.addEventListener("load", () => {
    const changeTextBtn = document.querySelector<HTMLButtonElement>("#changeTextBtn");
    const nameHeader = document.querySelector<HTMLHeadingElement>("#nameHeader");

    if (!changeTextBtn || !nameHeader) {
        console.error("Runtime error: DOM-elementen niet gevonden!");
        return;
    }

    changeTextBtn.addEventListener("click", () => {
        if (nameHeader) {
            nameHeader.textContent = "De tekst is veranderd!";
        }
    });
});
```

En in onze EJS-template:

```html title="views/hello.ejs"
<html>
  <body>
    <h1 id="nameHeader"><%= name %></h1>
    <button id="changeTextBtn">Verander de header</button>
    <script src="/js/index.js"></script>
  </body>
</html>
``` 

Je merkt op dat we bij de `querySelector`-aanroepen de juiste types hebben opgegeven (`HTMLButtonElement` en `HTMLHeadingElement`). Dit is een van de voordelen van TypeScript: we krijgen type-informatie over de DOM-elementen, wat ons helpt om fouten te voorkomen en betere autocompletion te krijgen in onze editor. We kijken hier ook of de elementen daadwerkelijk gevonden zijn voordat we proberen ze te gebruiken, wat een goede praktijk is bij het werken met de DOM. Wanneer je nu op de knop klikt, zal de tekst van de header veranderen naar "De tekst is veranderd!" zonder dat de pagina opnieuw hoeft te laden. 

### querySelectorAll

Je kan ook meerdere elementen tegelijk selecteren met `querySelectorAll`. Stel dat we meerdere paragrafen hebben en we willen ze allemaal van kleur veranderen wanneer we op een knop klikken:

```typescript title="scripts/index.ts"
window.addEventListener("load", () => {
    const changeColorBtn = document.querySelector<HTMLButtonElement>("#changeColorBtn");
    const paragraphs = document.querySelectorAll<HTMLParagraphElement>("p");

    if (!changeColorBtn) {
        console.error("Runtime error: Knop niet gevonden!");
        return;
    }

    changeColorBtn.addEventListener("click", () => {
        for (const paragraph of paragraphs) {
            paragraph.style.color = "red";
        }
    });
});
```

met de volgende HTML:

```html title="views/hello.ejs"
<html>
  <body>
    <h1 id="nameHeader"><%= name %></h1>
    <p>Paragraaf 1</p>
    <p>Paragraaf 2</p>
    <p>Paragraaf 3</p>
    <button id="changeColorBtn">Verander de kleur van de paragrafen</button>
    <script src="/js/index.js"></script>
  </body>
</html>
```

Wanneer je nu op de knop klikt, zullen alle paragrafen rood worden. We gebruiken hier `querySelectorAll` om een NodeList van alle paragrafen te krijgen, en vervolgens gebruiken we `for` om door die lijst te itereren en de stijl van elke paragraaf aan te passen.

### Selectors

De `querySelector` en `querySelectorAll` methoden gebruiken CSS-selectors om elementen te selecteren. Dat betekent dat je dezelfde syntax kunt gebruiken als in CSS om elementen te targeten. Hier zijn enkele voorbeelden van selectors die je kunt gebruiken:
- `#id`: selecteert een element met een specifiek ID. Bijvoorbeeld: `#nameHeader` selecteert het element met `id="nameHeader"`.
- `.class`: selecteert alle elementen met een specifieke klasse. Bijvoorbeeld: `.paragraph` selecteert alle elementen met `class="paragraph"`.
- `tag`: selecteert alle elementen van een bepaald type. Bijvoorbeeld: `p` selecteert alle `<p>`-elementen.
- `parent child`: selecteert alle `child`-elementen die een directe of indirecte afstamming zijn van `parent`. Bijvoorbeeld: `div p` selecteert alle `<p>`-elementen die zich binnen een `<div>` bevinden.
- `parent > child`: selecteert alle `child`-elementen die directe kinderen zijn van `parent`. Bijvoorbeeld: `div > p` selecteert alle `<p>`-elementen die directe kinderen zijn van een `<div>`.    

Met deze selectors kun je heel gericht elementen in de DOM selecteren en manipuleren met client-side TypeScript. Het is een krachtig hulpmiddel om interactieve webpagina's te maken die reageren op gebruikersacties zonder dat de pagina opnieuw hoeft te laden.

### Properties van DOM-elementen aanpassen

Van zodra je een DOM-element hebt geselecteerd, kun je verschillende eigenschappen ervan aanpassen. Hier zijn enkele veelgebruikte eigenschappen die je kunt wijzigen:
- `innerText`: hiermee kun je de zichtbare tekst van een element veranderen. Bijvoorbeeld: `element.innerText = "Nieuwe tekst";` zal de tekst binnen het element vervangen door "Nieuwe tekst".
- `innerHTML`: hiermee kun je de HTML-inhoud van een element veranderen. Bijvoorbeeld: `element.innerHTML = "<strong>Belangrijk!</strong>";` zal de inhoud van het element vervangen door een vetgedrukte tekst "Belangrijk!".
- `style`: hiermee kun je de CSS-stijlen van een element aanpassen. Bijvoorbeeld: `element.style.color = "blue";` zal de tekstkleur van het element blauw maken. 
- `classList`: hiermee kun je klassen toevoegen, verwijderen of toggelen op een element. Bijvoorbeeld: `element.classList.add("active");` zal de klasse "active" toevoegen aan het element. Je hebt ook `remove` en `toggle` methoden beschikbaar om klassen te verwijderen of te toggelen.

### DOM Elementen toevoegen en verwijderen

Je kan ook nieuwe elementen aan de DOM toevoegen of bestaande elementen verwijderen. Om een nieuw element toe te voegen, kun je `document.createElement` gebruiken om een nieuw DOM-element te maken, en vervolgens `appendChild` om het toe te voegen aan een bestaand element. Bijvoorbeeld:

```html
<html>
  <body>
    <ul id="list"></ul>

    <button id="addBtn">Add</button>
    <button id="removeBtn">Remove</button>

    <script src="/js/hello.js"></script>
  </body>
</html>
```

```typescript title="scripts/index.ts"
window.addEventListener("load", () => {
    const list = document.querySelector<HTMLDivElement>("#list");
    const addBtn = document.querySelector<HTMLButtonElement>("#addBtn");
    const removeBtn = document.querySelector<HTMLButtonElement>("#removeBtn");

    if (!list || !addBtn || !removeBtn) {
        console.error("Runtime error: DOM-elementen niet gevonden!");
        return;
    }

    addBtn.addEventListener("click", () => {
        const newElement = document.createElement("li");
        newElement.innerText = "Element";
        list.appendChild(newElement);
    });

    removeBtn.addEventListener("click", () => {
        if (list.lastChild) {
            list.removeChild(list.lastChild);
        }
    });
});
```

## Voorbeelden

### Form validatie

Een veelvoorkomend gebruik van client-side JavaScript is het valideren van formulieren voordat ze naar de server worden gestuurd. De meeste eenvoudige validatie kan via HTML voorkomen worden, zoals het gebruik van `required` of `type="email"`, maar soms wil je meer geavanceerde validatie uitvoeren, zoals het controleren van wachtwoordsterkte of het vergelijken van twee velden. In dat geval kan client-side TypeScript je helpen om deze validatie uit te voeren voordat het formulier wordt verzonden.

```html title="views/register.ejs"
<html>
  <head>
    <link rel="stylesheet" href="/css/style.css" />
  </head>
  <body>
    <div class="registration-container">
      <form id="registrationForm" action="/register" method="POST">
        <h2>Create Account</h2>
        <div id="error" class="error-message"></div>

        <div class="form-group">
          <input type="text" id="username" placeholder="Username" required />
        </div>

        <div class="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
          />
          <div id="passwordStrength" class="strength-meter"></div>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  </body>
</html>
```

met de volgende route in `index.ts`:

```typescript title="index.ts"
app.post("/register", (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.status(400).send("Passwords do not match!");
        return;
    }

    // Hier zou je normaal gezien de gebruiker aanmaken in de database
    res.send("User registered successfully!");
});
```

Dit zou uiteraard werken, maar het is niet ideaal om de gebruiker pas na het verzenden van het formulier te vertellen dat de wachtwoorden niet overeenkomen. Het is beter om deze validatie al op de client uit te voeren, zodat de gebruiker meteen feedback krijgt zonder dat er een netwerkverzoek nodig is. We kunnen dit doen met client-side TypeScript:

```html title="views/register.ejs"
    <script src="/js/register.js"></script>
```

```typescript title="scripts/register.ts"
window.addEventListener("load", () => {
    const form = document.querySelector<HTMLFormElement>("#registrationForm");
    const errorDiv = document.querySelector<HTMLDivElement>("#error");
    const passwordInput = document.querySelector<HTMLInputElement>("#password");
    const confirmPasswordInput = document.querySelector<HTMLInputElement>("#confirmPassword");
    const strengthBar = document.querySelector<HTMLDivElement>("#passwordStrength");

    if (!form || !passwordInput || !confirmPasswordInput || !strengthBar || !errorDiv) {
        console.error("Runtime error: DOM-elementen niet gevonden!");
        return;
    }

    passwordInput.addEventListener("input", (event) => {
       const value = passwordInput.value;

        const criteria = [
            value.length >= 8,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /\d/.test(value),
            /[!@#$%^&*(),.?":{}|<>]/.test(value)
        ];
        
        const score = criteria.filter(Boolean).length;
        
        const width = (score / 5) * 100;
        strengthBar.style.width = value.length > 0 ? `${width}%` : "0%";
        
        const colors = ["#ff4d4d", "#ff4d4d", "#ffa500", "#ffa500", "#2ecc71", "#2ecc71"];
        strengthBar.style.backgroundColor = colors[score];
    })

    form.addEventListener("submit", (event) => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault();
            if (errorDiv) {
                errorDiv.innerText = "Passwords do not match!";
            }
        }
    });
});
```

Nog interessanter is dat we dit voorbeeld ook kunnen uitbreiden met een live username check. We kunnen een API-route maken die controleert of een gebruikersnaam al in gebruik is, en deze route aanroepen vanuit onze client-side TypeScript telkens de gebruiker iets intypt in het username veld. Op die manier kunnen we de gebruiker meteen feedback geven over de beschikbaarheid van de gekozen gebruikersnaam.

```typescript title="index.ts"
const existingUsernames : string[] = ["Alice", "Bob", "Charlie"];

app.get("/api/check-username", (req, res) => {
    const username = req.query.username as string;
    const isAvailable = !existingUsernames.includes(username);
    res.json({ available: isAvailable });
});
```

```typescript title="scripts/register.ts"
    const usernameInput = document.querySelector<HTMLInputElement>("#username");

    if (!usernameInput) {
        console.error("Runtime error: Username input niet gevonden!");
        return;
    }

    usernameInput.addEventListener("input", async () => {
        const username = usernameInput.value;
        if (username.length === 0) {
            return;
        }

        try {
            const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
            const data = await response.json();
            if (!data.available) {
                errorDiv.innerText = "Username is already taken!";
            } else {
                errorDiv.innerText = "";
            }
        } catch (error) {
            console.error("Error checking username availability:", error);
        }
    });
```

Door het gebruik van `esbuild` worden ook automatisch alle imports in `register.ts` meegenomen in de bundel, dus we hoeven ons geen zorgen te maken over het handmatig toevoegen van extra `<script>`-tags voor eventuele dependencies die we gebruiken in onze client-side TypeScript-code. We kunnen hier zelf een extra dependency toevoegen, bijvoorbeeld `debounce`, om te voorkomen dat we te veel netwerkverzoeken sturen terwijl de gebruiker aan het typen is:

```bash
npm install debounce
```

```typescript title="scripts/register.ts"
import debounce from "debounce";

const checkUsernameAvailability = debounce(async (username: string) => {
    if (username.length === 0) {
        errorDiv.innerText = "";
        return;
    }

    try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        if (!data.available) {
            errorDiv.innerText = "Username is already taken!";
        } else {
            errorDiv.innerText = "";
        }
    } catch (error) {
        console.error("Error checking username availability:", error);
    }
}, 300);

usernameInput.addEventListener("input", () => {
    checkUsernameAvailability(usernameInput.value);
});
```

### Zoeken

Een ander veelvoorkomend gebruik van client-side JavaScript is het implementeren van een zoekfunctie die resultaten toont terwijl de gebruiker typt. Zo krijg je een veel snellere en soepelere gebruikerservaring, omdat je niet hoeft te wachten op een netwerkverzoek telkens de gebruiker iets intypt. We kunnen dit doen door een API-route te maken die zoekt in een lijst van items, en deze route aan te roepen vanuit onze client-side TypeScript telkens de gebruiker iets intypt in het zoekveld.

```typescript title="index.ts"
const items : string[] = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"];

app.get("/api/search", (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
    const results = items.filter(item => item.toLowerCase().includes(query));
    res.json({ results });
});

app.get("/search", (req, res) => {
    res.render("search", { items });
});
```

```html title="views/search.ejs"
<html>
  <head>
    <link rel="stylesheet" href="/css/style.css" />
  </head>
  <body>
    <div class="search-container">
      <h2>Search Items</h2>
      <input type="text" id="searchInput" placeholder="Type to search..." />
      <ul id="resultsList">
        <% for (const item of items) { %>
          <li><%= item %></li>
        <% } %>
      </ul>
    </div>
    <script src="/js/search.js"></script>
  </body>
</html>
```

```typescript title="scripts/search.ts"
window.addEventListener("load", () => {
    const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
    const resultsList = document.querySelector<HTMLUListElement>("#resultsList");

    if (!searchInput || !resultsList) {
        console.error("Runtime error: DOM-elementen niet gevonden!");
        return;
    }

    searchInput.addEventListener("input", async () => {
        const query = searchInput.value;
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            resultsList.innerHTML = "";
            for (const item of data.results) {
                const li = document.createElement("li");
                li.textContent = item;
                resultsList.appendChild(li);
            }
        } catch (error) {
            console.error("Error performing search:", error);
        }
    });
});
```

Je merkt op dat we hier een combinatie van client-side TypeScript en server-side Express gebruiken om een interactieve zoekfunctie te creëren. De server biedt een API-route die zoekt in een lijst van items, en de client-side TypeScript roept deze route aan telkens de gebruiker iets intypt, en toont de resultaten direct op de pagina. Dit is een veelgebruikte patroon in moderne webapplicaties om een snelle en responsieve gebruikerservaring te bieden.
