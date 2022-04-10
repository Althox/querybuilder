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
        var where : string = '';
        var join : string = '';
        var select : string = '';

        //TODO: Fix this, this is beyond optimal
        var firstWhere : boolean = true;
        var firstSelect : boolean = true;
        var firstJoin : boolean = true;

        this.sortParts();

        this.queryParts.forEach((part) => {
            switch (part.constructor.name) {
                case 'Where':
                case 'WhereIn':
                case 'WhereExists':
                case 'WhereNotExists':
                    let prefix = (firstWhere) ? ' where ' : ' and ';
                    where += `${prefix}${part.get()}`
                    firstWhere = false;
                    break;
                case 'Select':
                    select += (firstSelect) ? part.get() : `,${part.get()}`;
                    firstSelect = false;
                    break;
                case 'Join':
                    join += ' ' + part.get();
                    break;
                default:
                    query += part.get();
                    break;
            }
        });

        if (select.trim() == '') select += '*';

        if (join == '') {
            query = `select ${select} from ${tableName}${where}${query}`;
        } else {
            query = `select ${select} from ${tableName}${join}${where}${query}`;
        }

        return query;
    }

    sortParts()
    {
        let sortOrder = {Join: 1, Select: 2, Where: 3, OrderBy: 4, Offset: 5, Limit: 6};
        this.queryParts.sort(function(partA, partB)
        {
            return sortOrder[partA.constructor.name] - sortOrder[partB.constructor.name];
        });
    }
}