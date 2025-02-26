document.addEventListener("DOMContentLoaded", function () { // shadow
    /*---------------- Звуки -----------------*/
    const popSound = new Audio("sound/pop.mp3");

    /*---------------- Елементи -----------------*/
    const tap = document.querySelector("#tap-img");
    const totalBalance = document.querySelector("#total-balance");
    const coinPerClick = document.querySelector("#coin-per-click");
    const passiveEarn = document.querySelector("#passive-earn");
    const balance = document.querySelector("#balance");
    const passiveSpeedElement = document.querySelector("#passive-accelerator-data");

    /*---------------- Бонуси -----------------*/
    let coinMultiplier = { value: parseInt(coinPerClick.innerText) };
    let passiveCoinMultiplier = { value: parseInt(passiveEarn.innerText) };
    let passiveSpeed = parseInt(passiveSpeedElement.innerHTML);
    let goldenTouch = 0.05;
    let timeBoost = 60000;
    let autoMinerTime = 1000;
    let isAutoMiner = false

    /*---------------- Оновлення балансу -----------------*/
    function getBalance() {
        return parseInt(balance.innerText.replace(/\s/g, ""), 10) || 0;
    }

    function updateBalance(amount) {
        let newBalance = getBalance() + amount;
        balance.innerText = newBalance.toLocaleString();
        totalBalance.innerText = (parseInt(totalBalance.innerText.replace(/\s/g, ""), 10) || 0) + amount;
    }

    /*----- Random -----*/
    function getRandom() {
        return Math.random();
    }

    /*----- Time-Boost -----*/
    function createTimeBoost(effect, multiplierTarget, displayElement) {
        let boostElement = document.createElement("div");
        boostElement.classList.add(effect);
        document.body.appendChild(boostElement);
        boostElement.style.cursor = 'pointer';
        
    
        const timeWrapper = document.createElement("div");
        timeWrapper.setAttribute("id", "time-wrapper");
        boostElement.appendChild(timeWrapper);
    
        let timer = document.createElement("span");
        timer.innerText = timeBoost / 1000;
        timer.classList.add("timer-text");
        timeWrapper.appendChild(timer);
    
        boostElement.addEventListener("click", () => {
            if (boostElement.dataset.active === "true") return;
    
            boostElement.dataset.active = "true";
            multiplierTarget.value *= 2;
            displayElement.innerHTML = multiplierTarget.value + (effect === "passive-time-boost" ? "/sec" : "");
    
            boostElement.style.cursor = 'default';
            boostElement.style.boxShadow = "0 0 40px rgba(0, 0, 0, 0.5)";
            addTimer(timeBoost, timer);
    
            setTimeout(() => {
                multiplierTarget.value /= 2;
                displayElement.innerHTML = multiplierTarget.value + (effect === "passive-time-boost" ? "/sec" : "");
                boostElement.dataset.active = "false";
                boostElement.style.boxShadow = "0 0 0 white";
            }, timeBoost);
        });
    }
    
    /*----- Passive -----*/
    setInterval(() => {
        updateBalance(passiveCoinMultiplier.value);
    }, passiveSpeed * 1000);

    /*----- Tap -----*/
    tap.addEventListener("click", () => {
        popSound.cloneNode(true).play();

        const randomNum = getRandom();

        if (randomNum <= goldenTouch) {
            updateBalance(coinMultiplier.value * 2);
        } else {
            updateBalance(coinMultiplier.value);
        }
    });

    /*----- Timer -----*/
    function addTimer(timeBoost, element) {
        let currentTimer = timeBoost;
        let interval = setInterval(() => {
            currentTimer -= 1000;
            element.innerHTML = currentTimer / 1000;

            if (currentTimer <= 0) {
                clearInterval(interval);
                element.innerHTML = timeBoost / 1000;
            }
        }, 1000);
    }

    /*----- AutoMiner -----*/
    

    /*----- Buy -----*/
    document.querySelectorAll(".upgrade-button").forEach(button => {
        button.addEventListener("click", function () {
            let parent = this.closest("li");
            let effect = parent.dataset.effect;
            let effectData = parseInt(parent.dataset.value);
            let priceElement = parent.querySelector(".coins span");
            let price = parseInt(priceElement.textContent.replace(/\s/g, ""), 10);

            let currentBalance = getBalance();

            if (currentBalance >= price) {
                updateBalance(-price);

                if (effect === "multiplier") {
                    coinMultiplier.value += effectData;
                    coinPerClick.innerText = coinMultiplier.value;
                    priceElement.innerHTML = Math.floor(price * 1.5);
                }

                if (effect === "golden-touch") {
                    goldenTouch = Math.min(1, goldenTouch + 0.05);
                    priceElement.innerHTML = Math.floor(price * 1.5);
                }

                if (effect === "passive-earn") {
                    passiveCoinMultiplier.value *= 2;
                    passiveEarn.innerText = passiveCoinMultiplier.value + "/sec";
                    priceElement.innerHTML = Math.floor(price * 3);
                }

                if (effect === "passive-timeboost") {
                    createTimeBoost("passive-time-boost", passiveCoinMultiplier, passiveEarn);
                }

                if (effect === "tap-timeboost") {
                    createTimeBoost("tap-time-boost", coinMultiplier, coinPerClick);
                }

                if (effect === "auto-clicker") {
                    isAutoMiner = true;
                    if (isAutoMiner) {
                        console.log(1);
            
                        window.autoMinerInterval = setInterval(() => {
                            console.log(2);
                            updateBalance(coinMultiplier.value);
                        }, autoMinerTime);
                    }
                }
            } else {
                alert("Not enough money!");
            }
        });
    });

});
