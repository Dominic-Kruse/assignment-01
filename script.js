const numUsers = document.getElementById('numUsers')
const typeName = document.getElementById('nameSelector')
const errorAlert = document.getElementById('errorAlert')
const userContainer = document.getElementById('userContainer')

let userData = [];

numUsers.addEventListener('change', fetchUsers);
typeName.addEventListener('change', () => displayUsers(userData));

async function fetchUsers() {
    const count = Number(numUsers.value)
   
    if (!count || count <= 0 || count > 1000) {
    showError("Please enter a valid number of users between 0-1000")
    return;
    }
    hideError();
    userContainer.innerHTML = '<div class="text-center mt-3">Finding users...';
    const timeoutId = setTimeout(() => {
        showError("Check on your Internet, the request took too long.");
    }, 20000);

    fetch(`https://randomuser.me/api/?results=${count}`)
        .then(response => {
            if (!response.ok) {
                clearTimeout(timeoutId);
                throw new Error(`API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            clearTimeout(timeoutId);
            userData = data.results
            displayUsers(userData);
        })
        .catch(error=> {
            clearTimeout(timeoutId);
            showError(`Failed to fetch users: ${error.message}`);
            console.error(`Fetch error:`, error);
        })
}

function showError(message) {
    if (errorAlert) {
    errorAlert.textContent = message;
    errorAlert.classList.remove('d-none');
    errorAlert.classList.add('alert', 'alert-danger', 'mt-3');

    }
}

function hideError() {
    errorAlert.classList.add('d-none'); 
    errorAlert.classList.remove('alert', 'alert-danger', 'mt-3');
}

function displayUsers(users) {
    if (!users || users.length === 0){
        userContainer.innerHTML = '<div class="text-center"> No users found </div>';
        return;
    }
    const nameType = typeName.value || 'first';

    const usersHTML = users.map(user => {
        let displayName;
        switch(nameType) {
            case 'first':
                displayName = user.name.first;
                break;
            case 'last':
                displayName = user.name.last;
                break;
            default:
                displayName = `${user.name.first}`;
        }
        
        return `
            <div class="d-flex justify-content-between align-items-center bg-light shadow-sm rounded-pill p-3 mb-2">
                <div class="text-center" style="flex: 1">${displayName}</div>
                <div class="text-center" style="flex: 1">${user.gender}</div>
                <div class="text-center" style="flex: 1">${user.email}</div>
                <div class="text-center" style="flex: 1">${user.location.country}</div>
            </div>
        `;
    }).join('');
    userContainer.innerHTML = usersHTML;
}




