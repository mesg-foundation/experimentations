const dgraph = require("dgraph-js")
const grpc = require("grpc")

const clientStub = new dgraph.DgraphClientStub(
  // addr: optional, default: "localhost:9080"
  "localhost:9080",
  // credentials: optional, default: grpc.credentials.createInsecure()
  grpc.credentials.createInsecure(),
);
const dgraphClient = new dgraph.DgraphClient(clientStub)

const dropAll = async () => {
  const op = new dgraph.Operation()
  op.setDropAll(true)
  return await dgraphClient.alter(op)
}

const alter = async schema => {
  const op = new dgraph.Operation()
  op.setSchema(schema)
  return await dgraphClient.alter(op)
}

const transaction = async func => {
  const txn = dgraphClient.newTxn()
  try {
    await func(txn)
    await txn.commit()
  } finally {
    await txn.discard()
  }
}

const mutate = data => transaction(async txn => {
  // const json = JSON.stringify(data)
  const serialized = new Uint8Array(new Buffer(data))
  // const serialized = new Buffer(json).toString("base64");
  
  const mu = new dgraph.Mutation()
  // mu.setSetJson(serialized)
  mu.setSetNquads(serialized)
  await txn.mutate(mu)
})

const query = async (query, vars) => {
  const res = await dgraphClient.newTxn().queryWithVars(query, vars)
  const jsonStr = new Buffer(res.getJson_asU8()).toString()
  // const jsonStr = new Buffer(res.getJson_asB64(), "base64").toString();

  return JSON.parse(jsonStr)
}

module.exports = {
  dropAll,
  alter,
  transaction,
  mutate,
  query
}
