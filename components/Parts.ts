import { Builder } from "../Builder";
import { BindingInterface } from "./BindingInterface";
import { format } from "./HelperFunctions";

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
        return format(this.value, this.param);
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