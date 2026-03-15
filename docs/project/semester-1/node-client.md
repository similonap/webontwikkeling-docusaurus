# Milestone 1 - Terminal App

Het doel van de eerste milestone is het opzetten van een database schema in JSON formaat en het creëren van een basic expense tracker die we in de console laten runnen.

## Database Schema

Creëer een JSON file dat een **Array of Objects** bevat (één object per gebruiker). Elk gebruikers object moet de volgende properties bevatten:

* **id**: Een uniek user ID.
* **name**: De gebruiker zijn volledige naam.
* **email**: Email address van de gebruiker.
* **expenses**: Een array met objecten die de uitgaven bevatten. Elk uitgave object moet de volgende properties bevatten:
  * **id**: Een unieke uitgave ID.
  * **description**: Een korte beschrijving van de uitgave.
  * **amount**: De kost van de uitgave.
  * **date**: De datum en tijdstip van uitgave.
  * **currency**: De currency (bv, "USD", "EUR").
  * **paymentMethod**: Een object met volgende properties:
    * **method**: Betaalmethode (bv. "Credit Card", "Bank Transfer", “Cash”, “PayPall”).
    * **cardDetails** (Indien credit card): Een object dat de kaart nummer (masked) en vervaldatum bevat.
    * **bankAccountNumber** (Indien bank transfer): De bankrekeningnummer (masked).
  * **isIncoming**: Een boolean die aanduidt of het een uitgave was (`true`) of een inkomst (`false`).
  * **category**: De categorie van de uitgave (bv. “food”, “drinks”, “huur”).
  * **tags**: Een array met strings die de uitgave verder beschrijven (bv. "pizza", "monthly").
  * **isPaid**: Een boolean die aanduid of de uitgave betaald is (`true`) of dit nog moet gebeuren (`false`).

Daarnaast moet elke gebruiker nog een **budget** object bevatten waarin de volgende informatie wordt opgeslagen:

* **monthlyLimit**: Het maandelijks budget (number) van de gebruiker.
* **notificationThreshold**: Een threshold proportie (waarde tussen 0 en 1) waarbij de gebruiker een notificatie wil ontvangen dat hij bijna zijn budget gaat overschrijden. (bv. 0.9 voor 90%).
* **isActive**: Een boolean die aangeeft of de budget notificatie actief is (`true`) of inactief (`false`).

## Interfaces

Maak een apart bestand aan waarin je de interfaces definieert voor de data die je hebt aangemaakt. Zorg ervoor dat alle interfaces zijn geexporteerd zodat je ze kan gebruiken in andere bestanden.

## Console App

Maak een console-applicatie om kosten toe te voegen of te bekijken. De gebruiker moet in eerste instantie gevraagd worden of zij kosten willen toevoegen of hun kosten willen bekijken.

**Kosten Toevoegen:** Sla elke toegevoegde uitgave op in het JSON-bestand. Je kunt gebruikmaken van het npm-package readline-sync om interactie met de console te hebben (vragen stellen).

**Kosten Bekijken:** geef de in- en uitgaven van de gebruiker weer.

### Inzenden

Zorg ervoor dat je alles pushed naar je repository en de link naar je repository inzendt via digitap. De deadline vind je op digitap.

## Voorbeeld

![Bekijk het voorbeeld](/assets/milestone-1.gif)
