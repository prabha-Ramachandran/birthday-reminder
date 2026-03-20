const API_URL = 'http://localhost:5000/api/birthdays';

document.addEventListener('DOMContentLoaded', fetchBirthdays);

document.getElementById('birthdayForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const birthday = {
        name: document.getElementById('name').value,
        birthdate: document.getElementById('birthdate').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(birthday)
        });

        if (response.ok) {
            alert('Birthday added successfully!');
            document.getElementById('birthdayForm').reset();
            fetchBirthdays();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add birthday');
    }
});

async function fetchBirthdays() {
    try {
        const response = await fetch(API_URL);
        const birthdays = await response.json();
        displayBirthdays(birthdays);
        displayReminders(birthdays);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayBirthdays(birthdays) {
    const container = document.getElementById('birthdayContainer');
    if (!container) return;
    
    container.innerHTML = '';

    if (birthdays.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No birthdays added yet</p>';
        return;
    }

    birthdays.forEach(function(birthday) {
        const item = document.createElement('div');
        item.className = 'birthday-item';
        item.innerHTML = 
            '<div class="birthday-info">' +
                '<h3>' + birthday.name + '</h3>' +
                '<p>📅 ' + birthday.birthdate + '</p>' +
            '</div>' +
            '<div class="birthday-actions">' +
                '<button class="edit-btn" onclick="editBirthday(\'' + birthday._id + '\')">Edit</button>' +
                '<button class="delete-btn" onclick="deleteBirthday(\'' + birthday._id + '\')">Delete</button>' +
            '</div>';
        container.appendChild(item);
    });
}

function getDaysUntilBirthday(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    
    let thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (thisYearBirthday < today) {
        thisYearBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    const diffTime = thisYearBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function getUpcomingBirthdays(birthdays) {
    const upcoming = [];
    
    for (let i = 0; i < birthdays.length; i++) {
        const birthday = birthdays[i];
        const daysLeft = getDaysUntilBirthday(birthday.birthdate);
        if (daysLeft <= 30) {
            upcoming.push({ 
                name: birthday.name,
                daysLeft: daysLeft,
                isToday: daysLeft === 0
            });
        }
    }
    
    upcoming.sort(function(a, b) {
        return a.daysLeft - b.daysLeft;
    });
    
    return upcoming;
}

function displayReminders(birthdays) {
    const reminderContainer = document.getElementById('reminderList');
    if (!reminderContainer) return;
    
    const upcoming = getUpcomingBirthdays(birthdays);
    
    if (upcoming.length === 0) {
        reminderContainer.innerHTML = '<div class="no-reminder">No upcoming birthdays in next 30 days</div>';
        return;
    }
    
    let reminderHtml = '';
    
    for (let i = 0; i < upcoming.length; i++) {
        const birthday = upcoming[i];
        let dayText = '';
        let todayClass = '';
        
        if (birthday.daysLeft === 0) {
            dayText = 'TODAY!';
            todayClass = 'today';
        } else if (birthday.daysLeft === 1) {
            dayText = 'Tomorrow!';
        } else {
            dayText = 'in ' + birthday.daysLeft + ' days';
        }
        
        reminderHtml = reminderHtml + 
            '<div class="reminder-card ' + todayClass + '">' +
                '<div class="reminder-emoji">' + (birthday.daysLeft === 0 ? '🎂🎉' : '🎈') + '</div>' +
                '<div class="reminder-name">' + birthday.name + '</div>' +
                '<div class="reminder-days ' + todayClass + '">' + dayText + '</div>' +
            '</div>';
    }
    
    reminderContainer.innerHTML = reminderHtml;
}

window.editBirthday = async function(id) {
    try {
        const response = await fetch(API_URL + '/' + id);
        const birthday = await response.json();
        
        document.getElementById('editId').value = birthday._id;
        document.getElementById('editName').value = birthday.name;
        document.getElementById('editBirthdate').value = birthday.birthdate;
        
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
};

document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const updatedBirthday = {
        name: document.getElementById('editName').value,
        birthdate: document.getElementById('editBirthdate').value
    };

    try {
        const response = await fetch(API_URL + '/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBirthday)
        });

        if (response.ok) {
            alert('Birthday updated!');
            closeModal();
            fetchBirthdays();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

window.deleteBirthday = async function(id) {
    if (confirm('Delete this birthday?')) {
        try {
            const response = await fetch(API_URL + '/' + id, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Birthday deleted!');
                fetchBirthdays();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
};