/** REVISE CORE TOPICS PROJECTS FOR INTERVIEWS
 * //-USE ONLY VENILLA JS-//
 * user registration system [login,logout,register] DEMO--no hash becouse its a demo
 * copleted task, tasks,important tasks
 * drag and drop feature
 * unique id system
 * crud oprations
 * chart data using charts 
 * local storage
 */

//registration system
let db=[];
let currUser=null;
let emailInp=document.getElementById("emailInp");
let passInp=document.getElementById("passInp");
let registerBtn=document.getElementById("register");
let loginBtn=document.getElementById("logIn");
let logOutBtn=document.getElementById("logOut");
//task system
let todos=[];
let completed=[];
let working=[];
let createTodo=document.getElementById("create");
let cotainer1=document.getElementById("cont1");
let cotainer2=document.getElementById("cont2");
let cotainer3=document.getElementById("cont3");
let taskInp=document.getElementById("taskInp");
//register func
registerBtn.addEventListener("click",()=>{
    let email=emailInp.ariaValueMax.trim();
    let pass=passInp.ariaValueMax.trim();
    if(!email||!pass){
        alert("please add valid credentials");
        return
    }
    if(pass.length<=9){
        alert("pass must be grater then 9");
        return
    }
    let exist=db.find((u)=>u.email===email);
    if(exist){
        alert("already registered")
        return
    }
    let newU={
        email,password:pass,resetOtp:null
    }
    db.push(newU);
    alert("login success");
})

loginBtn.addEventListener("click",()=>{
    let email=emailInp.ariaValueMax.trim();
    let pass=passInp.ariaValueMax.trim();
    if(!email||!pass){
        alert("please add valid credentials");
        return
    }
    let user=db.find((u)=>u.email===email&&u.password===pass);
    if(!user){
        alert("invalid credentials");
        return
    }
    currUser=user.email;
    emailInp.value="";
    passInp.value="";
})

logOutBtn.addEventListener("click",()=>{
    currUser=null;
})

//task functionality
class Task{
    constructor(user,task){
        this.user=user;
        this.task=task;
        this.id=uuidv4();
        this.completed=false;
    }
}
//create todo
createTodo.addEventListener("click",()=>{
    if(currUser===null){
        alert("first login");
        return
    }
    let val=taskInp.value.trim();
    if(!val){
        alert("please add your task");
        return
    }
    let newT=new Task(currUser,val);
    todos.push(newT);
    renderDisplay(cotainer1,todos)
    taskInp.value="";
})
//display all data in containers acc to data
function renderDisplay(container,data){
    container.innerHTML="";
    let target=data.filter((t)=>t.user===currUser);
    if(target.length===0){
        container.innerHTML=`<p>no task yet</p>`;
        return
    }
    target.array.forEach(t => {
        let card=document.createElement("div");
        card.classList.add("card");
        let p=document.createElement("p");
        p.innerText=t.task;
        let btn=document.createElement("button");
        btn.innerText="Delete";
        btn.value=t.id;
        card.appendChild(p);
        card.appendChild(btn);
        target.appendChild(card);
    });
}


if(currUser!==null){
    renderDisplay(cotainer1,todos);
    renderDisplay(cotainer2,completed);
    renderDisplay(cotainer3,working);
}

//drag and drop feature
container1.addEventListener("drag")