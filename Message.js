module.exports = class Message {
    constructor(timestamp, name, message){
        this.timestamp = timestamp; 
        this.name = name; 
        this.message = message; 
    }
    getTime(){
        return this.timestamp; 
    }
    getName(){
        return this.name;
    }
    getMessage(){
        return this.message;
    }
}
