# FROM node:14-alpine as builder
# WORKDIR /app
# COPY . .
# RUN yarn install && yarn build

# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# RUN rm -rf /usr/share/nginx/html/*
# RUN rm -rf ./*
# COPY --from=builder /app/build .
# RUN rm /etc/nginx/conf.d/default.conf
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

FROM node:12-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV TOOL_NODE_FLAGS=--max_old_space_size=4096

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
EXPOSE 3000
COPY . ./

CMD ["yarn", "start"]