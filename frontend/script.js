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
            alert('✅ Birthday added!');
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
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayBirthdays(birthdays) {
    const container = document.getElementById('birthdayContainer');
    if (!container) return;
    
    container.innerHTML = '';

    if (birthdays.length === 0) {
        container.innerHTML = '<p>No birthdays added yet</p>';
        return;
    }

    birthdays.forEach(birthday => {
        const item = document.createElement('div');
        item.className = 'birthday-item';
        
        // Fixed line 74 - removed the nested quotes issue
        const editButton = '<button onclick="editBirthday(\'' + birthday._id + '\')">Edit</button>';
        const deleteButton = '<button onclick="deleteBirthday(\'' + birthday._id + '\')">Delete</button>';
        
        item.innerHTML = 
            '<div>' +
                '<h3>' + birthday.name + '</h3>' +
                '<p>📅 ' + birthday.birthdate + '</p>' +
            '</div>' +
            '<div>' +
                editButton +
                deleteButton +
            '</div>';
        
        container.appendChild(item);
    });
}

window.editBirthday = async (id) => {
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

document.getElementById('editForm').addEventListener('submit', async (e) => {
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
            alert('✅ Updated!');
            closeModal();
            fetchBirthdays();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

window.deleteBirthday = async (id) => {
    if (confirm('Delete?')) {
        try {
            const response = await fetch(API_URL + '/' + id, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('✅ Deleted!');
                fetchBirthdays();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

window.closeModal = () => {
    document.getElementById('editModal').style.display = 'none';
};

window.onclick = (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
};