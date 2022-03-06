# querybuilder

A simple Query Builder made in TypeScript.
I started this project in order to get something to use in my own projects when having modular queries in Node.

Optionally, if you would like to use ES6 modules instead of TypeScript, you can use the files provided in the "build" folder.

## How to use the builder
```typescript
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
```
This should output something like this, without the indents and row breaks:
```sql
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
The above example woud output the following query:
```sql
select *
from persons
where id in(
    select person_id
    from person_account
    where current_balance > '123'
)
```