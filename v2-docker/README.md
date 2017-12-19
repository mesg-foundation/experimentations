docker build -t mesg/runner ./

docker swarm init
docker stack deploy --compose-file docker-compose.yml --prune MESG

curl -X POST http://localhost:60001/start -d service=webhook
curl -X POST http://localhost:60001/build -d service=webhook