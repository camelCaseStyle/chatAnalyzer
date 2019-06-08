let fs = require("fs")
let textByLine = fs.readFileSync('splitChat.txt').toString().split("\n");
let regex = /\[(\d+\/\d+\/\d+),\s+(\d+:\d+:\d+\s+[a|p]m)\]\s(\w.+):\s(.+)/;
split = null; 
let participants = ["Anubhav", "Mridul Karen FF"];

let DATE = 1; 
let NAME = 3; 
let MESSAGE  = 4; 

function splitEachLine(){
    split = textByLine.map(elem =>{
        return elem.match(regex);
    })
    // for every element in the array add a JS date object 
    split = split.map(elem =>{
        let date; 
      
        elem[1] = function(){
            if(elem != null){
                date = elem[1].split("/");
                return new Date(date[0] + " "+getMonth(date[1]) +" "+ date[2] + " "+ elem[2]); 
            }
             
            
        }(); 
        return elem; 
    })
    //console.log(split)
}
// get each line ready
splitEachLine(); 
getLongestResponseTime();
function getLongestResponseTime(){
    let largest = 0; 
    let conv; 
    for(let i = 0; i < split.length; i++){
        if(split[i][NAME] === participants[0]){
            let responseTime = getResponseTime(split[i], getNextConversation(i));
            
            if(responseTime > largest){
                largest = responseTime; 
                conv = split[i];
                // console.log(split[i] + "\n "+ getNextConversation(i))
            }    
        }
    }
    console.log(conv +" \n \n" + getPrettyTime(largest));
}
function getNextConversation(idx){
    for(let i = idx; i < split.length; i++){
        if(split[i][NAME] === participants[1]){
            return split[i];
        }
    }
}

//given two objects calculate response time 
function getResponseTime(converationOne, conversationTwo){
    if(conversationTwo != undefined){
        return Math.abs(converationOne[DATE] - conversationTwo[DATE]);
    }
    return NaN;
}

function getPrettyTime(ms){
    let seconds = ms/1000; 
    let minutes = seconds/60; 
    let hours = minutes/60; 
    let days = hours/24;
    return `${Math.floor(days)} days or ${Math.floor(hours)} hours or ${Math.floor(minutes)} minutes or ${Math.floor(seconds)} seconds`;
}
function getMonth(date){
    switch(date){
        case "1":
            return "Jan";
        case "2":
            return "Feb";
        case "3":
            return "Mar";
        case "4":
            return "Apr";
        case "5":
            return "May";
        case "6":
            return "Jun";
        case "7":
            return "Jul";
        case "8":
            return "Aug";
        case "9":
            return "Sep";
        case "10":
            return "Oct";
        case "11":
            return "Nov";
        case "12":
            return "Dec";

    }
}