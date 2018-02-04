let conn = new Mongo();
let db = conn.getDB("bolsa-de-empleos-test");

printjson(db.jobs.createIndex({jobName: "text", ownerCompany: "text"}));
printjson(db.jobs.createIndex({salary: -1, _id: -1}));
