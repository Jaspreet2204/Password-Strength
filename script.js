

// ======================
// DOM ELEMENTS
// ======================

const passwordInput = document.getElementById("pwd");
const meter = document.getElementById("meterFill");
const rating = document.getElementById("rating-text");
const entropy = document.getElementById("entropyVal");
const crackTime = document.getElementById("crackVal");
const feed = document.getElementById("feed");

const scoreBox = document.getElementById("score");
const tipsBox = document.getElementById("tips");


let passwordHistory = [];

let total = 0;
let weak = 0;
let medium = 0;
let strong = 0;
let veryStrong = 0;

// ======================
// COMMON PASSWORD LIST
// ======================

const commonPasswords = [
"123456",
"12345678",
"password",
"admin",
"qwerty",
"abc123",
"welcome",
"football",
"letmein",
"dragon",
"111111",
"000000",
"password123",
"iloveyou",
"passw0rd",
"master",
"shadow",
"monkey",
"superman",
"batman"
];

// ======================
// SCORE SYSTEM
// ======================

let score = 0;

// ======================
// RESET
// ======================

function resetScore(){

score = 0;

}

// ======================
// LENGTH
// ======================

function lengthScore(password){

if(password.length >= 8)
score += 15;

if(password.length >= 12)
score += 15;

if(password.length >= 16)
score += 10;

}

// ======================
// LOWERCASE
// ======================

function lowercaseScore(password){

if(/[a-z]/.test(password))
score += 10;

}

// ======================
// UPPERCASE
// ======================

function uppercaseScore(password){

if(/[A-Z]/.test(password))
score += 10;

}

// ======================
// NUMBER
// ======================

function numberScore(password){

if(/[0-9]/.test(password))
score += 10;

}

// ======================
// SYMBOL
// ======================

function symbolScore(password){

if(/[^A-Za-z0-9]/.test(password))
score += 10;

}

// ======================
// BONUS
// ======================

function bonusScore(password){

if(
/[A-Z]/.test(password)
&&
/[a-z]/.test(password)
&&
/[0-9]/.test(password)
&&
/[^A-Za-z0-9]/.test(password)
){

score += 20;

}

}

// ======================
// PENALTY
// ======================

function penalty(password){

if(commonPasswords.includes(password.toLowerCase()))
score = 0;

if(password.length < 6)
score = Math.max(score-20,0);

if(/(.)\1\1/.test(password))
score -= 10;

if(/123|abc|qwerty/i.test(password))
score -= 15;

}

// ======================
// ENTROPY
// ======================

function calculateEntropy(password){

let pool = 0;

if(/[a-z]/.test(password))
pool += 26;

if(/[A-Z]/.test(password))
pool += 26;

if(/[0-9]/.test(password))
pool += 10;

if(/[^A-Za-z0-9]/.test(password))
pool += 32;

if(pool===0)
return 0;

return (
password.length *
Math.log2(pool)
).toFixed(2);

}

// ======================
// CRACK TIME
// ======================

function estimateCrack(bits){

bits = Number(bits);

const guesses = Math.pow(2,bits);

const speed = 10000000000;

const seconds = guesses/speed;

if(seconds < 60)
return "Few Seconds";

if(seconds < 3600)
return Math.floor(seconds/60)+" Minutes";

if(seconds < 86400)
return Math.floor(seconds/3600)+" Hours";

if(seconds < 31536000)
return Math.floor(seconds/86400)+" Days";

return Math.floor(seconds/31536000)+" Years";

}

// ======================
// RATING
// ======================

function getRating(){

if(score<25)
return "WEAK";

if(score<50)
return "MEDIUM";

if(score<75)
return "STRONG";

return "VERY STRONG";

}

// ======================
// COLOR
// ======================

function getColor(){

if(score<25)
return "#ff3b3b";

if(score<50)
return "#ffb454";

if(score<75)
return "#00ff99";

return "#00e676";

}

// ======================
// METER
// ======================

function updateMeter(){

meter.style.width = score+"%";

meter.style.background = getColor();

rating.innerHTML = getRating();

rating.style.color = getColor();

}


// ======================
// PASSWORD SUGGESTIONS
// ======================

function showSuggestions(password){

let tips=[];

if(password.length<12)
tips.push("✔ Use at least 12 characters");

if(!/[A-Z]/.test(password))
tips.push("✔ Add an Uppercase Letter");

if(!/[a-z]/.test(password))
tips.push("✔ Add a Lowercase Letter");

if(!/[0-9]/.test(password))
tips.push("✔ Add a Number");

if(!/[^A-Za-z0-9]/.test(password))
tips.push("✔ Add a Special Character");

if(commonPasswords.includes(password.toLowerCase()))
tips.push("✔ Avoid Common Passwords");

if(tipsBox){

tipsBox.innerHTML=tips.join("<br>");

}

}



// ======================
// TERMINAL OUTPUT
// ======================

function log(message,color="#00ff99"){

if(!feed) return;

const div=document.createElement("div");

div.className="line";

div.style.color=color;

div.innerHTML="> "+message;

feed.prepend(div);

while(feed.children.length>8){

feed.removeChild(feed.lastChild);

}

}

// ======================
// PASSWORD HISTORY
// ======================

let history = passwordHistory;

function saveHistory(password){

if(password==="") return;

history.unshift(password);

if(history.length>5){

history.pop();

}

localStorage.setItem(

"passwordHistory",

JSON.stringify(history)

);

}

function updateHistory(password) {
    passwordHistory.unshift(password);

    const historyBox = document.getElementById("passwordHistory");

    historyBox.innerHTML = "";

    passwordHistory.forEach((pass, index) => {
        historyBox.innerHTML += `
            <p>${index + 1}. ${"*".repeat(pass.length)}</p>
        `;
    });
}

// ======================
// LOAD HISTORY
// ======================

function loadHistory(){

const data=localStorage.getItem(

"passwordHistory"

);

if(data){

history=JSON.parse(data);

}

}

loadHistory();

// ======================
// COPY BUTTON
// ======================

const copyBtn=document.getElementById("copyBtn");

if(copyBtn){

copyBtn.onclick=async()=>{

if(passwordInput.value==="") return;

await navigator.clipboard.writeText(

passwordInput.value

);

copyBtn.innerHTML="Copied ✓";

setTimeout(()=>{

copyBtn.innerHTML="Copy";

},1500);

};

}

// ======================
// SHOW / HIDE
// ======================

const toggle=document.getElementById("toggleShow");

if(toggle){

toggle.onclick=()=>{

if(passwordInput.type==="password"){

passwordInput.type="text";

toggle.innerHTML="Hide";

}

else{

passwordInput.type="password";

toggle.innerHTML="Show";

}

};

}

// ======================
// PASSWORD GENERATOR
// ======================

const upper="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const lower="abcdefghijklmnopqrstuvwxyz";

const numbers="0123456789";

const symbols="!@#$%^&*()_+-=";

function random(str){

return str[Math.floor(Math.random()*str.length)];

}

function generatePassword(length=16){

let pass="";

pass+=random(upper);

pass+=random(lower);

pass+=random(numbers);

pass+=random(symbols);

const all=

upper+

lower+

numbers+

symbols;

while(pass.length<length){

pass+=random(all);

}

return pass
.split("")
.sort(()=>Math.random()-0.5)
.join("");

}

// ======================
// GENERATE BUTTON
// ======================

const genBtn=document.getElementById("genBtn");

if(genBtn){

genBtn.onclick=()=>{

passwordInput.value=

generatePassword(16);

analyzePassword();

};

}

// ======================
// CLEAR BUTTON
// ======================

const clearBtn=document.getElementById("clearBtn");

if(clearBtn){

clearBtn.onclick=()=>{

passwordInput.value="";

meter.style.width="0%";

rating.innerHTML="--";

entropy.innerHTML="0 Bits";

crackTime.innerHTML="--";

feed.innerHTML="";

};

}

// ======================
// MAIN ANALYZE
// ======================

function analyzePassword(){

const password=passwordInput.value;

resetScore();

lengthScore(password);

uppercaseScore(password);

lowercaseScore(password);

numberScore(password);

symbolScore(password);

bonusScore(password);

penalty(password);

updateMeter();

const bits=

calculateEntropy(password);

entropy.innerHTML=

bits+" Bits";

crackTime.innerHTML=

estimateCrack(bits);

showSuggestions(password);

saveHistory(password);

log(

"Password Checked",

getColor()

);

}

passwordInput.addEventListener(

"input",

analyzePassword

);



// ======================
// MATRIX RAIN EFFECT
// ======================

const matrixCanvas = document.getElementById("matrix");

const ctx = matrixCanvas.getContext("2d");

matrixCanvas.style.position = "fixed";
matrixCanvas.style.left = "0";
matrixCanvas.style.top = "0";
matrixCanvas.style.width = "100%";
matrixCanvas.style.height = "100%";
matrixCanvas.style.zIndex = "-1";
matrixCanvas.style.opacity = "0.08";

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const letters =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*";

const fontSize = 16;

const columns = Math.floor(
matrixCanvas.width / fontSize
);

const drops = [];

for(let i=0;i<columns;i++){

drops[i]=1;

}

function drawMatrix(){

ctx.fillStyle="rgba(0,0,0,0.08)";
ctx.fillRect(
0,
0,
matrixCanvas.width,
matrixCanvas.height
);

ctx.fillStyle="#00ff66";
ctx.font=fontSize+"px monospace";

for(let i=0;i<drops.length;i++){

const text=
letters[
Math.floor(
Math.random()*letters.length
)
];

ctx.fillText(

text,

i*fontSize,

drops[i]*fontSize

);

if(

drops[i]*fontSize>

matrixCanvas.height

&&

Math.random()>0.97

){

drops[i]=0;

}

drops[i]++;

}

}

setInterval(drawMatrix,40);

// ======================
// WINDOW RESIZE
// ======================

window.addEventListener(

"resize",

()=>{

matrixCanvas.width=window.innerWidth;

matrixCanvas.height=window.innerHeight;

}

);

// ======================
// TYPING GLOW
// ======================

passwordInput.addEventListener(

"keyup",

()=>{

passwordInput.style.boxShadow=

"0 0 20px #00ff99";

setTimeout(()=>{

passwordInput.style.boxShadow="none";

},150);

}

);

// ======================
// BUTTON HOVER
// ======================

document

.querySelectorAll("button")

.forEach(btn=>{

btn.addEventListener(

"mouseenter",

()=>{

btn.style.transform="scale(1.05)";

}

);

btn.addEventListener(

"mouseleave",

()=>{

btn.style.transform="scale(1)";

}

);

});

// ======================
// SOUND EFFECT
// ======================

let beep;

try{

beep=new Audio("click.mp3");

}catch(e){}

document

.querySelectorAll("button")

.forEach(btn=>{

btn.addEventListener(

"click",

()=>{

if(beep){

beep.currentTime=0;

beep.play().catch(()=>{});

}

}

);

});

// ======================
// CLOCK
// ======================

function updateClock(){

const now=new Date();

const time=

now.toLocaleTimeString();

const clock=

document.getElementById("clock");

if(clock){

clock.innerHTML=time;

}

}

setInterval(updateClock,1000);

// ======================
// RANDOM SECURITY TIPS
// ======================

const tips=[

"Use unique passwords.",

"Enable 2FA.",

"Never reuse passwords.",

"Avoid personal information.",

"Update passwords regularly.",

"Use password manager.",

"Never share passwords.",

"Check breach history."

];

function randomTip(){

const box=

document.getElementById("securityTip");

if(box){

box.innerHTML=

tips[

Math.floor(

Math.random()*tips.length

)

];

}

}

setInterval(randomTip,5000);

// ======================
// PASSWORD LENGTH
// ======================

passwordInput.addEventListener(

"input",

()=>{

const len=

document.getElementById("length");

if(len){

len.innerHTML=

passwordInput.value.length;

}

}

);

// ======================
// AUTO ANALYZE
// ======================

setInterval(()=>{

if(passwordInput.value!=""){

analyzePassword();

}

},3000);

// ======================
// STARTUP
// ======================

log("Advanced Password Checker Loaded","#00ff99");

randomTip();

updateClock();


// ======================
// HAVE I BEEN PWNED API
// ======================

const breachBtn =
document.getElementById("breachBtn");

const breachRow =
document.getElementById("breachRow");

const breachStatus =
document.getElementById("breachStatus");

// SHA-1 HASH
async function sha1(text){

const buffer =
await crypto.subtle.digest(
"SHA-1",
new TextEncoder().encode(text)
);

return Array
.from(new Uint8Array(buffer))
.map(b=>b.toString(16).padStart(2,"0"))
.join("")
.toUpperCase();

}

// BREACH CHECK
async function checkBreach(password){

if(password==="") return;

breachRow.style.display="flex";

breachStatus.innerHTML=
"Checking...";

breachStatus.style.color="#ffb454";

try{

const hash=
await sha1(password);

const prefix=
hash.substring(0,5);

const suffix=
hash.substring(5);

const response=
await fetch(
"https://api.pwnedpasswords.com/range/"+prefix
);

const result=
await response.text();

const found=
result
.split("\r\n")
.find(line=>
line.startsWith(suffix)
);

if(found){

const count=
found.split(":")[1];

breachStatus.innerHTML=
"⚠ Found in "+
Number(count).toLocaleString()+
" data breaches";

breachStatus.style.color="#ff3b3b";

log(
"Password leaked!",
"#ff3b3b"
);

}else{

breachStatus.innerHTML=
"✔ Safe (Not Found)";

breachStatus.style.color="#00ff99";

log(
"Password safe",
"#00ff99"
);

}

}catch(e){

breachStatus.innerHTML=
"Network Error";

breachStatus.style.color=
"orange";

}

}

// BUTTON
if(breachBtn){

breachBtn.onclick=()=>{

checkBreach(

passwordInput.value

);

};

}

// ======================
// EXPORT REPORT
// ======================

const exportBtn=
document.getElementById("exportBtn");

function exportReport(){

const report=`

Password Report

--------------------

Password Length :
${passwordInput.value.length}

Strength :
${rating.innerHTML}

Entropy :
${entropy.innerHTML}

Estimated Crack Time :
${crackTime.innerHTML}

Generated :
${new Date()}

`;

const blob=
new Blob(
[report],
{
type:"text/plain"
}
);

const url=
URL.createObjectURL(blob);

const a=
document.createElement("a");

a.href=url;

a.download=
"Password_Report.txt";

a.click();

URL.revokeObjectURL(url);

}

if(exportBtn){

exportBtn.onclick=
exportReport;

}

// ======================
// THEME SWITCHER
// ======================

const themeBtn=
document.getElementById("themeBtn");

let dark=true;

if(themeBtn){

themeBtn.onclick=()=>{

dark=!dark;

if(dark){

document.body.style.background=
"#0a0c10";

document.body.style.color=
"#ffffff";

}else{

document.body.style.background=
"#ffffff";

document.body.style.color=
"#000000";

}

};

}

// ======================
// PASSWORD STATISTICS
// ======================

let checked = 0;

function updateStats(){

checked++;

switch(

rating.innerHTML

){

case "WEAK":

weak++;

break;

case "MEDIUM":

medium++;

break;

case "STRONG":

strong++;

break;

case "VERY STRONG":

veryStrong++;

break;

}

console.table({

Checked:checked,

Weak:weak,

Medium:medium,

Strong:strong,

VeryStrong:veryStrong

});

}

function updateStats(level) {

    total++;

    if(level === "Weak") weak++;
    else if(level === "Medium") medium++;
    else if(level === "Strong") strong++;
    else if(level === "Very Strong") veryStrong++;

    document.getElementById("totalChecked").textContent = total;
    document.getElementById("weakCount").textContent = weak;
    document.getElementById("mediumCount").textContent = medium;
    document.getElementById("strongCount").textContent = strong;
    document.getElementById("veryStrongCount").textContent = veryStrong;
}


// AUTO UPDATE
passwordInput.addEventListener(

"change",

updateStats

);

// ======================
// STARTUP MESSAGE
// ======================

console.log(
"Advanced Password Checker Ready"
);

log(
"All modules loaded ✔",
"#00ff99"
);

window.addEventListener("load", () => {
    const loading = document.getElementById("loadingScreen");
    if (loading) {
        loading.style.display = "none";
    }
});