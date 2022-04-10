import { Builder } from "./components/Builder";

let lookForActiveOnly : boolean = true;

let query = (new Builder("persons"))
    .join("cool_people", (new Builder("cool_people"))
        .select("1")
        .where("cool_people.person_id = person.id")
        .where("cool_people.sunglasses = true"))
    .rightOuterJoin("less_cool_people", "less_cool_people.person_id = person.id")
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
