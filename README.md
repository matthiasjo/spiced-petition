# spiced-petition

Spiced Academy: Petition Project

The goal of this project was to study Handlebars, Express and getting more familiar with Node.js while creating a petition website.
The topic "save the bees" was chosen randomly as a work in progress topic. This project has only a learning and demo purpose.
This project was also pushed to Heroku.

technologies/packages used: Handlebars, Node, Express, Postgres, Bulma, Heroku

### See this project live

```
user: demo
pass: demo
```

### Build and deploy

```
docker build -t beetition --no-cache . \
 && docker stack deploy -c docker-compose.yml beetitionStack
```

### Screenshots of the project

![Screenshot](/screenshots/scrn1.png?raw=true "Screenshot 1")

![Screenshot](/screenshots/scrn2.png?raw=true "Screenshot 2")
