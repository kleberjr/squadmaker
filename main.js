// ============= CLASSES ============= //

class Player {
    constructor(name, nickname, role, level) {
        this.name = name;
        this.nickname = nickname;
        this.role = role;
        this.level = level;
    }
}

// ============= HELPER FUNCTIONS ============= //

function openModal() {
    const modal = document.querySelector('#modal');
    modal.classList.add('active');
}
function closeModal() {
    const modal = document.querySelector('#modal');
    modal.classList.remove('active');
    
    clearFields();
}


function clearFields() {
    const formInputs = document.querySelectorAll('.input-field')
    formInputs.forEach(input => input.value = '');
}
function clearTable() {
    const tBody = document.querySelector('tbody');
    tBody.innerHTML = '';
}


function isFieldsValid() {
    const form = document.querySelector('#form');
    const select = document.querySelector('#level');

    return (form.reportValidity() && (select.value != ''));
}
function fillOutFields(player) {
    const nameInput = document.querySelector('#name');
    const nicknameInput = document.querySelector('#nickname');
    const roleInput = document.querySelector('#role');
    const levelInput = document.querySelector('#level');

    nameInput.value = player.name;
    nicknameInput.value = player.nickname;
    roleInput.value = player.role;
    levelInput.value = player.level;
}


function getPlayersDatabase() {
    let playersDatabase = localStorage.getItem('players_db') ?? '[]';
    playersDatabase = JSON.parse(playersDatabase);
    
    return playersDatabase;
}
function setPlayersDatabase(playersDatabase) {
    playersDatabase = JSON.stringify(playersDatabase);

    localStorage.setItem('players_db', playersDatabase);
}

// ============= PLAYER FUNCTIONS ============= //

function createPlayer() {
    const nameInput = document.querySelector('#name');
    const nicknameInput = document.querySelector('#nickname');
    const roleInput = document.querySelector('#role');
    const levelInput = document.querySelector('#level');

    return new Player(nameInput.value, nicknameInput.value, roleInput.value, levelInput.value);  
}
function savePlayer() {
    const form = document.querySelector('#form');
    const action = form.dataset.action.split('-')[0];
    const index = form.dataset.action.split('-')[1];

    if (isFieldsValid()) {
        if (action === 'add') {
            const newPlayer = createPlayer();
            
            const playersDatabase = getPlayersDatabase();
            
            playersDatabase.push(newPlayer);
            
            setPlayersDatabase(playersDatabase);
            
            updateTable();
    
            closeModal();
        } else {  
            updatePlayer(index);
            updateTable();
            
            form.dataset.action = 'add';

            closeModal();
        }

    }
}
function deletePlayer(index) {
    const playersDatabase = getPlayersDatabase();

    playersDatabase.splice(index, 1);

    setPlayersDatabase(playersDatabase);
    
    updateTable();
}
function editPlayer(index) {
    const playersDatabase = getPlayersDatabase();
    const form = document.querySelector('#form');
    
    fillOutFields(playersDatabase[index]);

    form.dataset.action = `edit-${index}`;
    
    openModal(); 
}  
function updatePlayer(index) {
    const playersDatabase = getPlayersDatabase();

    playersDatabase[index].name = document.querySelector('#name').value;
    playersDatabase[index].nickname = document.querySelector('#nickname').value;
    playersDatabase[index].role = document.querySelector('#role').value;
    playersDatabase[index].level = document.querySelector('#level').value;

    setPlayersDatabase(playersDatabase);
}
function managePlayer(event) {
    if (event.target.tagName === 'I') {
        const action = event.target.classList[2].split('-')[0];
        const index = event.target.classList[3];
        
        if (action === 'delete') {
            deletePlayer(index);
        } else {
            editPlayer(index);
        }
    }
}

// ============= TABLE FUNCTIONS ============= //

function createRow(player, index) {
    const tBody = document.querySelector('tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <tr>
        <td>
            <i class="fas fa-trash delete-icon ${index}"></i>
        </td>
        <td>
            <i class="fas fa-user-edit edit-icon ${index}"></i>
        </td>
        <td>${player.name}</td>
        <td>${player.nickname}</td>
        <td>${player.role}</td>
        <td>${player.level}</td>
    </tr>
    `

    tBody.appendChild(tr);
}
function updateTable() {
    clearTable();
    
    const playersDatabase = getPlayersDatabase();
    
    playersDatabase.forEach(createRow);
    
    setPlayersDatabase(playersDatabase);
}

// ============= MAIN ============= //

updateTable();

// ============= EVENTS ============= //

const newPlayerButton = document.querySelector('#new-player');
const cancelButton = document.querySelector('#cancel');
const saveButton = document.querySelector('#save');
const table = document.querySelector('table');

newPlayerButton.addEventListener('click', openModal);
cancelButton.addEventListener('click', closeModal);
saveButton.addEventListener('click', savePlayer);
table.addEventListener('click', managePlayer);