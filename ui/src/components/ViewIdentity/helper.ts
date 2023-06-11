export const reduceString = (input:string,reducedNumber:number) =>
{
    if(reducedNumber < input.length)
    {
        return input.slice(0,8).concat(".....").concat(input.slice(-8,-3))
    }
    else {
        return ""
    }

}