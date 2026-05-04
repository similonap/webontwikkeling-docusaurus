### Unix timestamp API

Maak een nieuw project aan met de naam `unix-timestamp-api`.

We willen een programma maken dat een unix timestamp omzet naar een leesbaar tijdsformaat. We zullen hiervoor gebruik maken van een REST API. Je kan de API aanroepen door een GET request te sturen naar `https://helloacm.com/api/unix-timestamp-converter/?cached&s=`, gevolgd door de unix timestamp. De API zal een eenvoudige string terugsturen met daarin de omgezette tijd.

Je kan de API aanroepen met de fetch functie. Probeer deze opgave op te lossen met behulp van de `async` en `await` keywords. Let er wel op dat je de code in een `async` functie moet plaatsen. 

#### Voorbeeldinteractie:

```plaintext
Geef een unix timestamp in aub vb.: 1549892280 : 1549892280 
De unix timestamp 1549892280 omgezet naar ons tijdsformaat is gelijk aan 2019-02-11 13:38:00
```