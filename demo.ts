import { Builder } from "./Builder";

const Table = Builder;

let table = (new Table("persons"))
    .select({value : "id,first_name"})
    .select({value : "last_name"})
    .where({value : "first_name = ?", param : ['anna']})
    .where({value : "total_sum = ?", param : [123]})
    .where({value : "last_name = 'testsson'"});

console.log(table.getQuery());