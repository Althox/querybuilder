import { Builder } from "./Builder";

let query = (new Builder("persons"))
    .select("id,first_name")
    .select("?", ['last_name'])
    .where("first_name = ?", ['anna'])
    .whereIn("id", (new Builder("person_account"))
        .select("person_id")
        .where("current_balance > ?", [123])
    )
    .where("id > 1")
    .offset(10)
    .limit(1);

console.log(query.getQuery());
