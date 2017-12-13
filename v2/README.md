docker build -t mesg/runner ./

docker stack deploy --compose-file docker-compose.yml --prune MESG

curl -X POST http://localhost:60001/start -d service=webhook,ethereum