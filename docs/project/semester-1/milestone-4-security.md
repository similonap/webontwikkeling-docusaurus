# Milestone 4 - Security

Als laatste dien je ervoor te zorgen dat de web applicatie gebruikt kan worden door verschillende gebruikers. Je voegt een login pagina toe waarin gebruikers kunnen inloggen alvorens ze toegang krijgen tot hun expense tracker. Eens ingelogd krijgen ze enkel toegang tot de in-en uitgaven die onder hun persoonlijk user id zijn weggeschreven. 

Voeg de volgende functionaliteiten toe aan je web applicatie: 

- Voeg een login pagina toe aan de applicatie. De login pagina moet toegankelijk zijn voor iedereen. De login pagina moet een form bevatten met twee input velden: username en password. De login pagina moet ook een knop bevatten om het formulier te versturen.
- Zorg ervoor dat de gebruiker na het inloggen wordt doorgestuurd naar zijn persoonlijke expense tracker dat je in vorige milestones hebt gemaakt.
- Zorg ervoor dat de gebruiker niet bij de login pagina kan komen als hij al is ingelogd. Als de gebruiker al is ingelogd en hij gaat naar de login pagina, dan moet hij worden doorgestuurd naar zijn persoonlijke expense tracker.
- Zorg ervoor dat de gebruiker niet bij de expense tracker pagina kan komen als hij niet is ingelogd. Als de gebruiker niet is ingelogd en hij gaat naar de expense tracker, dan moet hij worden doorgestuurd naar de login pagina.
- Zorg ervoor dat de gebruiker zich ook kan uitloggen. Voeg een logout knop toe aan de expense tracker. Als de gebruiker op de logout knop klikt, dan moet hij worden uitgelogd en worden doorgestuurd naar de login pagina.
- Zorg ervoor dat een gebruiker ook kan registreren. Dit moet gewoon een eenvoudige pagina zijn met een form met twee input velden: username en password. Als de gebruiker het formulier invult, dan moet hij worden geregistreerd en worden doorgestuurd naar de login pagina. Kijk ook of de gebruikersnaam al bestaat in de database. Als de gebruikersnaam al bestaat, geef dan een foutmelding. Zorg ervoor dat het wachtwoord veilig wordt opgeslagen (hint bcrypt).

Zorg dat je applicatie wordt gehosted op een cloud provider naar keuze (bijvoorbeeld render) en dus je applicatie online is te bezoeken. Voeg de link toe aan je README.md bestand.

### Bonus

Implementeer de nodige logica om gebruikers melding te geven wanneer hun maandelijks budget dreigt overschreden te worden. 

- Bij registratie geef je de gebruiker de optie om de waarden mee te geven waarmee je de properties van het budget object kan invullen (monthlyLimit, notificationThreshold) en vraag je of hij al dan niet notificatie wil krijgen als zijn budget dreigt overschreden te worden.
- Wanneer de uitgaven van de gebruiker groter worden dan de opgegeven notificationThreshold breng je de gebruiker hier duidelijk van op de hoogte.
