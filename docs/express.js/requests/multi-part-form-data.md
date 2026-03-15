# Multi-part form data

Soms bestaat een formulier niet enkel uit tekstvelden, maar ook uit bestanden. Denk maar aan een formulier waar je een foto kan uploaden. In dit geval is het niet mogelijk om de data van het formulier te versturen via een GET request. We moeten dan gebruik maken van een POST request. Ook moeten we aangeven dat het formulier een bestand bevat. Dit doen we door de `enctype` van het formulier aan te passen.

```html
&lt;form action="/upload" method="post" enctype="multipart/form-data">
    &lt;input type="file" name="avatar" />
    &lt;input type="submit" value="Upload" />
&lt;/form>
```

De `enctype` van het formulier is nu `multipart/form-data`. Dit betekent dat de data van het formulier in meerdere delen wordt opgesplitst. We kunnen jammer genoeg niet zomaar de data van het formulier via de `req.body` variabele ophalen. We moeten hiervoor een aparte module gebruiken. Deze module heet `multer`. Deze module zorgt ervoor dat we de data van het formulier kunnen ophalen via de `req.file` (voor 1 file) en `req.files` (voor meerdere files) variabele.

## Installatie

Vooraleer we met `multer` kunnen werken, moeten we deze eerst installeren. Dit doen we door het volgende commando in de terminal uit te voeren:

```bash
npm install multer
npm install --save-dev @types/multer
```

## Basis configuratie

Om `multer` te kunnen gebruiken, moeten we eerst een `multer` object aanmaken. Dit object bevat de configuratie van `multer`.\
De basisconfiguratie van `multer` ziet er als volgt uit:

```js
import multer from "multer";

const upload = multer(&#123;
    dest: "public/uploads",
&#125;);
```

De `dest` property van het `multer` object bevat de map waar de bestanden terecht komen. In dit geval is dit de map `uploads`. Als we dit niet opgeven, worden de bestanden in het geheugen opgeslagen en worden ze niet opgeslagen op de harde schijf.

By default, Multer zal de bestanden hernoemen zodat er geen conflicten ontstaan. Dus upload je twee keer een bestand met dezelfde naam, dan zal de tweede upload een andere naam krijgen.

## Uploaden van 1 bestand

Om een bestand te kunnen uploaden, moeten we de `upload.single()` functie gebruiken. Deze functie heeft 1 parameter nodig: de naam van het inputveld waar het bestand in staat. In ons voorbeeld is dit het inputveld met de naam `file`.

```html
&lt;form action="/upload" method="post" enctype="multipart/form-data">
    &lt;input type="file" name="avatar" />
    &lt;input type="submit" value="Upload" />
&lt;/form>
```

```typescript
import express from "express";
import ejs from "ejs";
import multer from "multer";
import path from "path";

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const upload = multer(&#123;
    dest: "public/uploads",
&#125;);

app.get("/", (req, res) => &#123;
    res.render("index")
&#125;);

app.post("/upload", upload.single("avatar"), (req, res) => &#123;
    let file = req.file as Express.Multer.File;
    if (file) &#123;
        res.type("text/html");
        res.send(`<img src="uploads/$&#123;file.filename&#125;"/>`);
    &#125; else &#123;
        res.send("No file uploaded");
    &#125;
&#125;);

app.listen(3000, () => &#123;
    console.log("Server started on port 3000");
&#125;);
```

Dit is een voorbeeld van een formulier waarbij we een bestand kunnen uploaden. Als we dit formulier invullen en verzenden, dan wordt het bestand opgeslagen in de map `uploads`. Omdat we aangegeven hebben dat de map `uploads` een statische map is, kunnen we het bestand oproepen via de url `http://localhost:3000/&lt;bestandsnaam>`. In ons voorbeeld is dit bv `http://localhost:3000/5f7b9b0e8b9c4a0b8c9d9e0f`.

## Uploaden van meerdere bestanden

Om meerdere bestanden te kunnen uploaden, moeten we de `upload.array()` functie gebruiken. Deze functie heeft 2 parameters nodig: de naam van het inputveld waar de bestanden in staan en het aantal bestanden dat geüpload mag worden. In ons voorbeeld is dit het inputveld met de naam `photos` en mogen er 5 bestanden geüpload worden.

```html
&lt;form action="/upload" method="post" enctype="multipart/form-data">
    &lt;input type="file" name="photos" multiple />
    &lt;input type="submit" value="Upload" />
&lt;/form>
```

nu kunnen we de bestanden ophalen via de `req.files` variabele

```typescript
app.post("/upload", upload.array("photos", 5), (req, res) => &#123;
    let files = req.files as Express.Multer.File[];
    if (files) &#123;
        res.type("text/html");
        res.send(files.map((file) => `<img src="$&#123;file.filename&#125;"/>`).join("<br/>"));
    &#125; else &#123;
        res.send("No files uploaded");
    &#125;
&#125;);
```

## Forms met meerdere file inputs

Als je een formulier hebt met meerdere file inputs, dan moet je de `upload.fields()` functie gebruiken. Deze functie heeft 1 parameter nodig: een array met objecten. Elk object bevat de naam van het inputveld en het aantal bestanden dat geüpload mag worden.

```html
&lt;form action="/upload" method="post" enctype="multipart/form-data">
    &lt;input type="file" name="avatar" />
    &lt;input type="file" name="gallery" multiple />
    &lt;input type="submit" value="Upload" />
&lt;/form>
```

```typescript
interface FilesDictionary &#123;
    [fieldname: string]: Express.Multer.File[];
&#125;

app.post(
    "/upload",
    upload.fields([
        &#123; name: "avatar", maxCount: 1 &#125;,
        &#123; name: "gallery", maxCount: 8 &#125;,
    ]),
    (req, res) => &#123;
        let files = req.files as FilesDictionary
        let avatar = files["avatar"][0];

        res.type("text/html");
        res.send(`<h1>Avatar</h1>
                  <img src="/$&#123;avatar.filename&#125;" /><br/>
                  <h1>Photos</h1>
                  $&#123;files["gallery"].map((file) => `<img src="/$&#123;file.filename&#125;" />`).join("")&#125;&#125;`);
    &#125;
);
```

De types van de `req.files` variabele zijn niet zo duidelijk. We kunnen de types van de `req.files` variabele dus beter zelf definiëren. Dit doen we door een interface aan te maken met de naam `FilesDictionary`. Deze interface bevat een index signature. Dit is een manier om een object te definiëren waarbij de keys van het object niet vooraf gekend zijn. In ons geval weten we niet hoeveel bestanden er geüpload worden. Daarom gebruiken we een index signature.

## Meer informatie

- Voor meer informatie over `multer`, kan je terecht op de volgende pagina: [http://expressjs.com/en/resources/middleware/multer.html](http://expressjs.com/en/resources/middleware/multer.html)
