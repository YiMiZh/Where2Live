document.addEventListener("touchstart", function(){}, true);
let urls="";


function sendToPage(){
    console.log("ok");
    if(2!=1){
        window.location.href="search.html";
        window.event.returnValue=false;
    }
}
