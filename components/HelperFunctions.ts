export function format(
    message : string,
    params : Array<any>,
    wrapAsString : boolean = true
): string
{
    let parameterOut = (wrapAsString) ? `'${params.shift()}'` : `${params.shift()}`
    return message.replace(RegExp(/(\?)/g), () => parameterOut);
}
