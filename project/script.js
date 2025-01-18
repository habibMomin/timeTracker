document.getElementById('save-btn').addEventListener('click', function() {
    const inputText = document.getElementById('input-text').value;
    const currentTime = new Date().toLocaleTimeString();
    
    if(inputText.trim() !== "") {
        const table = document.getElementById('log-table').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        const timeCell = newRow.insertCell(0);
        const activityCell = newRow.insertCell(1);
        
        // Set the time and activity text color to black
        timeCell.textContent = currentTime;
        activityCell.textContent = inputText;
        
        // Apply the class to set text color to black for saved data
        timeCell.classList.add('saved-time');
        activityCell.classList.add('saved-activity');
        
        // Save to local storage immediately
        saveDataToStorage();
        
        document.getElementById('input-text').value = ""; // Clear the textarea
    } else {
        alert("Please enter your activity!");
    }
});

document.getElementById('reset-btn').addEventListener('click', function() {
    document.getElementById('input-text').value = "";
    document.getElementById('log-table').getElementsByTagName('tbody')[0].innerHTML = ""; // Clear the log
    localStorage.clear(); // Clear the localStorage
    alert("All data has been reset!");
});

document.getElementById('save-sheet-btn').addEventListener('click', function() {
    saveDataToStorage();
    alert("Data saved to storage!");
});

document.getElementById('download-excel-btn').addEventListener('click', function() {
    downloadExcel();
});

// Save the log data to local storage
function saveDataToStorage() {
    const rows = document.getElementById('log-table').getElementsByTagName('tbody')[0].rows;
    const logData = [];
    
    for (let row of rows) {
        const time = row.cells[0].textContent;
        const activity = row.cells[1].textContent;
        logData.push({ time, activity });
    }
    
    const date = new Date().toLocaleDateString();
    localStorage.setItem(`logData_${date}`, JSON.stringify(logData));
}

// Download the data as an Excel file
function downloadExcel() {
    const rows = document.getElementById('log-table').getElementsByTagName('tbody')[0].rows;
    const logData = [];

    for (let row of rows) {
        const time = row.cells[0].textContent;
        const activity = row.cells[1].textContent;
        logData.push([time, activity]); // Add row as an array
    }

    const ws = XLSX.utils.aoa_to_sheet(logData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Log");

    // Trigger download
    XLSX.writeFile(wb, `Productivity_Log_${new Date().toLocaleDateString()}.xlsx`);
}

// Load saved data (if any)
window.onload = function() {
    const date = new Date().toLocaleDateString();
    const savedData = localStorage.getItem(`logData_${date}`);
    
    if (savedData) {
        const logData = JSON.parse(savedData);
        const table = document.getElementById('log-table').getElementsByTagName('tbody')[0];
        
        logData.forEach(entry => {
            const newRow = table.insertRow();
            const timeCell = newRow.insertCell(0);
            const activityCell = newRow.insertCell(1);
            
            timeCell.textContent = entry.time;
            activityCell.textContent = entry.activity;

            // Apply black color for saved data
            timeCell.classList.add('saved-time');
            activityCell.classList.add('saved-activity');
        });
    }
};
