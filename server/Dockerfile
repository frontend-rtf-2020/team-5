FROM golang:1.13.7-alpine3.11 as build-env
RUN apk --no-cache add git build-base
WORKDIR /goman/
ADD . .
RUN GOBIN=/goman/apps/ GOOS=linux GOARCH=amd64 go install -v -a -tags netgo -mod vendor -ldflags "-w" ./cmd/...

FROM alpine:3.11
RUN apk add --no-cache ca-certificates tzdata
COPY --from=build-env /goman/apps/ /apps
WORKDIR /apps/
