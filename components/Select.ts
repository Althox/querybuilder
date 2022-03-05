import { BindingInterface } from "./BindingInterface";
import { format } from "./HelperFunctions";
import { PartInterface } from "./PartInterface";

export class Select implements BindingInterface
{
    private value : string;
    private param : Array<string|any>;

    constructor(options : PartInterface)
    {
        this.value = options.value;
        this.param = (options.param == null) ? [] : options.param;
    }

    get(): string
    {
        return format(this.value, this.param);
    }
}