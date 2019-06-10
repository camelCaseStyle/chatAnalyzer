let fs = require("fs")
let textByLine = fs.readFileSync('_chat 6.txt').toString().split("\n");
const regex = new RegExp(/\[(\d+\/\d+\/\d+),\s+(\d+:\d+:\d+\s+[a|p]m)\]\s([a-zA-Z'-\s]+):\s(.+)/);
let lines; 
let participants = [];
const ignoreKeywords = ["in","is" ,"for", "of", "a","and", "to", "are", "I", "you", "!", "image", "the", "omitted", "image", "video"];
const months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let DATE = 1; 
let NAME = 3; 
let MESSAGE  = 4; 

function splitEachLine(){
    lines = textByLine.map(elem =>{
        if(regex.test(elem) && elem != null && elem != ""){
            return elem.match(regex);
        }
        
    }).filter(elem =>{
        if(elem != undefined) return elem; 
    }); 
    // for every element in the array add a JS date object 
    lines = lines.map(elem =>{   
        elem[1] = function(){
            let date; 
            if(elem != null){
                date = elem[1].split("/");
                return new Date(date[0] + " "+getMonth(date[1]) +" "+ date[2] + " "+ elem[2]); 
            }
        }(); 
        return elem; 
    })
    //console.log(split)
}
function addParticipants(){
    lines.forEach(elem =>{
        if(!participants.includes(elem[NAME])){
            participants.push(elem[NAME]);
        }
    })
   console.log("Participants: \n"+participants);
}
// get each line ready



function getLongestResponseTime(){
    let largest = 0; 
    let conv; 
    for(let i = 0; i < lines.length; i++){
        if(lines[i][NAME] === participants[0]){
            let responseTime = getResponseTime(lines[i], getNextConversation(i));        
            if(responseTime > largest){
                largest = responseTime; 
                conv = lines[i];
                // console.log(split[i] + "\n "+ getNextConversation(i))
            }    
        }
    }
    console.log(conv +" \n \n" + getPrettyTime(largest));
}
function getNextConversation(idx){
    for(let i = idx; i < lines.length; i++){
        // other participant in the conversation 
        if(lines[i][NAME] !== participants[0]){
            return lines[i];
        }
    }
    // its possible that this is the last message in the conversation 
    return null; 
}

//given two objects calculate response time 
function getResponseTime(converationOne, conversationTwo){
    try{
        if(conversationTwo != undefined){
            return Math.abs(converationOne[DATE] - conversationTwo[DATE]);
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

    lines.forEach(elem =>{
        // for each message split the message by spaces and add word to array 
        elem[MESSAGE].split(" ").forEach(word =>{
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
    lines.forEach(line =>{
        convFreq[getFormattedDate(line)] = (convFreq[getFormattedDate(line)] || 0) + 1; 
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
    console.log("You chatted most on "+ sortedFreq[0].name);
}

function getFormattedDate(conversation){
    return conversation[DATE].getDate()+"/"+(conversation[DATE].getMonth()+1)+"/"+conversation[DATE].getFullYear().toString().slice(2); 
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