var texts = [
    "Desenvolvedor Web",
    "Designer Web",
];

var textIndex = 0;
var charIndex = 0;
var textElement = document.getElementById("text-animation");

function type(){
    if(charIndex < texts[textIndex].length){
        textElement.innerHTML += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase(){
    if(charIndex > 0){
        textElement.innerHTML = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textIndex++;
        if(textIndex >= texts.length) textIndex = 0;
        setTimeout(type, 500);
    }
}

setTimeout(type, 500);