const eye = document.querySelector("#eye");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const button = document.querySelector("button");

let isOpen = false;
let inputsValue = {
    email: '',
    password: ''
};

eye.addEventListener('click', () => {
    if(isOpen === false) {
        eye.setAttribute('src', 'assets/disable-eye.png');
        passwordInput.setAttribute('type', 'text');
        isOpen = true;
    } else {
        eye.setAttribute('src', 'assets/Show.png');
        passwordInput.setAttribute('type', 'password');
        isOpen = false;
    }
});

emailInput.addEventListener('keyup', () => {
    inputsValue.email = emailInput.value;
});

passwordInput.addEventListener('keyup', () => {
    inputsValue.password = passwordInput.value;
});

button.addEventListener('click', () => {
    console.log(`Email: ${inputsValue.email}`);
    console.log(`Password: ${inputsValue.password}`);
})