# Builder image
FROM ubuntu:18.04 as builder

WORKDIR /app

COPY . /app/

RUN apt-get update -y

# ruby-full, libtool, and make are required to get `gem install sass` to work
RUN apt-get install -y ruby-full
RUN apt-get install -y libtool
RUN apt-get install -y make
RUN gem install sass

RUN apt-get install -y git
RUN apt-get install -y npm
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install

RUN bower install --allow-root

RUN grunt build

# Runner image
FROM nginx:1.15.3

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /var/www/html/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
# I need to put this somewhere. I would rather not have it in /var/www/html where the because
# web server makes everything there public. /etc/nginx/ will work fine, considering it writes
# an nginx conf file to that directory.
COPY --from=builder /app/docker-entrypoint.sh /etc/nginx/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/etc/nginx/docker-entrypoint.sh"]
