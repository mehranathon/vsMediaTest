export function setAttributes(attrs){
    for(const attr in attrs){
        this.setAttribute(attr,attrs[attr])
    }
};