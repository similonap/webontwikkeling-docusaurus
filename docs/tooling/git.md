# Git

## Wat is versiebeheer?

Als je nog nooit met versiebeheer gewerkt hebt, kan het moeilijk zijn om je een goed beeld te vormen van hoe alle puzzelstukjes van Git in elkaar passen. Laat ons het dus eerst even hebben over wat Git precies is, voor we het leren gebruiken.

Git is een systeem voor versiebeheer, dat wil zeggen een systeem om oudere versies van je project op een ordelijke manier bij te houden. Als je geen oude versies bijhoudt, riskeer je belangrijke code te verliezen (bv. als je in een nieuwe versie een kritieke bug vindt die er in een oude versie niet was). Je kan klassieke backups maken door regelmatig al je code te zippen, maar voor je het weet, heb je enorm veel schijfruimte verbruikt of weet je niet meer in welk bestand de interessantste aanpassingen gebeurd zijn. Met een goed systeem voor versiebeheer gaat dat soort werk veel efficiënter.

Meestal bestaat dat project dat je met een versiebeheersysteem beheert uit code, maar dat hoeft niet. Je kan er vanalles mee bijhouden, van tekeningen in Illustrator tot recepten. Zelfs data in die je niet kan voorstellen als leesbare tekst is mogelijk, bijvoorbeeld audiobestanden, maar versiebeheersystemen komen het best tot hun recht als de data in een tekstformaat staat.

Je kan git versie beheer volledig lokaal doen, maar in de meeste gevallen zal je een remote repository gebruiken. Dat is een server waar je je code op plaatst, zodat je er vanop verschillende computers aan kan werken. Je kan je code dan ook delen met anderen, zodat zij er aan kunnen werken. Dat is handig als je met meerdere mensen aan een project werkt, maar ook als je je code wil delen met de wereld. Github is een van de bekendste websites waar je zo'n remote repository kan aanmaken.

## Installatie git op Windows

Ga naar de officiële Git-website git-scm.com en download de laatste versie van Git voor Windows. Dit bestand is een uitvoerbaar (.exe) bestand.

Volg de instructies van de installatie wizard. De standaardinstellingen zijn prima. Zorg er zeker voor dat je ook `Git Bash` installeert. Dit is een command line interface (CLI) die je toelaat om git commando's uit te voeren.

Nadat je de installatie hebt voltooid, kan je `git bash` openen door in het start menu te zoeken naar `git bash`. Je kan ook rechtsklikken in een map en kiezen voor `Git Bash Here`. Dit opent een command line interface in de map waarin je rechtsklikte. Dit is handig om git commando's uit te voeren in de juiste map.

## Git configureren

Git heeft een aantal instellingen die je kan aanpassen. Je kan dit doen via de command line interface. Open `git bash` en voer de volgende commando's uit:

```bash
git config --global user.name "Jouw Naam"
git config --global user.email "Jouw Email"
```

Vervang `Jouw Naam` en `Jouw Email` door je eigen naam en email adres. Deze gegevens worden gebruikt om je commits te identificeren. Je kan ook nog andere instellingen aanpassen, maar dat is niet nodig voor deze cursus.

## Git basis commando's

Git is een command line tool. Dat wil zeggen dat je het gebruikt door commando's in te typen in een command line interface. Het is op dit moment nog niet nodig om alle commando's te kennen. We zien hier enkel de basis commando's die je nodig hebt om te starten met deze cursus.

Let op dat de uitleg hier onder een sterk vereenvoudigde versie is van wat git kan. Git is een heel krachtige tool, maar dat maakt het ook complex. We gaan hier enkel de basis commando's zien die je nodig hebt om te starten met deze cursus. Als je meer wil weten over git, kan je altijd de officiële documentatie raadplegen of volg je de [git leerlijn](https://apwt.gitbook.io/leerlijn-git/) gitbook.

### Git add

Stel dat we een bestand `README.md` hebben aangepast, een bestand dat al in de git repository zit. Aanpassingen worden niet zomaar opgeslagen in git. Je moet ze eerst altijd toevoegen aan de staging area. De staging area in Git is een tussenstap tussen je lokale bestanden en de geschiedenis van je project (de repository). Om een bestand toe te voegen aan de staging area, gebruik je het commando `git add`. De naam van dit commando is een beetje verwarrend, want je voegt niet echt bestanden toe, maar je voegt ze toe aan de staging area. Dus je doet dit ook voor bestanden die al bestonden en in de repository zitten.

```bash
git add README.md
```

Zorg dan zeker en vast dat je in de juiste map zit. Je kan dit controleren met het commando `pwd`. Dit commando toont de huidige map waarin je zit.

Maak je een nieuw bestand aan dat je wil toevoegen aan de repository, dan moet je het ook eerst toevoegen aan de staging area. Dit doe je met hetzelfde commando.

```bash
git add nieuw_bestand.md
```

Heb je meerdere bestanden die je wil toevoegen, of meerdere wijzigingen in verschillende bestanden, dan kan je met 1 commando meerdere alle gewijzigde bestanden toevoegen aan de staging area.

```bash
git add -A
```

of 

```bash
git add .
```

als je alleen de bestanden in de huidige map wil toevoegen.

### Git status

Om te weten welke bestanden je hebt toegevoegd aan de staging area, kan je het commando `git status` gebruiken. Dit commando toont je de status van je repository. Het toont je welke bestanden je hebt toegevoegd aan de staging area, welke bestanden je hebt aangepast en welke bestanden je nog niet hebt toegevoegd.

```bash
git status
```

Dan krijg je iets zoals dit:

```bash
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
        new file:   nieuw_bestand.md
```

Dit wil zeggen dat je de bestanden `README.md` en `nieuw_bestand.md` hebt toegevoegd aan de staging area. Als je nu een commit maakt, dan zullen deze bestanden in de geschiedenis van je project terecht komen.

### Git commit

Als je klaar bent met het toevoegen van bestanden aan de staging area, dan kan je de wijzigingen committen. Dit wil zeggen dat je de wijzigingen definitief maakt en toevoegt aan de geschiedenis van je project. Je kan dit doen met het commando `git commit`. Dit commando heeft een aantal opties, maar de belangrijkste is `-m`. Hiermee kan je een boodschap meegeven aan je commit. Deze boodschap is verplicht. Het is een korte beschrijving van de wijzigingen die je hebt aangebracht. Het is belangrijk dat deze boodschap duidelijk is, zodat je later nog weet wat je hebt gedaan.

```bash
git commit -m "Eerste commit"
```

### Git push

Het is perfect mogelijk om git volledig lokaal te gebruiken, maar het is pas echt krachtig als je het combineert met een remote repository. Een remote repository is een server waar je je code op plaatst, zodat je er vanop verschillende computers aan kan werken. Je kan je code dan ook delen met anderen, zodat zij er aan kunnen werken. Dat is handig als je met meerdere mensen aan een project werkt, maar ook als je je code wil delen met de wereld. Github is een van de bekendste websites waar je zo'n remote repository kan aanmaken. Wij gaan in deze cursus gebruik maken van Github. Normaal gezien omdat we gebruik maken van devcontainers heeft jouw git repository al een remote repository en hoeven we hier niets meer voor te doen.

Om alle commits die je lokaal hebt gemaakt naar de remote repository te sturen, gebruik je het commando `git push`. 

```bash
git push
```

Dit commando stuurt alle commits die je lokaal hebt gemaakt naar de remote repository. Het is belangrijk dat je dit commando uitvoert, anders zullen je commits niet zichtbaar zijn voor anderen en ben je ze kwijt als er iets met je computer gebeurt.
