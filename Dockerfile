FROM node:current-alpine
EXPOSE 8080

WORKDIR /opt/beeDocker

COPY package.json /opt/beeDocker/
COPY package-lock.json /opt/beeDocker/

RUN npm ci

COPY . /opt/beeDocker

RUN touch crontab.txt \
    && echo '@hourly node /opt/beeDocker/cronUserDel.js' >> crontab.txt \
    && chmod 0600 crontab.txt \
    && crontab crontab.txt \
    && rm -rf crontab.txt

RUN chmod 755 /opt/beeDocker/docker-entrypoint.sh

RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--", "/opt/beeDocker/docker-entrypoint.sh"]
