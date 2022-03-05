import { QueryCombiner } from "./components/QueryCombiner";
import { Where } from "./components/Where";
import { Select } from "./components/Select";
import { PartInterface } from "./components/PartInterface";

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

    where(options : PartInterface): Builder
    {
        this.queryParts.push(new Where(options))
        return this;
    }

    select(options : PartInterface): Builder
    {
        this.queryParts.push(new Select(options))
        return this;
    }
}