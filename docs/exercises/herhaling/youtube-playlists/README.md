### Youtube Favorites

In deze opdracht ga je een applicatie bouwen die het toelaat om youtube videos aan te duiden als favoriet. De applicatie zal een lijst van favoriete videos tonen en het zal mogelijk zijn om videos toe te voegen en te verwijderen.

Als de applicatie opstart zal een json van youtube videos ingeladen worden. Deze json moet worden ingelezen via de fetch api op het volgende adres: `https://raw.githubusercontent.com/similonap/json/master/videos.json`. Vervolgens moeten deze videos in een mongodb database worden opgeslagen. Bij het opstarten worden ook twee users toegevoegd aan de database met een username en password. Het passwoord moet gehashed worden met bcrypt. Als er al data in de database zit, mag deze data niet overschreven worden. Voorzie een environment variable in een dotenv bestand CLEAR_DB_ON_RESTART. Als deze op true staat mag de database wel overschreven worden.

De applicatie moet een login pagina hebben waar de gebruiker kan inloggen. Als de gebruiker niet ingelogd is, mag hij niet naar de hoofdpagina gaan. Als de gebruiker niet ingelogd is, moet hij naar de login pagina worden gestuurd. Als de gebruiker inlogt, moet hij naar de hoofdpagina worden gestuurd. De gebruiker moet ook kunnen uitloggen. Als de gebruiker verkeerde gegevens ingeeft, moet er een foutmelding getoond worden (gebruik flash messages in de session).

De hoofdpagina toont een lijst van de youtube videos die in de database zitten. Naast de velden van de video moet er een knop zijn om de video als favoriet aan te duiden. Als de video al als favoriet is aangeduid, moet de knop de video als niet favoriet aanduiden. 

Bovenaan de pagina staat een zoekbalk waarmee je op de titel van het lied kunt zoeken. Als je op de titel van het lied zoekt, moet je enkel de videos tonen die de zoekterm in de titel hebben. Als je niets invult in de zoekbalk, moet je alle videos tonen. Voorzie ook database sorting op alle velden. Je kan deze oplopend of aflopend sorteren.

Voorzie ook een manier om nieuwe videos toe te voegen. Er moet geen server side validation gebeuren. Als de video correct is toegevoegd, moet de gebruiker terug naar de hoofdpagina worden gestuurd.

![youtube-demo](youtubevideos.gif)


