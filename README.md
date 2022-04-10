# querybuilder

A simple Query Builder made in TypeScript.
I started this project in order to get something to use in my own projects when having modular queries in Node.

The project build output are ES6 modules and is provided in the "build" folder.

## How to use the builder
```typescript
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

//output query
console.log(query.getQuery());
```
This should output something like this, without the indents and row breaks:
```sql
select id,first_name,last_name
from person
join cool_people on (
    select 1
    from cool_people
    where cool_people.person_id = person.id
    and cool_people.sunglasses = true
)
right outer join less_cool_people on (less_cool_people.person_id = person.id)
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
    and pas.person_id = person.id
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
(new Builder("person"))
    .where("foo = 1")
    .where("bar = ?", [2]);

(new Builder("person"))
    .where("foo = ? and bar = ?", [1,2]);
```
### (Right/Left/Outer) Join
This function accepts a table to join and a string id-match or Builder object.
```typescript
(new Builder("person"))
    .join("portfolio", "portfolio.person_id = person.id");
/*output:
select * from person join portfolio on (portfolio.person_id = person.id)
*/

(new Builder("person"))
    .leftJoin("portfolio", "portfolio.person_id = person.id");
/*output:
select * from person left join portfolio on (portfolio.person_id = person.id)
*/

(new Builder("person"))
    .leftOuterJoin("portfolio", (new Builder("portfolio"))
        .select("1")
        .where("portfolio.person_id = person.id")
        .where("portfolio.artcicle_id = ?", [123]));
/*output:
select * from person left outer join portfolio on(select 1 from portfolio where portfolio.person_id = person.id and portfolio.artcicle_id = '123')
*/
```
### Select
This work similarly to the Where-part, as it accepts the same kind of parameters to builder.
```typescript
(new Builder("person"))
    .select("id, first_name");

(new Builder("person"))
    .select("?", ['first_name']);
```
### WhereIn
This works differently from the Where-part. It accepts a key value to pair the next Builder query with. It works as follows:
```typescript
let query = (new Builder("person"))
    .whereIn("id", (new Builder("person_account"))
        .select("person_id")
        .where("current_balance > ?", [123]));

console.log(query.getQuery());
```
The above example would output the following query:
```sql
select *
from person
where id in(
    select person_id
    from person_account
    where current_balance > '123'
)
```
### Exists & Not Exists
Both of these functions only accepts a "Builder" object as parameter and works in a similar way as "WhereIn".
```typescript
(new Builder("person"))
    .whereExists((new Builder("person"))
    .select("1")
    .where("foo = 'bar'"));

(new Builder("person"))
    .whereNotExists((new Builder("person"))
    .select("1")
    .where("foo = 'bar'"));
```
