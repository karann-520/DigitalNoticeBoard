const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const publishBtn = document.getElementById("publishBtn");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const categoryInput = document.getElementById("category");
const publishDateInput = document.getElementById("publishDate");
const expiryDateInput = document.getElementById("expiryDate");

const noticeBoard = document.getElementById("noticeBoard");
const scheduledBoard = document.getElementById("scheduledBoard");

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

let notices = JSON.parse(localStorage.getItem("notices")) || [];
let editId = null;


/* LOGIN */

loginBtn.onclick = function(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(username === ADMIN_USER && password === ADMIN_PASS){

loginSection.classList.add("hidden");
dashboardSection.classList.remove("hidden");

renderNotices();

}else{

alert("Invalid Username or Password");

}

};


/* LOGOUT */

logoutBtn.onclick = function(){

dashboardSection.classList.add("hidden");
loginSection.classList.remove("hidden");

};


/* PUBLISH NOTICE */

publishBtn.onclick = function(){

const title = titleInput.value.trim();
const content = contentInput.value.trim();
const category = categoryInput.value;
const publishDate = publishDateInput.value;
const expiryDate = expiryDateInput.value;

if(!title || !content || !publishDate || !expiryDate){

alert("Fill all fields");
return;

}

if(expiryDate < publishDate){

alert("Expiry date must be after publish date");
return;

}

if(editId !== null){

notices = notices.map(n =>
n.id === editId ? {id:editId,title,content,category,publishDate,expiryDate} : n
);

editId = null;
publishBtn.textContent="Publish Notice";

}else{

notices.unshift({
id:Date.now(),
title,
content,
category,
publishDate,
expiryDate
});

}

localStorage.setItem("notices",JSON.stringify(notices));

clearForm();
renderNotices();

};


/* RENDER NOTICES */

function renderNotices(){

noticeBoard.innerHTML="";
scheduledBoard.innerHTML="";

const today = new Date().toISOString().split("T")[0];

notices = notices.filter(n=>today<=n.expiryDate);

localStorage.setItem("notices",JSON.stringify(notices));

notices.forEach(n=>{

const div = document.createElement("div");

if(today < n.publishDate){

div.className="scheduled-card";
scheduledBoard.appendChild(div);

}else{

div.className="notice-card";
noticeBoard.appendChild(div);

}

div.innerHTML=`
<h4>${n.title}</h4>
<small>${n.category} | Publish: ${n.publishDate} | Expire: ${n.expiryDate}</small>
<p>${n.content}</p>
<button onclick="editNotice(${n.id})">Edit</button>
<button onclick="deleteNotice(${n.id})">Delete</button>
`;

});

if(noticeBoard.innerHTML===""){
noticeBoard.innerHTML="<p>No Live Notices</p>";
}

if(scheduledBoard.innerHTML===""){
scheduledBoard.innerHTML="<p>No Scheduled Notices</p>";
}

}


/* EDIT NOTICE */

function editNotice(id){

const notice = notices.find(n=>n.id===id);

titleInput.value = notice.title;
contentInput.value = notice.content;
categoryInput.value = notice.category;
publishDateInput.value = notice.publishDate;
expiryDateInput.value = notice.expiryDate;

editId = id;

publishBtn.textContent="Update Notice";

window.scrollTo({
top:0,
behavior:"smooth"
});

}


/* DELETE NOTICE */

function deleteNotice(id){

notices = notices.filter(n=>n.id!==id);

localStorage.setItem("notices",JSON.stringify(notices));

renderNotices();

}


/* CLEAR FORM */

function clearForm(){

titleInput.value="";
contentInput.value="";
categoryInput.value="General";
publishDateInput.value="";
expiryDateInput.value="";

}
