FROM node:12-alpine

# Add ipv6 support
RUN echo "ipv6" >> /etc/modules

RUN apk update

RUN node --version

# Install git
RUN apk add git
RUN git --version

# Install yarn
# RUN apk add --no-cache yarn
RUN yarn --version

# Install yarn dependencies
ADD package.json /yarn-tmp/package.json
ADD yarn.lock /yarn-tmp/yarn.lock
RUN cd /yarn-tmp/ && yarn && mkdir -p /code && mv /yarn-tmp/node_modules /code/

# Copy all directory
COPY . /code/

WORKDIR /code/

ENTRYPOINT ["yarn", "run"]
CMD ["build"]
