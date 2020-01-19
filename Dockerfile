FROM alpine:latest

# Add ipv6 support
RUN echo "ipv6" >> /etc/modules

# Install yarn
RUN echo -e 'http://dl-cdn.alpinelinux.org/alpine/edge/main\nhttp://dl-cdn.alpinelinux.org/alpine/edge/community\nhttp://dl-cdn.alpinelinux.org/alpine/edge/testing' > /etc/apk/repositories \
    && apk add --no-cache yarn

# Install yarn dependencies
ADD package.json /yarn-tmp/package.json
ADD yarn.lock /yarn-tmp/yarn.lock
RUN cd /yarn-tmp/ && yarn && mkdir -p /code && mv /yarn-tmp/node_modules /code/

# Copy all directory
COPY . /code/

WORKDIR /code/

ENTRYPOINT ["yarn", "run"]
CMD ["build"]
