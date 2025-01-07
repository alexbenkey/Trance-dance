# FROM nginx:alpine
FROM nginx:1.27.3-bookworm

# Copy static files to Nginx HTML directory
#COPY ./statics/* /usr/share/nginx/html/static

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# COPY ../js/* /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

RUN apt-get update && apt-get upgrade -y

# the package manager to install all required packages
# openssl is a toolkit for the Transport Layer Security (TLS) and Secure Sockets Layer (SSL) protocols 
# - to create/amanage SSL certificates
RUN apt-get install -y nginx openssl

RUN mkdir -p /etc/nginx/ssl 

# generate SSL certificate (https://www.openssl.org/docs/man3.0/man1/openssl-req.html)
#   req = required; 
#   -x509 = the format of the public key and that should be self signed;
#   -nodes = skips the encryption and leaves public key as plain text;
RUN openssl req -x509 -nodes \
    -subj "/C=NL/ST=Noord Holland/L=Amsterdam/O=42/OU=42/CN=dmaessen.42.fr/UID=dmaessen" \ 
    -out /etc/nginx/ssl/inception.crt \
    -keyout /etc/nginx/ssl/inception.key

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
