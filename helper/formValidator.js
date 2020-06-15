
export default class FormValidator{
    
    static pureTextPattern = /^[a-zA-Z ]+$/
    static pureNumberPattern = /^[0-9 ]+$/
    static alphanumerics = /^[a-zA-Z0-9 ]+$/

    static validateName=(text)=>{
        if(text.length >= 3 && this.pureTextPattern.test(text)){
            return true;
        }
        else{
            return false;
        }
    }
    static validatePhone=(text)=>{
        if(text.length===10 && this.pureNumberPattern.test(text)){
            return true;
        }else{
            return false;
        }
    }
    static validatePassword=(text)=>{
        if(text.length >= 5 && this.alphanumerics.test(text)){
            return true;
        }
        return false;
    }
    static validateQuestion=(text)=>{
        if(text.length >= 10){
            return true;
        }
        return false;
    }
}

