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
esbuild scripts/index.ts --bundle --outfile=public/js/index.js --platform=browser
```

We geven hier aan dat we `scripts/index.ts` willen bundelen en het resultaat willen opslaan als `public/js/index.js`. De `--platform=browser`-vlag zorgt ervoor dat `esbuild` de code optimaliseert voor gebruik in de browser.

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

### QuerySelector

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

### QuerySelectorAll

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

Stel dat we een taken lijst hebben en we willen de mogelijkheid bieden om taken toe te voegen en te verwijderen. We zouden de initiële HTML kunnen hebben zoals:

```html title="views/todo.ejs"
<html>
  <body>
    <h1>Mijn Takenlijst</h1>
    <ul id="taskList">
      <li>Taak 1 <button class="deleteBtn">Verwijder</button></li>
      <li>Taak 2 <button class="deleteBtn">Verwijder</button></li>
    </ul>
    <input type="text" id="newTaskInput" placeholder="Nieuwe taak">
    <button id="addTaskBtn">Voeg taak toe</button>
    <script src="/js/index.js"></script>
  </body>
</html>
```

en dan in ons `index.ts` bestand:

```typescript title="scripts/index.ts"
window.addEventListener("load", () => {
    const taskList = document.querySelector<HTMLUListElement>("#taskList");
    const newTaskInput = document.querySelector<HTMLInputElement>("#newTaskInput");
    const addTaskBtn = document.querySelector<HTMLButtonElement>("#addTaskBtn");

    if (!taskList || !newTaskInput || !addTaskBtn) return;

    taskList.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("deleteBtn")) {
            const li = target.parentElement;
            if (li) li.remove();
        }
    });

    addTaskBtn.addEventListener("click", () => {
        const text = newTaskInput.value.trim();
        if (!text) return;

        const li = document.createElement("li");
        li.innerHTML = `${text} <button class="deleteBtn">Verwijder</button>`;
        taskList.appendChild(li);
        
        newTaskInput.value = "";
    });
});
```