const tapButton = document.querySelector('#tap-img');
const balance = document.querySelector("#balance");
const upgradeList = document.querySelector("ul");
const upgradeButtons = document.querySelectorAll(".upgrade-button");

function getEmail() {
    return localStorage.getItem('email');
}

function createUpgrade(upgrade) {
    const li = document.createElement('li');
    upgradeList.appendChild(li);

    const img = document.createElement('img');
    img.setAttribute('src', upgrade.src);
    img.classList.add('boost-img');
    li.appendChild(img);

    const boostInfo = document.createElement('div');
    boostInfo.classList.add('boost-description');
    li.appendChild(boostInfo);

    const header = document.createElement('span');
    header.classList.add('dark-text');
    header.innerHTML = upgrade.name;
    boostInfo.appendChild(header);

    const description = document.createElement('span');
    description.classList.add('main-text');
    description.innerHTML = upgrade.description;
    boostInfo.appendChild(description);

    const priceWrapper = document.createElement('div');
    priceWrapper.classList.add('coins');
    boostInfo.appendChild(priceWrapper);

    const coinImg = document.createElement('img');
    coinImg.setAttribute('src', 'assets/Coin.png');
    priceWrapper.appendChild(coinImg);

    const price = document.createElement('span');
    price.classList.add('dark-text');
    price.innerHTML = upgrade.price;
    priceWrapper.appendChild(price);

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');
    li.appendChild(buttonWrapper);

    const button = document.createElement('button');
    button.classList.add('upgrade-button');
    button.innerHTML = 'Buy';
    button.addEventListener('click', () => {
        fetch('http://localhost:3000/buy-upgrade/' + upgrade.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: getEmail()
            })
        })
        .then(response => response.json())
        .catch(error => {
            console.error("Upgrade error:", error);
        });
    });
    
    buttonWrapper.appendChild(button)
}

function createAllUpgrades() {
    getUpgrades().then(data => {
        data.upgrades.forEach(element => {
            createUpgrade(element);
        });
    })
    .catch(error => {
        console.error("Помилка при отриманні апгрейдів:", error);
    });
    
}

async function getUpgrades() {
    return fetch('http://localhost:3000/upgrades')
        .then(response => response.json());
}

function fetchPost(endpoint) {
    fetch('http://localhost:3000' + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: getEmail()
        })
    })
    .then(response => {
        if(!response.ok) {
            throw new Error("Error " + response.status);
        }

        return response.json()
    })
    .then(data => {
        if(data.balance !== undefined) {
            balance.innerHTML = data.balance;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

tapButton.addEventListener('click', () => {
    fetchPost('/click');
});

setInterval(() => {
    fetchPost('/passive-income');
}, 1000);

createAllUpgrades()