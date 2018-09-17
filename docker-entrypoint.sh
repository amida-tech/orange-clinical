#!/bin/bash

set -e

if [ -z ${ORANGE_API_URL+x} ]
  then echo "Environment variable ORANGE_API_URL is required, but it is not set. Exiting."; exit 1;
fi

if [ -z ${AUTH_MICROSERVICE_URL+x} ]
  then echo "Environment variable AUTH_MICROSERVICE_URL is required, but it is not set. Exiting."; exit 1;
fi

if [ -z ${ORANGE_API_AVATAR_BASE_URL+x} ]
  then echo "Environment variable ORANGE_API_AVATAR_BASE_URL is required, but it is not set. Exiting."; exit 1;
fi

if [ -z ${X_CLIENT_SECRET+x} ]
  then echo "Environment variable X_CLIENT_SECRET is required, but it is not set. Exiting."; exit 1;
fi

SET_COOKIE_HEADER_NGINX_DIRECTIVE="add_header Set-Cookie 'orangeClinicalConfig={\"ORANGE_API_URL\":\""$ORANGE_API_URL"\",\"AUTH_MICROSERVICE_URL\":\""$AUTH_MICROSERVICE_URL"\",\"ORANGE_API_AVATAR_BASE_URL\":\""$ORANGE_API_AVATAR_BASE_URL"\",\"X_CLIENT_SECRET\":\""$X_CLIENT_SECRET"\"}; Path=/';"

echo $SET_COOKIE_HEADER_NGINX_DIRECTIVE >> /etc/nginx/orange-clinical-nginx-set-header-directive.conf

# The default CMD in the nginx official Dockerfile is
# CMD ["nginx", "-g", "daemon off;"]
# Therefore, here, I need to run `nginx`, but the `-g "daemon off;" part
# isn't working, so I just put that directive in the nginx.conf file`
nginx
