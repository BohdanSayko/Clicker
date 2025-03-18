const express = require('express');
const cors = require('cors');
const { encodePassword, generateToken } = require('./crypt');

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

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

    let newUser = {
        email: user.email,
        password: encodePassword(user.password)
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

app.listen(3000, () => console.log('Server running on port 3000'));
