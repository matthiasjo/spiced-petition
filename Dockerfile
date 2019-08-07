FROM node:current-alpine
EXPOSE 8080

WORKDIR /opt/beeDocker

COPY package.json /opt/beeDocker/
COPY package-lock.json /opt/beeDocker/

ADD crontab /opt/beeDocker/crontab

RUN npm ci

COPY . /opt/beeDocker

CMD ./init.sh

CMD ["supercronic", "/opt/beeDocker/crontab"]

CMD ["node", "/opt/beeDocker/index.js"]
