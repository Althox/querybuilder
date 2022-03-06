# querybuilder

A simple Query Builder made in TypeScript.
I started this project in order to get something to use in my own projects when having modular queries in Node.

Optionally, if you would like to use ES6 modules instead of TypeScript, you can use the files provided in the "build" folder.

## How to use the builder
```typescript
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
```
This should output something like this, without the indents and row breaks:
```sql
select id,
    first_name,
    last_name
from persons
where first_name = 'anna'
    and id in(
        select person_id
        from person_account
        where current_balance > '123'
    )
    and exists (
        select 1
        from person_account_status pas
        where pas.status_id = '21'
            and pas.person_id = persons.id
    )
order by first_name asc
offset = 10
limit 1
```

## Different parts and usage
The builder is constructed by different query parts, like: Where, Select, WhereIn.

### Where
Can accept one parameter with the full query string, or a parameter divided query where each paramater (in order) is represented by a questionmark.
```typescript
(new Builder("persons"))
    .where("foo = 1")
    .where("bar = ?", [2]);

(new Builder("persons"))
    .where("foo = ? and bar = ?", [1,2]);
```
### Select
This work similarly to the Where-part, as it accepts the same kind of parameters to builder.
```typescript
(new Builder("persons"))
    .select("id, first_name");

(new Builder("persons"))
    .select("?", ['first_name']);
```
### WhereIn
This works differently from the Where-part. It accepts a key value to pair the next Builder query with. It works as follows:
```typescript
let query = (new Builder("persons"))
    .whereIn("id", (new Builder("person_account"))
        .select("person_id")
        .where("current_balance > ?", [123]));

console.log(query.getQuery());
```
The above example would output the following query:
```sql
select *
from persons
where id in(
    select person_id
    from person_account
    where current_balance > '123'
)
```
### Exists & Not Exists
Both of these functions only accepts a "Builder" object as parameter and works in a similar way as "WhereIn".
```typescript
(new Builder("persons"))
    .whereExists((new Builder("persons"))
    .select("1")
    .where("foo = 'bar'"));

(new Builder("persons"))
    .whereNotExists((new Builder("persons"))
    .select("1")
    .where("foo = 'bar'"));
```
