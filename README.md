# MMotors
MMotors est un concessionnaire automobile qui a décidé d'agrandir son offre en proposant des voitures en leasin en plus de son offre d'achat de voiture initial. Afin de suivre ce renouveau, ils ont décidé de remettre leur application web à neuf et d'offrir leurs service en ligne.
Projet développé dans le cadre  du projet Bachelor en développement Python

## Git
Git est un version controller qui permet de versioner tout projet informatique au fur et à mesure du développement de celui-ci. Cela permet de revenir en arrière en cas d'erreur critique sans prendre le risque de complètement perdre le projet.
##### J'ai crée 3 branches principales:
    - main --> la branche principale à partir de laquelle sera déployer l'application
    - pre-prod --> branche servant à déployer l'application sur un environnement similaire à la prod, permettant de controller d'éventuels incidents non prévues dû à cet environnement sans impacter la production.
    - dev --> branche servant à regrouper toutes les noouvelles fonctionnalitè^és au fur et à mesure de l'évolution du projet.

##### Puis à partir de la branche dev, une branche par fonctionnalités sera développé avant d'être à nouveau merge avec la branche dev:
    - feature/**
    -f eature/**
    - ...

Sous forme de “bullet points”, mettez en évidence votre démarche pour développer une user Story

## US 
- Liste fonctionalité
- EPIC (page d'acceuil) ou US(login) en fonction du volume de la tâche
- Fragmentation EPIC en US 
- Chaque US à 1 objectif décrit ainsi: En tant que .../ Je souhaite.../Afin de ... 
        --> Chaque US doit spécifier tout besoin nécessaire à son commencement (maquette)
        --> Chaque US possède des critères d'acceptation pour la definir comme done

- Une US doit correspondre à la Definition Of Ready (DoR) avant de rentrer dans un sprint
        --> la DoR est établie au début du projet

- Cycle sprint pour l'US, Do-Doing-Test
- Après la phase de Test
        --> Si correspond à la Définition Of Done (DoD), US done
        --> US déployer

- Nouvelle US, nouveau cycle

### Fonctionalités:
#### Gestion users:
- User --> 
        - consultation véhicule, 
        - création compte, 
        - login, 
        - Demande d'achat/leasing véhicule 
        - Upload documents
- Admin --> 
        - Gestion véhicule, 
        - gestion dossier client
        
##### Véhicules:
- CRUD véhicule --> Authorisation selon role
- Pagination véhicule
- Filtre véhicule

#### Stack Technique:
- Front End --> Angular 21 --> déployer sur Render
- Back End --> Rest API avec Fast Api --> déployer sur fly.io
- BDD -->
  - local --> sqlite
  - prod --> PostGressql --> fly.io
- Container --> Docker
- CI/CD --> github workflows + Sonarqube

## Test couverture
Test Coverage > 80% - Vitest
coverage --> npm run test:ci

|File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|-----------------------|---------|----------|---------|---------|-------------------|
|All files              |   94.68 |     87.3 |   86.36 |   94.46 |                   |
|app                    |   94.11 |    72.22 |     100 |     100 |                   |
|  app.ts               |   94.11 |    72.22 |     100 |     100 | 18-24             |
| app/_guards           |     100 |      100 |     100 |     100 |                   |
|  admin-guard-guard.ts |     100 |      100 |     100 |     100 |                   |
|  auth-guard-guard.ts  |     100 |      100 |     100 |     100 |                   |
| app/_services         |   94.11 |    82.75 |   86.84 |    92.3 |                   |
|  auth-service.ts      |     100 |    76.92 |     100 |     100 | 15-18             |
|  car-service.ts       |     100 |    83.87 |     100 |     100 | 17-24             |
|  dashboard-service.ts |   63.63 |    77.77 |      25 |      50 | 14-22             |
|  upload-service.ts    |      75 |      100 |       0 |      60 | 14-22             |
| app/auth/login        |     100 |    91.66 |     100 |     100 |                   |
|  login.ts             |     100 |    91.66 |     100 |     100 | 41                |
| app/auth/register     |     100 |    91.66 |     100 |     100 |                   |
|  register.ts          |     100 |    91.66 |     100 |     100 | 50                |
| app/pages/car-list    |    90.9 |      100 |      50 |   85.71 |                   |
|  car-list.ts          |    90.9 |      100 |      50 |   85.71 | 32                |
| app/pages/dashboard   |   85.71 |    81.25 |      50 |    87.5 |                   |
|  dashboard.ts         |   85.71 |    81.25 |      50 |    87.5 | 33                |
| app/pages/home-page   |     100 |      100 |     100 |     100 |                   |
|  home-page.ts         |     100 |      100 |     100 |     100 |                   |
| app/pages/item-page   |     100 |    91.66 |     100 |     100 |                   |
|  item-page.ts         |     100 |    91.66 |     100 |     100 | 18                |
| app/pages/login-page  |     100 |      100 |     100 |     100 |                   |
|  login-page.ts        |     100 |      100 |     100 |     100 |                   |
| app/pages/profile     |   88.88 |    77.77 |   85.71 |    90.9 |                   |
|  profile.ts           |   88.88 |    77.77 |   85.71 |    90.9 | 52-53             |
| app/parts/car-form    |     100 |       85 |     100 |     100 |                   |
|  car-form.ts          |     100 |       85 |     100 |     100 | 43-53             |
| app/parts/card        |     100 |     87.5 |     100 |     100 |                   |
|  card.ts              |     100 |     87.5 |     100 |     100 | 22-24             |
| app/parts/filter      |   71.42 |    91.66 |      50 |   66.66 |                   |
|  filter.ts            |   71.42 |    91.66 |      50 |   66.66 | 21,29-33          |
| app/parts/navbar      |     100 |      100 |     100 |     100 |                   |
|  navbar.ts            |     100 |      100 |     100 |     100 |                   |
| app/parts/pagination  |     100 |    91.66 |     100 |     100 |                   |
|  pagination.ts        |     100 |    91.66 |     100 |     100 | 14                |
|-----------------------|---------|----------|---------|---------|-------------------|



## Installation en Local

- Pour le Back end --> voir repo `https://github.com/k4y4Dev/MMotorsBack`

### Prérequis
- Node.js (>= v20.19.0)
- npm (>= 8.0)

### Récupération projet

- `mkdir mmotors-front`
- `cd mmotors-front`
- `git init`
- `git clone https://github.com/k4y4Dev/MMotorsFront.git`

### Installation projet
- `npm intall`
- Modifier le fichier environments/environments.ts selon l' url du Back end

### Lancement projet

- `ng serve`
- `http://localhost:4200/`




