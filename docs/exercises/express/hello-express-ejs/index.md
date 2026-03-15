### Hello Express EJS

In deze oefening gaan we de `hello-express` applicatie uit het vorige labo uitbreiden met EJS. Neem de broncode over zodat je de vrijheid hebt om de code aan te passen zonder dat je de oorspronkelijke code verliest. De routes die json terugsturen gebruiken uiteraard nog steeds json en geen ejs.

* Plaats de image van jezelf in een public map. Zorg ervoor dat express deze map kan gebruiken om statische bestanden te serveren.
* Pas de / route aan zodat deze een ejs template gebruikt. Je hoeft hier niets door te geven aan de ejs template.
* Pas de /whoami route aan zodat deze een ejs template gebruikt. Geef het `thisisme` object door aan de ejs template.
* Pas de /pikachuhtml route aan zodat deze een ejs template gebruikt. Geef enkel de waarden door aan de ejs template die je toont in de html pagina. Je mag dus niet het hele pikachu object doorgeven aan de ejs template (tenzij je Pokemon object al alleen de waarden bevat die je nodig hebt).
* Maak nog 2 andere routes aan voor 2 andere pokemon. Je moet de ejs template van de pikachu route kunnen hergebruiken. bv: /bulbasaurhtml, /charmanderhtml
* Pas de /randomcolor route aan zodat deze een ejs template gebruikt. Geef de kleur door aan de ejs template.

De werking van de applicatie moet hetzelfde blijven. De ejs templates moeten in een aparte map views staan.