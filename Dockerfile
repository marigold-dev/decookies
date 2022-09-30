ARG BUILDER_IMAGE="node:17-alpine3.14"
ARG RUNNER_IMAGE="joseluisq/static-web-server:2.9-alpine"

FROM ${BUILDER_IMAGE} as builder

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

FROM ${RUNNER_IMAGE}

ENV NODE_ENV production

ENV SERVER_FALLBACK_PAGE /public/index.html

COPY --from=builder /app/build /public

EXPOSE 80

CMD ["static-web-server"]