/**** 

This search bar performs case insensitive partial string match and accepts Boolean operators: OR(,) AND(&) NOT(!)
e.g. “red,green&car!convertible”= (red OR green ) car NOT convertible.
    -OR operators divided by AND are treated as a single argument 
        e.g. “red,green&car,house” = (red OR green) (car OR house)
    -All arguments after after “!” are treated as NOR 
        e.g. “red!ball,hat&toy!”= red NOT ball NOR hat NOR toy
    -Oxymorons are allowed but return no results e.g. “red!red” returns no results

****/



export function runQuery(param){

    const query=param.query.toUpperCase()

    let rData=param.data
    
    function filterOR(rData,query){
        if(query){
        rData=rData.filter(
            row=>query.split(',').filter(queryArg=>queryArg).some(queryArg=>Object.values(row).toString().toUpperCase().includes(queryArg))
        )
        }
        return rData
    }
    function filterAND(rData,query){
        query.split('&').forEach(argument=>{
            rData=filterOR(rData,argument)
        })
        return rData
    }
    function filterNOT(rData,query){
        rData=rData.filter(row=>!query.split(',').some(queryArg=>Object.values(row).toString().toUpperCase().includes(queryArg)))
        return rData
    }

    if(query.indexOf('!')>=0){
        const notBreak=query.indexOf('!')
        const isQuery=query.slice(0,notBreak)
        const notQuery=query.slice(notBreak+1,query.length)

        if(isQuery.indexOf('&')>=0)
        {            
            rData=filterAND(rData, isQuery)
        }
        else{
            rData=filterOR(rData, isQuery)
        }
        if(notQuery){
            rData=filterNOT(rData, notQuery)
        }
    }
    else{
        if(query.indexOf('&')>=0)
        {            
            rData=filterAND(rData, query)
        }
        else{
            rData=filterOR(rData, query)
        }
    }


    // rData=sortCol({col:order.col, asc:order.asc, rData, dataSlice:dataSlice})[0]

    return rData
    
    
};