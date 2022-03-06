import { QueryCombiner } from "./components/QueryCombiner";
import { Select, WhereIn, Where, WhereExists, WhereNotExists, Limit, Offset,
    OrderBy } from "./components/Parts";

export class Builder
{
    private tableName : string = "";
    private queryParts : Array<any> = [];

    constructor(tableName: string)
    {
        this.tableName = tableName;
    }

    getQuery(): string
    {
        return (new QueryCombiner(this.queryParts)).combine(this.tableName);
    }

    select(value : string, param : Array<any> = []): Builder
    {
        this.queryParts.push(new Select(value, param));
        return this;
    }

    where(value : string, param : Array<any> = []): Builder
    {
        this.queryParts.push(new Where(value, param));
        return this;
    }

    whereIn(value : string, builder : Builder): Builder
    {
        this.queryParts.push(new WhereIn(value, builder));
        return this;
    }

    whereExists(builder : Builder): Builder
    {
        this.queryParts.push(new WhereExists(builder));
        return this;
    }

    whereNotExists(builder : Builder): Builder
    {
        this.queryParts.push(new WhereNotExists(builder));
        return this;
    }

    limit(limit : number): Builder
    {
        this.queryParts.push(new Limit(limit));
        return this;
    }

    offset(offset : number): Builder
    {
        this.queryParts.push(new Offset(offset));
        return this;
    }

    orderBy(orderBy : string): Builder
    {
        this.queryParts.push(new OrderBy(orderBy));
        return this;
    }
}