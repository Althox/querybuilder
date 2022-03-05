function format(message : string, params : Array<any>): string
{
    return message.replace(RegExp(/(\?)/g), () => `'${params.shift()}'`);
}

export {format}