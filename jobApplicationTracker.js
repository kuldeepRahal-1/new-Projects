/**
 * add application //done
 * edit
 * delete //done
 * search company //done
 * filter status //done
 * sort by date
 * count each status
 * show total applications //done
 * save to localStorage //done
 * responsive UI //done
 */
let companyUl = document.getElementById("companyList");
let serchInp = document.getElementById("searchInp");
let filterData;
let applications = JSON.parse(localStorage.getItem("applications")) || [];
let companies = ["apple", "microsoft", "ibm"];
let companySelect = document.getElementById("Cselect");
let currU = "kuldeep"; //later we use real user by login
let apply = document.getElementById("applyBtn");
let roles = ["juniorDev", "senierDev", "clerk"];
let roleSelect = document.getElementById("selectR");
let applicationContainer = document.querySelector(".applicationC");
let adminContainer = document.getElementById("adminC");
let statusActive = true;
let toggleStatusBtn = document.getElementById("toogleStatusBtn");
let totalA = document.getElementById("totalApplicationShow");
//bluePrint to create applications
class Application {
  constructor(company, role) {
    this.id = uuidv4();
    this.company = company;
    this.role = role;
    this.date = new Date();
    this.status = true; //later we use it as active or deActive
    this.user = currU;
  }
}
//company rendering
function renderCompanies() {
  companySelect.innerHTML = "";
  companies.forEach((c) => {
    let option = document.createElement("option");
    option.innerText = c;
    option.value = c;
    companySelect.appendChild(option);
  });
}
//show company list
function showCompanies() {
  companyUl.innerHTML = "";
  filterData.forEach((c) => {
    let li = document.createElement("li");
    li.innerText = c;
    companyUl.appendChild(li);
  });
}
//search listner
serchInp.addEventListener("input", (e) => {
  let val = e.target.value.toLowerCase().trim();
  if (val === "") {
    filterData = companies;
  } else {
    filterData = companies.filter((c) => c.toLowerCase().includes(val));
  }
  showCompanies();
});
//apply
apply.addEventListener("click", () => {
  if (!companySelect.value) {
    alert("please select company first");
    return;
  }
  let role = roleSelect.value;
  let exist = applications.find(
    (a) => a.company === companySelect.value && a.user === currU,
  );
  if (exist) {
    alert("you already applied");
    return;
  }
  let newA = new Application(companySelect.value, role);
  applications.push(newA);
  localStorage.setItem("applications", JSON.stringify(applications));
  displayApplications();
  showAllApplications();
  totalA.innerText = applications.length;
});

//render roles
function renderRole() {
  roleSelect.innerHTML = "";
  roles.forEach((r) => {
    let opt = document.createElement("option");
    opt.value = r;
    opt.innerText = r;
    roleSelect.appendChild(opt);
  });
}

function displayApplications() {
  applicationContainer.innerHTML = "";
  applications.forEach((a) => {
    let card = document.createElement("div");
    card.innerHTML = `
        <p>${a.user}</p>
        <p>${a.company}</p>
        <p>${a.role}</p>
        `;
    let delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.innerText = "Delete";
    delBtn.dataset.applicationId = a.id;
    card.appendChild(delBtn);
    applicationContainer.appendChild(card);
  });
}

//delete application
applicationContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delBtn")) {
    let Id = e.target.dataset.applicationId;
    applications = applications.filter((a) => a.id !== Id);
    localStorage.setItem("applications", JSON.stringify(applications));
    displayApplications();
    showAllApplications();
    totalA.innerText = applications.length;
  }
});

//show applications to admin and toggle its status
function showAllApplications() {
  adminContainer.innerHTML = "";
  const visible = applications.filter((a) => a.status === statusActive);
  visible.forEach((a) => {
    let li = document.createElement("li");
    li.innerHTML = `
        <p>${a.user}</p>
        <p>${a.company}</p>
        <p>${a.role}</p>
        <h1>${a.status}</h1>
    `;
    let toggleBtn = document.createElement("button");
    toggleBtn.classList.add("toggle");
    toggleBtn.dataset.id = a.id;
    toggleBtn.innerText = "Toggle";
    li.appendChild(toggleBtn);
    adminContainer.appendChild(li);
  });
}

adminContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle")) {
    let aId = e.target.dataset.id;
    applications = applications.map((a) =>
      a.id === aId ? { ...a, status: !a.status } : a,
    );
    localStorage.setItem("applications", JSON.stringify(applications));
    showAllApplications();
  }
});

//toggle status
toggleStatusBtn.addEventListener("click", () => {
  statusActive = !statusActive;
  toggleStatusBtn.innerText = statusActive
    ? "Showing: Active"
    : "Showing: Inactive";
  showAllApplications();
});

totalA.innerText = applications.length;
filterData = companies;

showAllApplications();
displayApplications();
renderRole();
renderCompanies();
showCompanies();

//if i add login functionality later
const login = async (email, password) => {
  try {
    const res = await axios.post(
      "/api/auth/login",
      { email, password },
      { withCredentials: true },
    );
    currU = res.data.user.name;
  } catch (e) {
    if (e.response?.status === 401) {
      alert("Wrong email or password");
    } else {
      console.log(e);
    }
  }
};
