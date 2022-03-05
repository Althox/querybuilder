import { Where } from "./Where";

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
        var firstWhere : boolean = true;
        var firstSelect : boolean = true;

        this.queryParts.forEach((part) => {
            switch (part.constructor.name) {
                case 'Where':
                    let prefix = (firstWhere) ? ' where ' : ' and ';
                    where += `${prefix}${part.get()}`
                    firstWhere = false;
                    break;
                case 'Select':
                    select += (firstSelect) ? part.get() : `,${part.get()}`;
                    firstSelect = false;
                    break;
                default:
                    query += part.get();
                    break;
            }
        });

        if (select.trim() == '') select += '*';

        query = `select ${select} from ${tableName}${where}${query};`;

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