FROM node:current-alpine
EXPOSE 8080

WORKDIR /opt/beeDocker

COPY package.json /opt/beeDocker/
COPY package-lock.json /opt/beeDocker/

RUN npm ci

COPY . /opt/beeDocker

CMD ./init.sh

RUN touch crontab.tmp \
    && echo '*/15 * * * * node /opt/beeDocker/cronUserDel.js' >> crontab.tmp \
    && crontab crontab.tmp \
    && rm -rf crontab.tmp

CMD ["/usr/sbin/crond", "-f", "-d", "0"]

CMD ["node", "/opt/beeDocker/index.js"]
