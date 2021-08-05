window.onload = function(){
let fullname=document.getElementById("name");
let emailAdd=document.getElementById("email");
let contactNum=document.getElementById("number");
let form=document.querySelector("form");
document.querySelector(".submit-btn").addEventListener("click",()=>{
    event.preventDefault();
    validateInput();
});
};


function validateInput(){
    let fullname=document.getElementById("name");
    let emailAdd=document.getElementById("email");
    let contactNum=document.getElementById("number");
    if(fullname.value.trim()===""){
        onError(fullname,"Please enter your full name");
    }else{
        onSuccess(fullname);
    }
    if(emailAdd.value.trim()===""){
        onError(emailAdd,"Please enter your email address");
    }else{
        if(!isValidEmail(emailAdd.value.trim())){
            onError(email,"Invalid Email");
        }else{
            onSuccess(emailAdd);
        }
    }
    if(contactNum.value.trim()===""){
        onError(contactNum,"Please enter your number");
    }else{
        onSuccess(contactNum);
    }
}

function onError(input,message){
    let parent=input.parentElement;
    let messageEle=parent.querySelector("small");
    messageEle.style.visibility="visible";
    messageEle.innerText=message;
    parent.classList.remove("success");
    parent.classList.add("error");
}

function onSuccess(input){
    let parent=input.parentElement;
    let messageEle=parent.querySelector("small");
    messageEle.style.visibility="hidden";
    messageEle.innerText="";
    parent.classList.remove("error");
    parent.classList.add("success");
};

function isValidEmail(email){
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
