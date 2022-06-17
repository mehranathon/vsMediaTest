import {createAssign} from './prototypes/array.js'
import {icons} from'../vectorArt.js'
import {runQuery} from './queryLogic.js'

Array.prototype.createAssign=createAssign


export function Field(param){
    this.fieldType=param.fieldType
    this.title=param.title
    this.inline=param.inline
    let data=param.data||{}
    this.path=param.path
    this.required=param.required
    this.valid=function(){
        if(this.fieldType==='name'){
            return true
        }
    }

    const maxLength=
    this.fieldType==='zipCode'?5
    :this.fieldType==='extension'?6
    :256

    const classes=this.inline?['form-label','inline-field']:['form-label']
    const label=['label',{innerText:this.title},[...classes]].createAssign()
    const formField=['input',{maxLength:maxLength},['form-input']].createAssign()
    const vIndicator=['div',{title:`please enter a valid ${this.fieldType}`},['v-indicator']].createAssign(icons.exclamation.createAssign())

    formField.addEventListener('keyup',()=>{
        this.check()
    })
    if(['zipCode','extension'].includes(this.fieldType)){
        formField.addEventListener("keydown",(e)=>{
            const allowed=/^[0-9]/
            const exceptions=['ArrowRight','ArrowLeft',"Home","End","Delete","Backspace"]
            if(!exceptions.includes(e.key)){
                if(!allowed.test(parseInt(e.key)) || cleanPhoneNum(formField.value).length>11) e.preventDefault()
    
            }

        })
    }

    if(this.fieldType==='phone'){
        formField.addEventListener("keydown",phoneParse)
        formField.addEventListener("keyup",formatPhone)
        formField.addEventListener("select",disableSelect)
    }

    function disableSelect(){
        formField.selectionEnd=formField.selectionStart;
    }

    function phoneParse(e){

        const allowed=/^[0-9]/
        const exceptions=['ArrowRight','ArrowLeft',"Home","End"]
        if(!exceptions.includes(e.key)){
            if(!allowed.test(parseInt(e.key)) || cleanPhoneNum(formField.value).length>11) e.preventDefault()

        }


        const currentPos=formField.selectionStart
        const val=formField.value
        if(e.key==="Backspace"){
            if(isNaN(val[currentPos-1])){
                if(currentPos>1){
                    formField.value=val.slice(0,currentPos-2)+val.slice(currentPos-1)
                    formField.selectionStart=currentPos-2
                }
                else{
                    formField.selectionStart=0
                }
            }
            else{
                formField.value=val.slice(0,currentPos-1)+val.slice(currentPos)
                formField.selectionStart=currentPos-2
            }
            formField.classList.add('hide-caret')
            
        }

        if(e.key==="Delete"){
            if(currentPos!=formField.value.length){
                if(isNaN(val[currentPos])){
                    formField.value=val.slice(0,currentPos+1)+val.slice(currentPos+2)
                    formField.selectionStart=currentPos+1
                }
                else{
                    
                    formField.value=val.slice(0,currentPos)+val.slice(currentPos+1)
                    formField.selectionStart=currentPos
                }

            }
            formField.classList.add('hide-caret')
        }


    }

    function formatPhone(e){
        const parsedNum=[]
        const currentPos=formField.selectionStart
        const atEnd=currentPos===formField.value.length
        const nums=cleanPhoneNum(formField.value).split('')
        const countryCode=nums.length>10?nums.splice(0,nums.length-10):null
        
        countryCode?.splice(0,0,'+')

        
        const allowed=/^[0-9]/

    
        if (nums.length>3) parsedNum.push('('+nums.slice(0,3).join('')+')')
        if (nums.length>6) parsedNum.push(nums.slice(3,6).join('')+'-')
        if (cleanPhoneNum(parsedNum.join('')).length<nums.length) parsedNum.push(nums.slice(cleanPhoneNum(parsedNum.join('')).length).join(''))
        if(countryCode) parsedNum.splice(0,0,...countryCode)

        formField.value=parsedNum.join('')

        if(e.key==='Backspace') {
            navigate(1,currentPos)
        }
        if(e.key==='Delete') {
            navigate(0,currentPos)
        }
        if(allowed.test(parseInt(e.key)) && !atEnd){
            navigate(0,currentPos)
        }

        formField.classList.remove('hide-caret')



    }

    function navigate(dir,pos){
        if((pos+dir<0)||(pos+dir>formField.value.length)){
            formField.selectionStart=pos
        }
        else{
            formField.selectionStart=pos+dir
        }
            
    }


    function cleanPhoneNum(val){
        return val.replace(/[()-/\+]/g,'')
    }

    this.buildIn=function(container){
        label.prepend(formField,vIndicator)
        container.append(label)
    }

    this.populate=function(){
        const fieldData=this.path.reduce((a,b)=>a?a[b]:null,data)
        if(fieldData){
            if(this.fieldType==='phone') formatPhone(formField.value=fieldData)
            else formField.value=fieldData
        }
        else formField.value=''
    }

    this.enable=function(){
        if(formField.disabled) formField.disabled=false
        
    }
    this.disable=function(){
        if(!formField.disabled)formField.disabled=true
    }

    this.value=function(){
        return formField.value
    }

    this.check=function(){
        const req=this.required
        const val=formField.value
        const fieldType=this.fieldType

        if(validate(fieldType,val) || (!req && val==='')){
            vIndicator.classList.remove('invalid')
            return true
        }

        if(!validate(fieldType,val)){
            vIndicator.classList.add('invalid')
            return false
        }
    }
    

    const validate=function(fieldType,val){

        if(fieldType==='username'){
            //based on provided dataset; no special characters except periods and underscores
            const allowed=/^[a-zA-Z0-9äöüÄÖÜ._]*$/
            return (
                allowed.test(val)
                && val.length>2
                && val.length<257
                )
        }
        if(fieldType==='name'){
            //requires name to be romanized; some East Asian cultures have mononymic full names (single syllable) 
            const allowed=/^[a-zA-Z0-9äöüÄÖÜ._\s]*$/
            return (
                allowed.test(val)
                && val.length>1
                && val.length<257
                )
        }
        if(fieldType==='email'){
            //email addresses vary wildly; it's advised that validation be conducted through a confirmation email 
            return (
                val.split('@')[0]?.length>0
                && val.split('@')[1]?.length>0
            )
        }
        if(fieldType==='phone'){
            return cleanPhoneNum(val).length>9
        }

        if(fieldType==='zipCode'){
            return (!isNaN(val) && (val.length===0||val.length===5))
            // return cleanPhoneNum(val).length>9
        }
        if(['street','city'].includes(fieldType)){
            const forbidden=/[~`!#_$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g
            return !forbidden.test(val)

        }
        return true

    }
    


    Object.defineProperties(this,{
        data:{
            get: ()=>{return data},
            set:(param)=>{
                data=param

            }
        }
    })

}


export function Form(param){
    let itemData=param.itemData
    const isNewItem=function(){
        return (itemData?Object.keys(itemData).length<1:false)
    }
    this.linkedTable=param.linkedTable
    this.title=param.title
    const validate=function(){
        return !fields.map(field=>field.check()).includes(false)
    }

    this.newItem=function(){
        this.itemData={}

        this.build()
    }

    const fields=[]
    param.fields.forEach(args=>{
        const field= new Field(args)
        field.data=itemData
        fields.push(field)

    })

    const dataSet=param.dataSet
    const container=param.container
    this.build=function(){

        const title=['div',{innerText:this.title},['form-title']].createAssign()
        container.append(title)

        const form=['div',{},['form-container']].createAssign()

        const buttons=['div',{},['btn-container']].createAssign()
        const save=['button',{id:'save', isSave:isNewItem()?true:false},['vs-btn','green-btn']].createAssign((isNewItem()?icons.save:icons.edit).createAssign())
        const del=['button',{id:'del', disabled:isNewItem()?true:false},['vs-btn','red-btn']].createAssign(icons.del.createAssign())
        const cancel=['button',{id:'cancel'},['vs-btn','blue-btn']].createAssign(icons.back.createAssign())
        const notify=['div',{innerText:'Please check indicated fields'},['notification']].createAssign()


        fields.forEach(field=>{
            field.buildIn(form)
        })

        save.addEventListener('click',()=>{
            if(save.isSave){
                if(validate()){
                    if(notify){
                        notify.classList.add('fade-out')
                    }
                    save.firstChild.remove()
                    document.querySelectorAll('.form-input').forEach(input=>{
                        input.setAttribute('disabled',true)
                    })
                    console.log(fields.map(field=>field.value()))
                    saveChanges()
                    save.append(icons.edit.createAssign())
                    save.firstChild.classList.add('fade-in')
                    save.isSave=false
                    del.disabled=false
                }
                else{
                    notify.classList.remove('fade-out')
                    buttons.append(notify)
                }

            }
            else{
                save.firstChild.remove()
                document.querySelectorAll('.form-input').forEach(input=>{
                    input.removeAttribute('disabled')
                })
                save.append(icons.save.createAssign())
                save.firstChild.classList.add('fade-in')
                save.isSave=true
            }
        })
    
        cancel.addEventListener('click',()=>{
             this.fadeRemove(this.linkedTable.build.bind(this.linkedTable))
    
        })
    
        del.addEventListener('click',()=>{

            console.log(dataSet.indexOf(itemData))
            dataSet.splice(dataSet.indexOf(itemData),1)
            this.fadeRemove(this.linkedTable.build.bind(this.linkedTable))

            /****This is where you would request PATCH with REST API*****/
        })
    
        buttons.append(cancel,save,del)
        container.append(form,buttons)
        


        this.populate()
        validate()
        if(isNewItem())this.enable()
        else this.disable()

    }

    this.populate=function(){
        fields.forEach(field=>{
            field.populate()
        })
    }

    this.enable=function(){
        fields.forEach(field=>{
            field.enable()
        })
    }
    this.disable=function(){
        fields.forEach(field=>{
            field.disable()
        })
    }
    const saveChanges=function(){


        if(Object.keys(itemData).length>0){                                                                     //if this is an existing item
            fields.forEach(field=>{                    

                if(field.path.length>1){                                                                        //recursing through nested properties of item
                    const levels=field.path.slice(0,field.path.length-1)
                    const target=levels.reduce((a,b)=>a?a[b]:null,itemData)
                    target[field.path.at(-1)]=field.value()
                }
                else{
                    itemData[field.path[0]]=field.value()
                }
            })

            /****This is where you would request PATCH with REST API*****/
        }
        else{            
            const id=dataSet.reduce((a,b)=>a<b.id?b.id:a,0)                                                                                       //if this is a new item
            const newItem={id:id+1}
            fields.forEach(field=>{
                if(field.path.length>1){                                                                        //recursing through nested properties of item
                    const levels=field.path.slice(0,field.path.length-1)
                    let target=newItem
                    levels.forEach(prop=>{
                        if(!target[prop])target[prop]={}
                        target=target[prop]
                    })
                    target[field.path.at(-1)]=field.value()
                }
                else{
                    newItem[field.path[0]]=field.value()
                }
            })
            dataSet.push(newItem)

            /****This is where you would request POST with REST API*****/
        }      
    }.bind(this)

    this.fadeRemove=function(done){

        container.classList.add('fade-out')
        container.addEventListener('animationend',removeAll)
    
        function removeAll(e){
            console.log(container)
            console.log(container.children)
            const childDoms=[...container.children]
            childDoms.forEach(child=>{
                child.remove()
            })
            container.removeEventListener('animationend',removeAll)
            if (typeof done==='function') done()
            container.classList.remove('fade-out')
            setTimeout(()=>{container.classList.remove('hidden-children')},1)
        
        }
    }

    Object.defineProperties(this,{
        itemData:{
            get: ()=>{return itemData},
            set:(data)=>{
                itemData=data
                fields.forEach(field=>{
                    field.data=itemData
                })

            }
        }
    })
}

export function DTable(param){
    this.data=param.data
    this.id=param.id
    this.rData=param.data
    this.fields=param.fields
    const container=param.container
    this.order=param.defSort||[0,false]                                                                         //[this.fields index: int, asc/desc: bool]
    this.sortData=function(){
        const field=this.fields[this.order[0]]
        const dir=this.order[1]?1:-1

        if(this.order[1]) this.rData.sort(ascending)
        else(this.rData.sort(descending))
        
        
        function ascending(a,b){
            if(a[field]<b[field]){
                return 1
            }
            if(a[field]>b[field]){
                return -1
            }
            return 0
        }

        function descending(a,b){
            if(a[field]<b[field]){
                return -1
            }
            if(a[field]>b[field]){
                return 1
            }
            return 0
        }

        this.render()
    
    }
    this.clickRow=typeof param.clickRow==='function'?param.clickRow:null
    this.addNew=typeof param.addNew==='function'?param.addNew:null

    const table=['div',{id:this.id},['u-table']].createAssign()

    this.build=function(){

        document.querySelector(`#${this.id}qlabel`)?.remove()
        document.querySelector(`#${this.id}`)?.remove()
        document.querySelector('#addUser')?.remove()

        const topBar=['div',{},['top-bar']].createAssign()
        const qLabel=['label',{id:`${this.id}qlabel`,innerText:'search'},['form-label','q-label']].createAssign()
        const qInput=['input',{id:`${this.id}qInput`},['form-input','q-input']].createAssign()

        const addUser=['button',{id:'addUser'},['vs-btn','green-btn']].createAssign(icons.addUser.createAssign())
        addUser.addEventListener('click',()=>{
            this.fadeRemove(this.addNew)
        })
        
        qLabel.prepend(qInput)
        topBar.append(qLabel,addUser)
        container.append(topBar)

        let currentQuery=qInput.value
        
        qInput.addEventListener('keyup',()=>{
            if(qInput.value!=currentQuery){
                const results=runQuery({data:this.data,rData:this.rData,query:qInput.value})
                this.rData=results
                this.sortData()
                currentQuery=qInput.value
            }

        
        })
        
        container.append(table)
        this.render()
        
    }


    this.render= function(){
        const children=[...table.children]
        children.forEach(child=>{
            child.remove()
        })
        table.append(buildHead())
        table.append(buildBody())
    }

    const buildHead=function(){
        const hRow=['div',{},['u-row', 'u-head']].createAssign()
        this.fields.forEach(field=>{
            const header=['div',{innerText:field.toUpperCase(),field:field},['u-cell']].createAssign()

            if(this.order[0]===this.fields.indexOf(field)) header.classList.add(this.order[1]?'asc':'desc')

            header.addEventListener('click',()=>{
                if(this.order[0]===this.fields.indexOf(field)) this.order[1]=!this.order[1]
                else this.order=[this.fields.indexOf(field),false]
                this.sortData()

            })

            hRow.append(header)
        })
        return hRow
    }.bind(this)


    const buildBody=function(){
        const rows=[]
        let delay=0
        const body=['div',{},['u-body']].createAssign()
        this.rData.forEach(item=>{
            const uRow=['div',{id:`u${item.id}`,iData:item},['u-row']].createAssign()
            uRow.style.animation=`.3s .0${delay}s ${this.order[1]?'fadeup':'fadedown'} forwards`
            uRow.append(...generateCells(this.fields,item))

            uRow.addEventListener('click',()=>{
                this.fadeRemove(this.clickRow.bind(null,item))
            })

            body.append(uRow)
            
            delay++
        })

        return body

    }.bind(this)

    const generateCells=function(fields,data){
        const cells=[]
        fields.forEach(field=>{
            cells.push(['div',{innerText:data[field]?data[field]:''},['u-cell']].createAssign())
        })
        return cells
    }

    this.fadeRemove=function(done){

        container.classList.add('fade-out')
        container.addEventListener('animationend',removeAll)
    
        function removeAll(e){
            console.log(container)
            console.log(container.children)
            const childDoms=[...container.children]
            childDoms.forEach(child=>{
                child.remove()
            })
            container.removeEventListener('animationend',removeAll)
            if (typeof done==='function') done()
            container.classList.remove('fade-out')
            setTimeout(()=>{container.classList.remove('hidden-children')},1)
        
        }
    }

}