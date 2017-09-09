# docker build -t sentiments-highcharts . && docker run -d --name sentiments-highcharts -e "WEBPORT=80" -e "REGURL=http://localhost:3000" -p 5005:80 sentiments-highcharts
# docker tag sentiments-highcharts suenot/sentiments-highcharts
# docker push suenot/sentiments-highcharts
#
FROM node:7.10-alpine
LABEL maintainer="Eugen Soloviov"
COPY server /server
COPY client /server/public
COPY register.json /server/register.json
WORKDIR /server
CMD ["node","index.js"]