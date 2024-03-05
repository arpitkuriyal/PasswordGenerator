const passwordDisplay=document.querySelector("[dataPasswordDisplay]");
const inputSlider=document.querySelector("[dataLengthSlider]");
const copyMsg=document.querySelector("[data-copyMsg]")
const copyBtn=document.querySelector("[dataCopy]");
const lengthDisplay=document.querySelector("[dataLengthNumber]");
const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("#dataIndicator");
const genrateBtn=document.querySelector(".generateButton")
const allCheckBox=Array.from(document.querySelectorAll("input[type=checkbox]"));
const symbols="!@#$%^&*()_+{}~`?/,<>;:'][=-";
let password="";
let password_length=10;
let checkcount=0
getIndicator("#000000")
function handleSlider(){
    inputSlider.value=password_length;
    lengthDisplay.innerText=password_length;

}
handleSlider();
function getIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 3px ${color}`;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((password_length-min)*100/(max-min))+"%100%"
}
function getRndInteger(min,max){
    return parseInt(Math.floor(Math.random()*(max-min)+min));
    //max-min give us the no. btw 0,max-min where max-min is exclusive we add min now we get the no. btw (min , max) we use floor to round off the value
}
function generateRandomNumber() {
  return getRndInteger(0,9);
}

function generateLowerCase() {  
     return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
  return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
function calStrength(){
    hasUpper=false;
    hasLower=false;
    hasNumber=false;
    hasSym=false;
    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNumber=true;
    if(symbolCheck.checked) hasSym=true;
    
    if (hasUpper && hasLower && (hasNumber || hasSym) && password_length >= 8) {
      getIndicator("#00ff00");
    } 
    else if ((hasLower || hasUpper) &&(hasNumber || hasSym) && password_length >= 6) {
      getIndicator("#ff0000");
    }
    else {
      getIndicator("#ffffff");
    }
}
async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value)
    copyMsg.innerHTML="copied"
  }
  catch(e){
    copyMsg.innerHTML="failed"
  }
  copyMsg.classList.add("active");
  setTimeout( ()=>{
    copyMsg.classList.remove("active")
  },2000)

}
inputSlider.addEventListener('input',(e)=>{
  password_length=e.target.value
  handleSlider();
})
copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value){
    copyContent();
  }
})
function handleCheckBoxChange(){
  checkcount=0;
  (allCheckBox).forEach((checkBox)=>{
    if(checkBox.checked)
    checkcount++;
  });

  if (password_length<checkcount){
    password_length=checkcount;
    handleSlider();
  }
}
allCheckBox.forEach( (checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})

genrateBtn.addEventListener('click',()=>{

  if(checkcount==0){
  

    return ;
  }
  if(checkcount>password_length){
    checkcount=password_length;
    handleSlider()
  }
  password="";


  let funcArr = [];

  if(upperCaseCheck.checked)
      funcArr.push(generateUpperCase);

  if(lowerCaseCheck.checked)
      funcArr.push(generateLowerCase);

  if(numberCheck.checked)
      funcArr.push(generateRandomNumber);

  if(symbolCheck.checked)
      funcArr.push(generateSymbol);

  //compulsory addition
  for(let i=0; i<funcArr.length; i++) {
      password += funcArr[i]();
  }
  console.log("COmpulsory adddition done");

  //remaining adddition
  for(let i=0; i<password_length-funcArr.length; i++) {
      let randIndex = getRndInteger(0 , funcArr.length);
      console.log("randIndex" + randIndex);
      password += funcArr[randIndex]();
  }

  password=shufflePassword(Array.from(password));

  passwordDisplay.value=password;

  calStrength();
})
