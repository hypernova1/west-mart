FROM node:14-alpine as builder

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json .
COPY yarn.lock* .
RUN yarn install

FROM node:14-alpine
WORKDIR /usr/app
COPY --from=builder /usr/app /usr/app/
COPY . .

# RUN yarn run build
ENV PORT 3000

RUN yarn run build

# Set Args
ARG DOCKER_ENV
ENV envValue=$DOCKER_ENV

EXPOSE 3000
CMD ["yarn", "start"]