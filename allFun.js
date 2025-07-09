function y()
{
    function addFn(a,b)
{    return (a+b); }

function diffFn(a,b)
{   return (a-b); }
return {
        addFn,
        diffFn
    };
}


function add(a,b)
{
    return a+b;
}
function diff(a,b)
{
    return a-b;
}
//module.exports =y;
module.exports={add,diff,y};
