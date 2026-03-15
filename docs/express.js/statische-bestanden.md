# Statische Bestanden

Express laat ons toe statische bestanden te serveren. Dit zijn bestanden die niet veranderen. Denk aan CSS, JavaScript, afbeeldingen, etc.

Wil je dit doen, dan moet je een folder aanmaken waarin je deze bestanden plaatst. Deze folder noemen we meestal `public`. In deze folder plaatsen we dan onze statische bestanden.

Het enige wat we dan nog moeten doen is Express vertellen dat deze folder statische bestanden bevat. Dit doen we met de `use` methode.

```typescript
app.use(express.static("public"));
```

Alle bestanden in de public folder kunnen nu worden opgevraagd. Als je een bestand `style.css` in de public folder plaatst, kan je dit bestand opvragen via `http://localhost:3000/style.css`.

Vaak plaats je de bestanden niet in de public folder zelf, maar in subfolders. Dit kan er als volgt uit zien:

```
|- public
    |- css
        |- reset.css
        |- some-style.css
        |- other-style.css
        |- style.css
    |- js
        |- some-script.js
        |- other-script.js
        |- script.js
    |- assets
        |- images
            |- image-01.jpg
            |- image-02.jpg
            |- image-03.jpg
            |- image-04.jpg
        |- fonts
            |- cool-font.woff
            |- other-font.woff
        |- icons
            |- logo.png
            |- logo_small.png
            |- favicon.ico
```

Wil je nu een afbeelding opvragen, dan kan je dit doen via `http://localhost:3000/assets/images/image-01.jpg`. Wil je een script opvragen, dan kan je dit doen via `http://localhost:3000/js/script.js`.
