import { Select, Where, WhereIn, Limit, Offset } from "./Parts";

export class QueryCombiner
{
    private queryParts : Array<any>;

    constructor(queryParts : Array<any>)
    {
        this.queryParts = queryParts;
    }

    combine(tableName : string): string
    {
        var query : string = '';
        var select : string = '';
        var where : string = '';

        //TODO: Fix this, this is beyond optimal
        var firstWhere : boolean = true;
        var firstSelect : boolean = true;

        this.queryParts.forEach((part) => {
            switch (part.constructor.name) {
                case 'Where':
                case 'WhereIn':
                    let prefix = (firstWhere) ? ' where ' : ' and ';
                    where += `${prefix}${part.get()}`
                    firstWhere = false;
                    break;
                case 'Select':
                    select += (firstSelect) ? part.get() : `,${part.get()}`;
                    firstSelect = false;
                    break;
                // case 'Limit':
                //     query += ` limit ${part.get()}`;
                //     break;
                default:
                    query += part.get();
                    break;
            }
        });

        if (select.trim() == '') select += '*';

        query = `select ${select} from ${tableName}${where}${query}`;

        return query;
    }

    sortParts()
    {
        let sortOrder = {Select: 1, Where: 2, OrderBy: 3, Offset: 4, Limit: 5};
        this.queryParts.sort(function(partA, partB)
        {
            return sortOrder[partA.constructor.name] - sortOrder[partB.constructor.name];
        });
    }
}