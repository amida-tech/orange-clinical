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

RUN apt-get install -y npm
RUN npm install -g grunt

RUN grunt build

RUN ls -laF /app/
RUN ls -laF /app/build/

# Runner image
FROM nginx:1.15.3

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /var/www/html/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
# I need to put this somewhere. /etc/nginx/ will work fine, considering it writes an nginx conf file to that directory.
COPY --from=builder /app/docker-entrypoint.sh /etc/nginx/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/etc/nginx/docker-entrypoint.sh"]
