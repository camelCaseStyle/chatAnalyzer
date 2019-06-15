let fs = require("fs");
let Message  = require('./Message');
let textByLine = fs.readFileSync(__dirname+'/splitChat.txt').toString().split("\n");
const regex = new RegExp(/\[(\d+\/\d+\/\d+),\s+(\d+:\d+:\d+\s+[a|p]m)\]\s([a-zA-Z'-\s]+):\s(.+)/);

let participants = [];
const ignoreKeywords = ["in","is" ,"for", "of", "a","and", "to", "are", "I", "you", "!", "image", "the", "omitted", "image", "video"];
const months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let DATE = 1; 
let NAME = 3; 
let MESSAGE  = 4; 

function splitEachLine(){
    let lines = textByLine.map(elem =>{
        if(regex.test(elem) && elem != null && elem != ""){
            return elem.match(regex);
        }
        
    }).filter(elem =>{
        if(elem != undefined) return elem; 
    }); 
    // for every element in the array  conver it into Message object 
    messages = lines.map(elem =>{   
        elem[1] = function(){
            let date; 
            if(elem != null){
                date = elem[1].split("/");
                return new Date(date[0] + " "+getMonth(date[1]) +" "+ date[2] + " "+ elem[2]); 
            }
        }(); 
        return new Message(elem[DATE], elem[NAME], elem[MESSAGE]);
    })
}
function addParticipants(){
    messages.forEach(elem =>{
        if(!participants.includes(elem.name)){
            participants.push(elem.name);
        }
    })
   console.log("Participants: \n"+participants);
}
// get each line ready


// TODO: implement getLongestConversation for participant and not hardcode to 0'th person
function getLongestResponseTime(){
    let largest = 0; 
    let conv; 
    for(let i = 0; i < messages.length; i++){
        if(messages[i].name === participants[0]){
            let responseTime = getResponseTime(messages[i], getNextConversation(i));        
            if(responseTime > largest){
                largest = responseTime; 
                conv = messages[i];
            }    
        }
    }
    console.log(`On ${conv.timestamp} participant "${conv.name}" said "${conv.message}"` +" \n \n" + getPrettyTime(largest));
}
function getNextConversation(idx){
    for(let i = idx; i < messages.length; i++){
        // other participant in the conversation 
        if(messages[i].name !== participants[0]){
            return messages[i];
        }
    }
    // its possible that this is the last message in the conversation 
    return null; 
}

//given two objects calculate response time 
function getResponseTime(converationOne, conversationTwo){
    try{
        if(conversationTwo != undefined){
            return Math.abs(converationOne.timestamp - conversationTwo.timestamp);
        }
    }catch(error){
        return NaN;
    }
}

function getPrettyTime(ms){
    let seconds = ms/1000; 
    let minutes = seconds/60; 
    let hours = minutes/60; 
    let days = hours/24;
    return `${Math.floor(days)} days or ${Math.floor(hours)} hours or ${Math.floor(minutes)} minutes or ${Math.floor(seconds)} seconds`;
}
function getMonth(date){
    return months[date-1];
}
function getMostUsedWord(){
    let wordMap ={};
    let words = [];  

    messages.forEach(elem =>{
        // for each message split the message by spaces and add word to array 
        elem.message.split(" ").forEach(word =>{
            word.replace("\\W", "");
            word = word.trim(); 
            if(!ignoreKeywords.includes(word) && !word.includes("image" ) && !word.includes("video")){
                words.push(word);
            }
        })
    });
    words.forEach(elem=>{
        wordMap[elem.toLowerCase()] =  (wordMap[elem.toLowerCase()] || 0) + 1;
    })
  
    wordsArray = Object.keys(wordMap).map(elem =>{
        return {
            name : elem, 
            total : wordMap[elem]
        }
    })
    wordsArray.sort((a,b)=>{
        return b.total - a.total;
    })
    console.log("Most commonly used 3 words :");
    for(let i = 0; i < 3; i++){
        console.log(wordsArray[i].name);
    }
}

function getLongestConversationInDay(){
    let convFreq = {}; 
    let sortedFreq = []; 
    messages.forEach(message =>{
        convFreq[getFormattedDate(message.timestamp)] = (convFreq[getFormattedDate(message.timestamp)] || 0) + 1; 
    })
    
    sortedFreq = Object.keys(convFreq).map(elem =>{
        return {
            name: elem,
            frequency: convFreq[elem] 
        }
    })
    sortedFreq.sort((a,b)=>{
        return b.frequency - a.frequency;
    })
    console.log("You chatted most on "+ sortedFreq[0].name + "\nand the second most was on "+sortedFreq[1].name);
    
}

function getFormattedDate(message){
    return message.getDate()+"/"+(message.getMonth()+1)+"/"+message.getFullYear().toString().slice(2); 
}


function analyze(){
    // split file into managable conversation objects 
    splitEachLine(); 
    // get the list of participants in conversation
    addParticipants();
    // get the longest reply time in  conversation 
    getLongestResponseTime();
    // get the most used word in conversation
    getMostUsedWord();
    // get day on which most conversations took place 
    getLongestConversationInDay(); 
}
analyze();