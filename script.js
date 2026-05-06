// ===============================
// GLOBAL STORAGE
// ===============================
let students = JSON.parse(localStorage.getItem("students")) || [];

// ===============================
// SUBMIT DATA (MAIN SYSTEM)
// ===============================
function submitData() {

    let name = document.getElementById("name")?.value.trim();
    let company = document.getElementById("company")?.value.trim();
    let role = document.getElementById("role")?.value;
    let pkg = document.getElementById("package")?.value;
    let skills = document.getElementById("skills")?.value.trim();

    if (!name || !role || !skills) {
        alert("Please fill all required fields!");
        return;
    }

    if (pkg && pkg < 0) {
        alert("Package cannot be negative!");
        return;
    }

    let student = { name, company, role, pkg, skills };

    students.unshift(student);
    localStorage.setItem("students", JSON.stringify(students));

    renderStudents();
    clearForm();
}

// ===============================
// CLEAR FORM
// ===============================
function clearForm(){
    ["name","company","role","package","skills"].forEach(id=>{
        let el = document.getElementById(id);
        if(el) el.value = "";
    });
}

// ===============================
// RENDER STUDENTS
// ===============================
function renderStudents() {

    let container = document.getElementById("results");
    if (!container) return;

    let output = "";

    students.forEach((s, index) => {

        let connections = students.filter((o, i) => i !== index && o.role === s.role);

        let searchQuery = encodeURIComponent(s.role + " developer");

        let connectionHTML = "";

        if (connections.length > 0) {
            connectionHTML = `
                <div class="connections">
                    <b>🔗 People in same field:</b>
                    ${connections.map(c => `
                        <a href="https://www.linkedin.com/search/results/people/?keywords=${searchQuery}" target="_blank">
                            ${c.name}
                        </a>
                    `).join("")}
                </div>
            `;
        } else {
            connectionHTML = `
                <div class="connections">
                    <b>🌐 Explore professionals:</b>
                    <a href="https://www.linkedin.com/search/results/people/?keywords=${searchQuery}" target="_blank">
                        Find ${s.role} Developers on LinkedIn
                    </a>
                </div>
            `;
        }

        output += `
            <div class="card">
                <span class="delete-btn" onclick="deleteCard(${index})">✖</span>

                <h3>${s.name}</h3>
                <p><b>Company:</b> ${s.company || "N/A"}</p>
                <p><b>Role:</b> ${s.role}</p>
                <p><b>Package:</b> ${s.pkg || "N/A"} LPA</p>
                <p><b>Skills:</b> ${s.skills}</p>

                ${connectionHTML}
            </div>
        `;
    });

    container.innerHTML = output;

    let count = document.getElementById("count");
    if(count){
        count.innerText = students.length ? `Total: ${students.length}` : "";
    }
}

// ===============================
// DELETE CARD
// ===============================
function deleteCard(index){
    students.splice(index,1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
}

// ===============================
// SKILL ANALYZER (analyze.html)
// ===============================
function analyze(){

    let input = document.getElementById("skills");
    let resultBox = document.getElementById("result");

    if(!input || !resultBox) return;

    let skills = input.value.toLowerCase();

    let result = "";

    if(skills.includes("python") || skills.includes("ml")){
        result = "🔥 High demand in AI/ML roles!";
    } 
    else if(skills.includes("html") || skills.includes("css") || skills.includes("js")){
        result = "🌐 Good for Web Development!";
    } 
    else if(skills.includes("java") || skills.includes("c++")){
        result = "💻 Strong for Software Development roles!";
    }
    else {
        result = "⚠️ Add more technical skills to improve placement chances.";
    }

    resultBox.innerText = result;
}

// ===============================
// CONNECTION SEARCH PAGE
// ===============================
function findConnections(){

    let input = document.getElementById("skill");
    let list = document.getElementById("list");

    if(!input || !list) return;

    let skill = input.value.toLowerCase();

    list.innerHTML = "";

    let filtered = students.filter(s => 
        s.skills.toLowerCase().includes(skill)
    );

    if(filtered.length === 0){
        list.innerHTML = "<li>No matching students found</li>";
        return;
    }

    filtered.forEach(s => {
        let li = document.createElement("li");
        li.innerText = `${s.name} (${s.role})`;
        list.appendChild(li);
    });
}

// ===============================
// AI SUGGESTIONS (improve.html)
// ===============================
function suggest(){

    let field = document.getElementById("field");
    let output = document.getElementById("tips");

    if(!field || !output) return;

    let value = field.value;

    let tips = "";

    if(value === "web"){
        tips = "Learn React, build projects, deploy on GitHub, and master JavaScript.";
    }
    else if(value === "ai"){
        tips = "Learn Python, ML, Deep Learning, and build real-world AI projects.";
    }
    else{
        tips = "Focus on DSA, problem solving, and practice on LeetCode.";
    }

    output.innerText = tips;
}

// ===============================
// AUTO LOAD
// ===============================
window.onload = function(){
    renderStudents();
};