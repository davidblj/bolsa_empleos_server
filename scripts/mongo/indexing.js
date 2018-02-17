let conn = new Mongo();
let db = conn.getDB("bolsa-de-empleos-test");

// job schema
printjson(db.jobs.createIndex({name: "text", owner: "text"}));
printjson(db.jobs.createIndex({salary: -1, _id: -1}));
