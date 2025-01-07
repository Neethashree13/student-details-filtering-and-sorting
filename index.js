const STUDENTS = [
  { id: 1, name: "Janu", English: 50, Maths: 86, Science: 77, SocialScience: 88 },
  { id: 2, name: "Tanu", English: 75, Maths: 96, Science: 67, SocialScience: 91 },
  { id: 3, name: "Tara", English: 90, Maths: 35, Science: 86, SocialScience: 100 },
  { id: 4, name: "Glen", English: 79, Maths: 68, Science: 77, SocialScience: 78 },
  { id: 5, name: "Zara", English: 80, Maths: 85, Science: 96, SocialScience: 68 },
];

let filteredData = [...STUDENTS];
let currentSubject = '';
let currentFilterType = '';
let currentValue1 = '';
let currentValue2 = '';

function renderTable(data) {
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = '';
  data.forEach((student) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.English}</td>
          <td>${student.Maths}</td>
          <td>${student.Science}</td>
          <td>${student.SocialScience}</td>
      `;
      if (isRowHighlighted(student)) {
        row.classList.add('highlighted');
      }
      tableBody.appendChild(row);
  });
}

function isRowHighlighted(student) {
  if (!currentSubject || !currentFilterType) return false;
  
  const value = student[currentSubject];
  if (currentFilterType === "above") {
    return value > currentValue1;
  } else if (currentFilterType === "below") {
    return value < currentValue1;
  } else if (currentFilterType === "between") {
    return value >= currentValue1 && value <= currentValue2;
  }
  return false;
}

function applyFilter() {
  currentSubject = document.getElementById('subject').value;
  currentFilterType = document.querySelector('input[name="filter"]:checked')?.value;
  currentValue1 = parseInt(document.getElementById('filterValue1').value);
  currentValue2 = parseInt(document.getElementById('filterValue2').value);

  if (!currentSubject || !currentFilterType) {
      alert("Please select subject and filter type");
      return;
  }

  if (currentFilterType !== "between" && isNaN(currentValue1)) {
      alert("Please provide a value");
      return;
  }

  if (currentFilterType === "between" && (isNaN(currentValue1) || isNaN(currentValue2))) {
      alert("Please provide both values");
      return;
  }

  filteredData = STUDENTS.filter(student => {
      if (currentFilterType === "above") {
          return student[currentSubject] > currentValue1;
      } else if (currentFilterType === "below") {
          return student[currentSubject] < currentValue1;
      } else if (currentFilterType === "between") {
          return student[currentSubject] >= currentValue1 && student[currentSubject] <= currentValue2;
      }
  });

  renderTable(filteredData);
}

function clearFilter() {
  filteredData = [...STUDENTS];
  currentSubject = '';
  currentFilterType = '';
  currentValue1 = '';
  currentValue2 = '';
  
  document.getElementById('subject').selectedIndex = 0;
  document.querySelectorAll('input[name="filter"]').forEach(radio => radio.checked = false);
  document.getElementById('filterValue1').value = '';
  document.getElementById('filterValue2').value = '';
  document.getElementById('filterValue2').style.display = 'none';
  
  renderTable(filteredData);
}

function sortTable(column) {
  const dataType = column === 'name' ? 'string' : 'number';
  const multiplier = column === 'id' ? 1 : -1; // For id, 1 is ascending; for others, -1 is ascending
  
  filteredData.sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];
    
    if (dataType === 'string') {
      return multiplier * valueA.localeCompare(valueB);
    } else {
      return multiplier * (valueA - valueB);
    }
  });
  
  renderTable(filteredData);
}

document.querySelectorAll('.sortable').forEach(header => {
  header.addEventListener('click', () => sortTable(header.dataset.column));
});

document.getElementById('applyFilter').addEventListener('click', applyFilter);
document.getElementById('clearFilter').addEventListener('click', clearFilter);

document.querySelector('input[name="filter"][value="between"]').addEventListener('change', () => {
  document.getElementById('filterValue2').style.display = 'inline';
});

document.querySelectorAll('input[name="filter"]:not([value="between"])').forEach(radio => {
  radio.addEventListener('change', () => {
      document.getElementById('filterValue2').style.display = 'none';
  });
});


renderTable(STUDENTS);