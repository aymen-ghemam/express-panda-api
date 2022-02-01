FROM node:8

WORKDIR /express-panda-api

COPY package*.json .
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD npm run dev