// TASK 1: LOAD DATA FROM LOCALSTORAGE
let students = JSON.parse(localStorage.getItem("students")) || [];

// TASK 2: CALCULATE GRADE
function getGrade(average) {
  if (average >= 80) {
    return "A+";
  } else if (average >= 70) {
    return "A";
  } else if (average >= 60) {
    return "A-";
  } else if (average >= 50) {
    return "B";
  } else if (average >= 40) {
    return "C";
  } else {
    return "F";
  }
}

// TASK 3: SAVE DATA TO LOCALSTORAGE
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

// TASK 4: ADD A NEW STUDENT RESULT
function addStudent(event) {
  event.preventDefault();

  let studentName = document.getElementById("studentName").value.trim();
  let studentId = document.getElementById("studentId").value.trim();
  let english = document.getElementById("english").value;
  let math = document.getElementById("math").value;
  let computer = document.getElementById("computer").value;
  let message = document.getElementById("message");

  if (studentName === "" || studentId === "" || english === "" || math === "" || computer === "") {
    message.textContent = "Please fill in all fields.";
    return;
  }

  english = Number(english);
  math = Number(math);
  computer = Number(computer);

  if (!Number.isFinite(english) || !Number.isFinite(math) || !Number.isFinite(computer) || english < 0 || english > 100 || math < 0 || math > 100 || computer < 0 || computer > 100) {
    message.textContent = "Marks must be between 0 and 100.";
    return;
  }

  let exists = students.find(function (student) {
    return student.id.toLowerCase() === studentId.toLowerCase();
  });

  if (exists) {
    message.textContent = "This Student ID already exists.";
    return;
  }

  let marks = [english, math, computer];
  let total = marks.reduce((sum, mark) => sum + mark, 0);
  let average = total / marks.length;
  let grade = getGrade(average);

  let student = {
    name: studentName,
    id: studentId,
    marks: marks,
    total: total,
    average: average,
    grade: grade
  };

  students.push(student);
  saveData();
  document.getElementById("resultForm").reset();
  message.textContent = "Student result added successfully!";
  displayStudents();
}

// TASK 5: DISPLAY STUDENT RESULTS
function displayStudents() {
  let tableBody = document.getElementById("resultTable");
  tableBody.innerHTML = "";

  let searchText = document.getElementById("searchInput").value.toLowerCase();
  let selectedGrade = document.getElementById("gradeFilter").value;

  let filteredStudents = students.filter(function (student) {
    let matchSearch = student.name.toLowerCase().includes(searchText) || student.id.toLowerCase().includes(searchText);
    let matchGrade = selectedGrade === "All" || student.grade === selectedGrade;
    return matchSearch && matchGrade;
  });

  filteredStudents.forEach(function (student) {
    let row = document.createElement("tr");

    let nameCell = document.createElement("td");
    nameCell.textContent = student.name;

    let idCell = document.createElement("td");
    idCell.textContent = student.id;

    let totalCell = document.createElement("td");
    totalCell.textContent = student.total;

    let averageCell = document.createElement("td");
    averageCell.textContent = student.average.toFixed(2);

    let gradeCell = document.createElement("td");
    gradeCell.textContent = student.grade;

    let actionCell = document.createElement("td");

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", function () {
      deleteStudent(student.id);
    });

    actionCell.appendChild(deleteBtn);
    row.append(nameCell, idCell, totalCell, averageCell, gradeCell, actionCell);
    tableBody.appendChild(row);
  });

  let totalMarksSum = students.reduce((sum, student) => sum + student.total, 0);
  let classAverage = students.length === 0 ? 0 : totalMarksSum / (students.length * 3);

  document.getElementById("summary").textContent = "Total Students: " + students.length + " | Class Average: " + classAverage.toFixed(2);
}

// TASK 6: DELETE STUDENT RESULT
function deleteStudent(id) {
  let student = students.find(function (s) {
    return s.id === id;
  });

  if (!student) {
    return;
  }

  let confirmDelete = confirm("Delete result of " + student.name + "?");

  if (confirmDelete) {
    students = students.filter(function (s) {
      return s.id !== id;
    });
    saveData();
    displayStudents();
  }
}

// TASK 7: EVENT HANDLING
document.getElementById("resultForm").addEventListener("submit", addStudent);
document.getElementById("searchInput").addEventListener("input", displayStudents);
document.getElementById("gradeFilter").addEventListener("change", displayStudents);

// TASK 8: INITIAL DISPLAY
displayStudents();