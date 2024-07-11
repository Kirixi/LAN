#!/bin/sh

sed -i "s|VITE_API_LINK|${VITE_API_LINK}|g" /usr/share/nginx/html/index.html

# Starting NGINX
exec "$@"