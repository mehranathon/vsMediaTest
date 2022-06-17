import {createAssign} from './prototypes/array.js'
import{DTable,Form} from './components.js'
import {icons} from'../vectorArt.js'
import {runQuery} from './queryLogic.js'

Array.prototype.createAssign=createAssign

const dispArea=document.querySelector('.display-area')

const container=['div',{id:'usersContainer'},['ui-block']].createAssign()
dispArea.append(container)







async function getData(json){
    let response

    await fetch(json)
    .then(response => response.text())
    .then(data => {
        response=JSON.parse(data)
    });

    return response
}

// If this were an actual dataset, I would run an async query every time it builds rather than fetch the data once at start; 
// this would lead to a performance hit but ensure that multiple users can work it on it simultaneously; other option is polling

const users=await getData('../mockData.json')



const userTable = new DTable({
    data: users,
    id:'userTable',
    fields: ['id','username','name','email'],
    container:container,
    clickRow,
    addNew
})

function clickRow(item){
    userForm.itemData=item
    userForm.title=item.id
    userForm.build()
}

function addNew(){
    const id=userForm.title=users.reduce((a,b)=>a<b.id?b.id:a,0)
    userForm.title=id+1
    userForm.newItem()
}

let user={}

const userForm= new Form({
    dataSet:users,
    linkedTable:userTable,
    container:container,
    fields:[
        {
            fieldType:'username',
            required:true,
            title:'USERNAME',
            path:['username']
        },
        {
            fieldType:'name',
            required:true,
            title:'NAME',
            path:['name']
        },
        {
            fieldType:'email',
            required:true,
            title:'EMAIL',
            path:['email']
        },
        {
            fieldType:'phone',
            required:true,
            title:'PHONE NUMBER',
            inline:true,
            path:['phone','num']
        },
        {
            fieldType:'extension',
            title:'EXT',
            inline:true,
            path:['phone','ext']
        },
        {
            fieldType:'street',
            title:'STREET',
            inline:true,
            path:['address','street']
        },
        {
            fieldType:'suite',
            title:'SUITE',
            inline:true,
            path:['address','suite']
        },
        {
            fieldType:'city',
            title:'CITY',
            inline:true,
            path:['address','city']
        },
        {
            fieldType:'zipCode',
            title:'ZIP CODE',
            inline:true,
            path:['address','zipcode']
        },
    ]
})


userTable.build()
// userForm.build()





