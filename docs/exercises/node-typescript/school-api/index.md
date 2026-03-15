### School API

Maak een nieuw project aan met de naam `school-api`.

We gaan in deze oefening een API gebruiken die het mogelijk maakt om alle hogescholen en universiteiten op te vragen van een bepaald land. De API die we hiervoor gaan gebruiken is http://universities.hipolabs.com/search?country=Netherlands (vervang `Netherlands` door het land dat je wil opvragen).

De gebruiker krijgt eerst een keuze menu te zien met de landen waarvoor er data beschikbaar is. De landen mag je hardcoden in je applicatie. 

Vervolgens krijgt de gebruiker een lijst te zien van alle hogescholen en universiteiten van het gekozen land. Je mag zelf kiezen hoe je deze data toont aan de gebruiker.

Na het tonen van de data wordt de gebruiker gevraagd of hij nog een land wil opvragen. Als de gebruiker `ja` antwoordt, wordt de gebruiker opnieuw gevraagd om een land te kiezen. Als de gebruiker `nee` antwoordt, wordt de applicatie afgesloten.

#### Voorbeeldinteractie:

```plaintext
[1] France
[2] Netherlands
[3] United Kingdom
[4] Belgium
[5] luxembourg
[6] Ireland
[7] Spain
[8] Portugal
[0] CANCEL

Which country would you like to list its Colleges with high school education degrees? [1...8 / 0]: 2
Colleges in Netherlands:
University of Sint Eustatius School of Medicine
International University School of Medicine (IUSOM)
St.James's School of Medicine, Bonaire
University of the Netherlands Antilles, Curacao
Dutch Delta University
De Haagse Hogeschool
Erasmus University Rotterdam
Rotterdam School of Management
European Open University
Fontys University of Applied Sciences
Foundation University
Hanze University Groningen
Hogeschool voor de Kunsten Utrecht (HKU)
Hotelschool The Hague
...
```