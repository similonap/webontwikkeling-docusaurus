# Slopify — Opdracht

In deze opdracht bouw je de **Slopify** muziekstreamingapp verder uit. Je start vanuit de map `slopify_starter` en zorgt ervoor dat de applicatie volledig functioneel wordt.

Werk uitsluitend in de map `slopify_starter`. Wijzig geen bestanden in de map `slopify`.

---

## Situatie

De starter bevat al:

- een werkende Express-server in `index.ts`
- een databestand `data.ts` met 22 nummers en helperfuncties. Hier moet niets aangepast worden.
- TypeScript-types in `types.ts`
- statische HTML-bestanden in `views/` (zonder dynamische data)
- een CSS-bestand in `public/css/style.css`

## Partials

- Zorg ervoor dat de bovenkant van de html (html tag tot en met de body tag) in een header partial geplaatst wordt en gebruik deze op de nodige plaatsen.
- Zorg ervoor dat de aside in een aside partial geplaatst wordt en gebruik deze in de `song` en `songs` ejs file.
- Zorg dervoor dat de onderkant van de html in een footer partial geplaatst wordt en gebruik deze op de nodige plaatsen.

## Songs overview (/songs)

- Zorg ervoor dat de query parameters `q`, `sortField` en `sortDirection` correct worden opgevraagd. Voorzie een default waarde als deze niet zijn opgegeven.
- Als `sortField` niet `owned`, `title` of `publish_date` is, geef dan een error bericht "Invalid sort field" terug met als status code 400.
- Als `sortDirection` niet `asc` of `desc` is, geef dan een error bericht "Invalid sort direction" terug met als status code 400.
- gebruik de `getSongs()` functie van de data module, om de songs op te vragen. Deze functie geeft een promise terug, dus hou hier rekening mee.
- gebruik de `getCurrentUser()` om de huidige gebruiker op te vragen. Deze functie geeft een promise terug, dus hou hier rekening mee. Hij geeft altijd dezelfde gebruikt terug.
- Geef al deze gegevens door aan de `ejs` template.
- Pas de ejs template aan zodat deze gebruik maakt van de `songs` array om de `song-card` elementen te tonen. Zorg dat alle hardcoded waarden zijn vervangen door de echte waarden van de `song`.

## Songs detail (/songs/:id)

- Lees de route parameter `id` uit
- Roep de `getSongById(id)` functie aan het `data.ts` bestand met de juiste id. Deze functie geeft een promise terug, dus hou hier rekening mee.
- Vraag de huidige gebruiker op aan de hand van de `getCurrentUser()` functie.
- Als er geen `song` met deze id gevonden is, toon de 404 pagina.
- Geef de `song` en de `currentUser` mee aan de ejs template.
- Pas de `song.ejs` template aan zodat deze de informatie uit de doorgegeven `song` gebruikt.

## Buy Song (/buy)

- Toon het aantal credits van de `currentUser` in de `aside` balk.
- Lees de `id` uit de body van de POST request
- Indien `id` een getal is, roep de `buySong` functie aan en redirect de gebruiker vervolgens terug naar de `/songs` pagina.
- Als je te weinig coins hebt om een song te kopen stuur je de gebruiker naar de `billing` page en toon je een foutmelding.
- Zorg ervoor dat de knop om te kopen enkel zichtbaar is als het `owned` veld van song op true staat. Anders toon je `<div class="badge-owned">Owned</div>`

## Billing Page (/billing)

- Haal de `amount` uit de body van de POST request
- Kijk na of de amount een getal is en groter is dan 0
- Gebruik de `addCredits` methode van de `data.ts` module om de credits toe te voegen.
- Indien er iets misloopt moet je een fout bericht tonen bovenaan de billing page.
- Indien het succesvol is moet er geredirect worden naar `/songs`
