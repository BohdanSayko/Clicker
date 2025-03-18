const eye = document.querySelector("#eye");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const button = document.querySelector("button");
const body = document.querySelector("body")

let isOpen = false;
let inputsValue = {
    email: '',
    password: ''
};

function createPopUp(data) {
    let popUpWrapper = document.createElement('div');
    popUpWrapper.classList.add('pop-up-wrapper');
    body.appendChild(popUpWrapper);

    let popUp = document.createElement('div');
    popUp.classList.add('pop-up');
    popUpWrapper.appendChild(popUp);

    let popUpButton = document.createElement('button');
    popUpButton.classList.add('pop-up-button');
    popUpButton.innerHTML = 'Okay'
    popUp.appendChild(popUpButton);
    
    let popUpText = document.createElement('span');
    popUpText.classList.add('subtitle');
    popUpText.innerHTML = data
    popUp.appendChild(popUpText);

    popUpButton.addEventListener('click', () => {
        popUp.classList.add('pop-up-out')
        popUpWrapper.classList.add('pop-up-wrapper-out')

        setTimeout(() => {
            popUpWrapper.remove()
        }, 500)
    })
    
}

function fetchData(endpoint) {
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: inputsValue.email,
            password: inputsValue.password
        })
    })
    .then(response => response.json())
    .then(data => {
        createPopUp(data.message); 

        if (data.token) {
            localStorage.setItem('token', data.token);
        }
    })
}

eye.addEventListener('click', () => {
    isOpen = !isOpen;
    eye.setAttribute('src', isOpen ? 'assets/disable-eye.png' : 'assets/Show.png');
    passwordInput.setAttribute('type', isOpen ? 'text' : 'password');
});

emailInput.addEventListener('keyup', () => {
    inputsValue.email = emailInput.value;
});

passwordInput.addEventListener('keyup', () => {
    inputsValue.password = passwordInput.value;
});

button.addEventListener('click', (event) => {
    event.preventDefault();
    
    if(button.innerHTML === "Sign up") {
        fetchData('http://localhost:3000/sign-up');
    } else if(button.innerHTML === "Sign in") {
        fetchData('http://localhost:3000/sign-in');
    }
});
