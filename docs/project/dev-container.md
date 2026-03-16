# Voorbereiding (devcontainer + github)

[https://www.youtube.com/watch?v=-xPt-sTAkQY](https://www.youtube.com/watch?v=-xPt-sTAkQY)

## Github opzetten

:::info
Je kan deze workflow ook gebruiken voor andere projecten die node.js. Uiteraard moet je dan wel zelf je eigen repository aanmaken op github.
:::

1. Maak een nieuwe repository aan op Github aan de hand van de [Github Classroom link](https://classroom.github.com/a/C0wNnb8s).&#x20;
2. Clone de repository in een container volume. (ctrl-shift-p -> `Remote-Containers: Clone Repository in Container Volume...`)&#x20;
3. Kies `main` als branch
4. Als er gevraagd wordt achter de container template: Kies `Node JS & Typescript`
5. Als er gevraagd wordt welke versie van Node JS je wil gebruiken: Kies `20-bullseye`
6. Als er gevraagd wordt welke extra features je wil installeren: Kies dan `ts-node`
7. Vervolgens zal de devcontainer worden opgestart en kan je beginnen met het project. Kijk zeker na dat je een bestand kan pushen naar de repository.

Je kan nakijken of alles correct is ingesteld door het bestand `.devcontainer/devcontainer.json` te openen. Hierin zou je volgende code moeten zien:

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node
{
	"name": "Node.js & TypeScript",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye",
	"features": {
		"ghcr.io/devcontainers-contrib/features/ts-node:1": {}
	}

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	// "postCreateCommand": "yarn install",

	// Configure tool-specific properties.
	// "customizations": {},

	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	// "remoteUser": "root"
}
```

