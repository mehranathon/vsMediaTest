import {setAttributes} from './element.js'

Element.prototype.setAttributes=setAttributes

/**
 * createAssign was originally written without relying on frameworks or libraries as a more succint solution to the multiple line 
 * document.createElement methods in vanilla JS.
 * 
 * */

export function createAssign(children){
    if(this[0]==='ico'){
        const svg=document.createElementNS("http://www.w3.org/2000/svg",'svg')    
        svg.setAttribute("aria-hidden","true");
        svg.setAttribute('viewBox','0 0 16 16')
        if(this[2]){
            this[2].forEach(cssClass=>{
                svg.classList.add(cssClass)
            })
        }

        this[1].forEach(path=>{
            const pth=document.createElementNS("http://www.w3.org/2000/svg",'path')
            pth.setAttributes(path)
            svg.append(pth)
        })
        return svg        
    }
    else{
        const element=Object.assign(document.createElement(this[0]),this[1])
        
        if(this[2]){
            this[2].forEach(cssClass=>{
                element.classList.add(cssClass)
            })
        }
        if(children){
            if(Array.isArray(children))children.forEach(child=>element.append(child.createAssign()))
            else element.append(children)   
        }
        
        return element

    }

};

