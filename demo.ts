import { Builder } from "./Builder";

let lookForActiveOnly : boolean = true;

let query = (new Builder("persons"))
    .select("id,first_name")
    .where("first_name = ?", ['anna'])
    .whereIn("id", (new Builder("person_account"))
        .select("person_id")
        .where("current_balance > ?", [123])
    )
    .select("?", ['last_name']);

if (lookForActiveOnly) {
    query.whereExists((new Builder("person_account_status pas"))
        .select("1")
        .where("pas.status_id = ?", [21])
        .where("pas.person_id = persons.id")
    );
}

query.offset(10)
    .limit(1)
    .orderBy("first_name asc");

console.log(query.getQuery());
