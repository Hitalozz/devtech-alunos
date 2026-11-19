FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY script.js /usr/share/nginx/html/script.js
COPY puc-goias.svg /usr/share/nginx/html/puc-goias.svg

EXPOSE 80