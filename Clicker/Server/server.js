    const express = require('express');
    const cors = require('cors');
    const { encodePassword, generateToken } = require('./crypt');

    const app = express();

    app.use(cors());
    app.use(express.json());

    let users = [];

    // апгрейди мають мати такий вигляд
    let upgrades = [
        { id: 1, value: 5, type: "multiplyPassive", name: "Click Accelerator", description: "speed of earning", price: 400, src: "assets/acceleration.jpeg" },
        { id: 2, value: 2, type: "multiplyClick", name: "Power tap", description: "coin for click", price: 200, src: "assets/power-tap.jpeg" },
        { id: 3, value: 1, type: "addClick", name: "Golden touch", description: "increase per click income", price: 100, src: "assets/gold.jpeg" },
        { id: 4, value: 1, type: "addPassive", name: "Bussines pig", description: "increase passive income", price: 100, src: "assets/auto.jpeg" }
    ]; 

    //допоміжна функція(не обовязкова, але зручна)
    function getCurrentUser(email) {
        if (typeof email !== "string") return null;
        return users.find(user => user.email === email);
    }

    app.post('/sign-up', (req, res) => {
        const user = req.body;

        if (!user.email || !user.password) {
            return res.status(400).json({ message: 'Password and email are required' });
        }

        if (user.password.length < 8) {
            return res.status(400).json({ message: 'Password length must be at least 8 characters' });
        }

        if (users.find(u => u.email === user.email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = {
            email: user.email,
            password: encodePassword(user.password),
            balance: 0,
            coinsPerClick: 1,
            passiveIncomePerSecond: 1,
        };

        users.push(newUser);
        res.status(201).json({ message: 'You successfully registered' });
    });

    app.post('/sign-in', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Password and email are required' });
        }

        const user = users.find(user => user.email === email);

        if (!user || user.password !== encodePassword(password)) {
            return res.status(401).json({ message: 'User not found or password is invalid' });
        }

        res.status(200).json({
            message: 'You successfully signed in',
            token: generateToken()
        });
    });

    app.get('/upgrades', (req, res) => {
        res.status(200).json({ upgrades });
    });

    app.get('/upgrades/:id', (req, res) => {
        const { id } = req.params;
        const upgrade = upgrades.find(upg => upg.id === Number(id));

        if (upgrade) {
            return res.status(200).json({ upgrade });
        } else {
            return res.status(404).json({ message: "Upgrade not found" });
        }
    });

    app.post('/upgrades', (req, res) => {
        const { newUpgrade } = req.body;

        if (!newUpgrade || !newUpgrade.name || !newUpgrade.id) {
            return res.status(400).json({ message: "Incorrect upgrade data" });
        }

        const exists = upgrades.some(upg =>
            upg.name === newUpgrade.name || upg.id === newUpgrade.id
        );

        if (exists) {
            return res.status(409).json({ message: "Upgrade already exists" });
        }

        upgrades.push(newUpgrade);
        return res.status(201).json({ message: "Upgrade successfully created" });
    });

    app.put('/upgrades/:id', (req, res) => {
        const { id } = req.params;
        const index = upgrades.findIndex(upg => upg.id === Number(id));

        if (index === -1) return res.status(404).json({ message: "Upgrade not found" });

        return res.status(200).json({
            message: "Upgrade successfully updated",
        });
    });

    app.delete('/upgrades/:id', (req, res) => {
        const { id } = req.params;
        const initialLength = upgrades.length;

        upgrades = upgrades.filter(upg => upg.id !== Number(id));

        if (upgrades.length < initialLength) {
            return res.status(200).json({ message: "Upgrade successfully deleted" });
        } else {
            return res.status(404).json({ message: "Upgrade not found" });
        }
    });

    app.post('/click', (req, res) => {
        const { email } = req.body;

        if (typeof email !== "string") {
            return res.status(400).json({ message: "Wrong email data type" });
        }

        const user = getCurrentUser(email);

        if (user) {
            user.balance += user.coinsPerClick;
            return res.status(200).json({ message: "Coins added", balance: user.balance });
        }

        return res.status(404).json({ message: "User not found" });
    });

    app.post('/passive-income', (req, res) => {
        const { email } = req.body;
        const user = getCurrentUser(email);

        if (user) {
            user.balance += user.passiveIncomePerSecond;
            return res.status(200).json({ message: "Passive income added", balance: user.balance });
        }

        return res.status(404).json({ message: "User not found" });
    });

    //Оце головгне!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    app.post('/buy-upgrade/:id', (req, res) => {
        const { email } = req.body;
        const { id } = req.params;
    
        const user = getCurrentUser(email);
        const upgrade = upgrades.find(upg => upg.id === Number(id));
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        if (!upgrade) {
            return res.status(404).json({ message: "Upgrade not found" });
        }
    
        if (user.balance < upgrade.price) {
            return res.status(400).json({ message: "Not enough coins" });
        }
    
        user.balance -= upgrade.price;
    
        if (upgrade.type === 'multiplyPassive') {
            user.passiveIncomePerSecond *= upgrade.value;
        }
    
        if (upgrade.type === 'multiplyClick') {
            user.coinsPerClick *= upgrade.value;
        }
    
        if (upgrade.type === 'addClick') {
            user.coinsPerClick += upgrade.value;
        }
    
        if (upgrade.type === 'addPassive') {
            user.passiveIncomePerSecond += upgrade.value;
        }
    
        return res.status(200).json({ message: "Upgrade successfully updated", balance: user.balance });
    });

    app.listen(3000, () => console.log('Server running on port 3000'));
