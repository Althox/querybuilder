import { Builder } from "./Builder";

const Table = Builder;

let table = (new Table("persons"))
    .select("id,first_name")
    .select("last_name")
    .where("first_name = ?", ['anna'])
    .whereIn("id", (new Table("person_account"))
        .select("person_id")
        .where("current_balance > ?", [123])
    )
    .where("id > 1")
    .offset(10)
    .limit(1);

console.log(table.getQuery());

/*
This should produce a query string looking like this:

select id,
    first_name,
    last_name
from persons
where first_name = 'anna'
    and id in (
        select person_id
        from person_account
        where current_balance > '123'
    )
    and id > 1
offset = 10
limit 1
*/