# docker build -t sentiments-line-chart . && docker run -d --name sentiments-line-chart -e "WEBPORT=80" -e "REGURL=http://localhost:3000" -p 5002:80 sentiments-line-chart
#
FROM node:7.10-alpine
LABEL maintainer="Eugen Soloviov"
COPY server /server
COPY client /client
RUN cd /client && npm install && node build/build.js && mv /client/public /server/public
COPY register.json /server/register.json
WORKDIR /server
RUN npm install
CMD ["node","index.js"]