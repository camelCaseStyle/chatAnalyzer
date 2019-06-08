let fs = require("fs")
let textByLine = fs.readFileSync('_chat.txt').toString().split("\n");
let regex = /\[(\d+\/\d+\/\d+),\s+(\d+:\d+:\d+\s+[a|p]m)\]\s(\w.+):\s(.+)/;


function splitEachLine(){
    let split = textByLine.map(elem =>{
        return elem.match(regex);
    })
    // for every element in the array add a JS date object 
    split = split.map(elem =>{
        elem[1] = function(){
            let date = elem[1].split("/");
            return new Date(date[0] + " "+getMonth(date[1]) +" "+ date[2] + " "+ elem[2]); 
        }(); 
        return elem; 
    })
    console.log(Math.abs(split[0][1] - split[10][1]));
}

splitEachLine(); 




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