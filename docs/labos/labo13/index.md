# 13. Mongo Basics

Theorie

Bekijk voor het labo aan te vangen eerst de volgende topics:

* [Wat is MongoDB?](../../mongodb/wat-is-mongodb.md)
* [MongoDB driver](../../mongodb/mongodb-driver.md)
* [Insert](../../mongodb/insert.md)
* [Find](../../mongodb/find.md)

## Labo voorbereidingen

### Cloud MongoDB (Atlas)

#### 1. Maak een account aan

Ga naar [https://cloud.mongodb.com/](https://cloud.mongodb.com/) en maak een account aan. Na het maken van een account log in via je nieuwe account. Maak vervolgens een nieuwe **Shared Cluster** (is volledig gratis) aan\*\*.\*\* Kies **AWS**, kies dan als regio: **eu-west-1** in ireland of **eu-central-1** in frankfurt en geef je cluster een naam. Klik vervolgens op **Create Cluster**

**Het aanmaken van je cluster kan tot 5 minuten duren! Hou hier rekening mee**

#### 2. Stel je security settings in

Ga terug naar het overzicht van de clusters en klik op **connect** en bij **Whitelist a connection IP address** kies je Add different ip address. Geef daar `0.0.0.0` in.

Als je dit niet vindt, ga links naar **Network Access** en voeg 0.0.0.0 toe als IP adres.

#### 3. Maak een MongoDB gebruiker aan

Vervolgens maak je een nieuwe MongoDB gebruiker aan in **Create a MongoDB User.** Zorg ervoor dat het paswoord kan gedeeld worden met ons zodat we ook toegang tot de database hebben.

Als je dit niet vindt, ga links naar **Database Access** en voeg een user toe.

#### 4. Haal jouw connection string op

Ga dan verder door op **Choose a connection method** (of connect) te klikken. Je kan hier twee connection strings vinden:

* Een voor de MongoDB extensie in vscode
* Een voor de MongoDB driver voor node js

Deze zijn iets verschillend van elkaar. Let op dat je hier uiteraard je eigen username en paswoord in geeft.

<figure><img src="/assets/mongoconnect.gif" alt="" /><figcaption></figcaption></figure>

#### 5. Verbinding uitproberen

Gebruik de connection string om via de extensie in vscode te verbinden met deze mongodb database.
