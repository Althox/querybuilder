import { Builder } from "./Builder";
import { BindingInterface } from "./BindingInterface";
import { format } from "./HelperFunctions";

export class Join implements BindingInterface
{
    private joinedTable : string;
    private joinPrefix : string;
    private onJoinQuery : string|Builder;

    constructor(joinedTable : string, onJoinQuery : string|Builder)
    {
        this.joinPrefix = "";
        this.joinedTable = joinedTable;
        this.onJoinQuery = onJoinQuery;
    }

    prefix(joinPrefix : string): Join
    {
        this.joinPrefix = joinPrefix;
        return this;
    }

    get(): string {
        if (typeof this.onJoinQuery == "string") {
            if (this.joinPrefix != '') {
                return `${this.joinPrefix} join ${this.joinedTable} on (${this.onJoinQuery})`;
            } else {
                return `join ${this.joinedTable} on (${this.onJoinQuery})`;
            }
        } else {
            if (this.joinPrefix != '') {
                return `${this.joinPrefix} join ${this.joinedTable} on(${this.onJoinQuery.getQuery()})`;
            } else {
                return `join ${this.joinedTable} on (${this.onJoinQuery.getQuery()})`;
            }
        }
    }
}

export class Select implements BindingInterface
{
    private value : string;
    private param : Array<string|any>;

    constructor(value : string, param : Array<any>)
    {
        this.value = value;
        this.param = param;
    }

    get(): string
    {
        return format(this.value, this.param, false);
    }
}

export class Where implements BindingInterface
{
    private value : string;
    private param : Array<string|any>;

    constructor(value : string, param : Array<any>)
    {
        this.value = value;
        this.param = param;
    }

    get(): string
    {
        return format(this.value, this.param);
    }
}

export class WhereIn implements BindingInterface
{
    private value : string;
    private builder : Builder;

    constructor(value : string, builder : Builder)
    {
        this.value = value;
        this.builder = builder;
    }

    get(): string
    {
        return `${this.value} in(${this.builder.getQuery()})`;
    }
}

export class WhereExists implements BindingInterface
{
    private builder : Builder;

    constructor(builder : Builder)
    {
        this.builder = builder;
    }

    get(): string
    {
        return `exists (${this.builder.getQuery()})`;
    }
}

export class WhereNotExists implements BindingInterface
{
    private builder : Builder;

    constructor(builder : Builder)
    {
        this.builder = builder;
    }

    get(): string
    {
        return `not exists (${this.builder.getQuery()})`;
    }
}

export class Limit implements BindingInterface
{
    private limit : number;

    constructor(limit : number)
    {
        this.limit = limit;
    }

    get(): string
    {
        return  ` limit ${this.limit.toString()}`;
    }
}

export class Offset implements BindingInterface
{
    private offset : number;

    constructor(offset : number)
    {
        this.offset = offset;
    }

    get(): string
    {
        return ` offset = ${this.offset.toString()}`;
    }
}

export class OrderBy implements BindingInterface
{
    private orderBy : string;

    constructor(orderBy : string)
    {
        this.orderBy = orderBy;
    }

    get(): string
    {
        return ` order by ${this.orderBy}`;
    }
}