/**
 * crud opration on todos
 * login system [register,login,logout] //done
 * store in localStorage
 * image file handle //done
 */

let registerBtn = document.getElementById(
  "RegisterBtn",
) as HTMLInputElement | null;
let logOut = document.getElementById("logout") as HTMLInputElement | null;
let login = document.getElementById("login") as HTMLInputElement | null;

let emailInp = document.getElementById("emailInp") as HTMLInputElement | null;
let passwordInp = document.getElementById("passInp") as HTMLInputElement | null;
let imageInp = document.getElementById("imageInp") as HTMLInputElement | null;

let currU: Users | null = null;


let taskInp=document.getElementById("taskInp") as HTMLInputElement |null;
let addTodo=document.getElementById("addTodo") as HTMLInputElement |null;
let categSelect=document.getElementById("selectCateg") as HTMLInputElement;
let categorys: string[]=["fun","important","casual"];
let todoCont=document.getElementById("cont") as HTMLElement;

type Todos={
  user:string;
  task:string;
  id:string;
  complete:boolean;
  category:string;
}
type Users = {
  email: string;
  password: string;
  image: string;
};
//database and todos [memory]
let db: Users[] = [];
let todos :Todos[]=[];

//bluePrint like schema in mongoDb dataBase
class Person implements Users {
  email: string;
  password: string;
  image: string;

  constructor(email: string, password: string, image: string) {
    this.email = email;
    this.password = password;
    this.image = image;
  }
}

class Todo implements Todos{
  user:string;
  task:string;
  id:string;
  complete:boolean;
  category:string;
  constructor(user:string,task:string,category:string){
    this.user=user;
    this.task=task;
    this.id=uuidv4();
    this.complete=false;
    this.category=category;
  }
}
//registration
registerBtn?.addEventListener("click", async () => {
  let email = emailInp?.value?.trim();
  let pass = passwordInp?.value?.trim();
  let image = imageInp?.files?.[0];
  let publicId: string = "";
  if (!email || !pass || !image) {
    alert("please add valid data");
    return;
  }
  let exist = db.find((u) => u.email === email);
  if (exist) {
    alert("already available");
    return;
  }
  let formData = new FormData();
  formData.append("email", email);
  formData.append("image", image);
  try {
    let res = await cloudnery.uploder.uplode(formData);
    if (res.status === 200) {
      publicId = res.data.public_id;
      let newU = new Person(email, pass, publicId);
      db.push(newU);
    }
  } catch (e) {
    console.log(e);
  }
});
//login
login?.addEventListener("click", () => {
  let email = emailInp?.value?.trim();
  let pass = passwordInp?.value?.trim();

  if (!email || !pass) {
    alert("please enter email and password");
    return;
  }

  let found = db.find((u) => u.email === email && u.password === pass);
  if (found) {
    currU = found;
    alert("Login successful!");
    console.log("Current user:", currU);
  } else {
    alert("Invalid credentials");
  }
});
//logout
logOut?.addEventListener("click", () => {
  currU = null;
  alert("Logged out successfully!");
});


function renderCateg(){
  categSelect.innerHTML="";
  categorys.forEach((c)=>{
    let opt=document.createElement("option");
    opt.innerText=c;
    opt.value=c;
    categSelect.appendChild(opt);
  })
}


//addTodo
addTodo?.addEventListener("click",()=>{
  if(currU===null){
    alert("please login first");
    return
  }
  let t=taskInp?.value.trim();
  let c=categSelect.value;
  if(!t||!c){
    alert("no task found")
    return
  }
  let newT=new Todo(currU.email,t,c);
  todos.push(newT);
})


function displayTodos(){
  todoCont.innerHTML="";
  if(currU===null)return;
  let uTodos=todos.filter((t)=>t.user===currU?.email);
  if(uTodos.length>=1){
    uTodos.forEach((t)=>{
       let card=document.createElement("div");
       card.innerHTML=`
         <h1>${t?.user}</h1>
         <h1>${t?.task}</h1>
         <h1>${t?.complete?"done":"notDone"}</h1>
         <h1>${t?.category}</h1>
       `
       let deleteBtn=document.createElement("button");
       deleteBtn.innerText="Delete";
       deleteBtn.dataset.id=t.id;
       deleteBtn.classList.add("del");

       let toggleBtn=document.createElement("button");
       toggleBtn.innerText=t?.complete?"not":"yes";
       toggleBtn.dataset.id=t?.id;
       toggleBtn.classList.add("toggle");

       card.appendChild(deleteBtn);
       card.appendChild(toggleBtn);
       todoCont.appendChild(card);
    })
  }
}


todoCont?.addEventListener("click",(e)=>{
 //delete and toggle functionality here 
 if(e.target instanceof HTMLElement){
  if(e.target.classList.contains("del")){
    let todoId=e.target.dataset.id;
    todos=todos.filter((t)=>t.id!==todoId);
    displayTodos();
  }else if(e.target.classList.contains("toggle")){
    let todoId=e.target.dataset.id;
    todos=todos.map((t)=>t.id===todoId?{...t,complete:!t.complete}:t)
  }
 }
})

//initial call
renderCateg();
displayTodos();