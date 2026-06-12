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
