#!/bin/sh

sed -i "s|VITE_API_LINK|${BACKEND_URL}|g" /usr/share/nginx/html/index.html

# Starting NGINX
exec "$@"