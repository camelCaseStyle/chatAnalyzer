module.exports = {
    MONTHS : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    IGNORE_KEYWORDS : ["😊", "🤣","😀","👍","😂","that","am","have","Haha", "was",":)","?","haha","it","so","in","is" ,"for", "of", "a","and", "to", "are", "I", "you", "!", "image", "the", "omitted", "image", "video"],
    REGEX : new RegExp(/\[(\d+\/\d+\/\d+),\s+(\d+:\d+:\d+\s+[a|p]m)\]\s([a-zA-Z'-\s]+):\s(.+)/),
    DATE : 1,
    NAME : 3, 
    MESSAGE : 4,
}