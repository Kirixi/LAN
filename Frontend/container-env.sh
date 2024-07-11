#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in files served by NGINX
for file in $ROOT_DIR/js/app.*.js* $ROOT_DIR/index.html;
do
  sed -i 's|VITE_API_LINK|'${VITE_API_LINK}'|g' $file
done

# Starting NGINX
exec "$@"