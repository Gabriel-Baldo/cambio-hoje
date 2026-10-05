# nginx estável para servir o site estático
FROM nginx:1.27-alpine

# Remove conf default e copia a nossa (com cache curto p/ dev + gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Site estático na raiz
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
