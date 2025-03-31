const express = require('express');
const app = express();
const PORT = 3000;

const Database = require('better-sqlite3');
const db = new Database('messages.db', { verbose: console.log });


const bodyParser = require('body-parser');
const messages = [];

// JSON
//const fs = require('fs');
//const path = require('path');

// JSON
//const filePath = path.join(__dirname, 'messages.json');

// Vyběr metod pro ukládání zpráv
//const storage = require('./storage/jsonStorage'); // JSON storage
const storage = require('./storage/sqliteStorage'); // SQLite storage

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Vytvoření tabulky v databázi
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip TEXT
    )
`);

// Načítání zpráv z databáze
function getMessages() {
    return db.prepare("SELECT * FROM messages ORDER BY timestamp DESC").all();
}

function addMessage(username, avatar, email, message, ip) {
    try {
        db.prepare(`
            INSERT INTO messages (username, avatar, email, message, timestamp, ip)
            VALUES (?, ?, CURRENT_TIMESTAMP, ?)
        `).run(username, message, ip);
        console.log("✅ Zpráva uložena do SQLite");
    } catch (error) {
        console.error("❌ Chyba při ukládání do SQLite:", error);
    }
}

// Domovská stránka
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//Nacitani zprav
/*
app.get('/messages', (req, res) => {
    let messages = storage.getMessages();
    res.json(messages);
});
*/

// Vyhledávání zpráv
app.get('/messages', (req, res) => {
    let messages = storage.getMessages();

    const search = req.query.search.toLowerCase() || "";

    const filteredMessages = messages.filter(msg =>
        msg.message.toLowerCase().includes(search) || 
        msg.username.toLowerCase().includes(search)
    );

    res.json(filteredMessages);
});

//Port serveru na kterem nasloucha
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});

// Odeslání zprávy
/*
app.post('/send', (req, res) => {
    const { username, message } = req.body;
    messages.push({ username, message, timestamp: new Date().toLocaleString() });
    res.redirect('/');
});
*/

// Odeslání zprávy SQLite
app.post('/send', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).send('Jméno a zpráva jsou povinné!');
    }

    const userIP = req.headers['x-forwarded-for'] || req.ip;
    
    let msg = {
        username: username,
        message,
        timestamp: new Date().toISOString(),
        ip: userIP
    };
    messages.push(msg);

    storage.addMessage(msg.username, msg.message, msg.ip);
    res.redirect('/');
});


// Uložení zprávy do SQLite databáze
function addMessage(username, message, ip) {
    db.prepare(`
        INSERT INTO messages (username, message, timestamp, ip)
        VALUES (?, ?, CURRENT_TIMESTAMP, ?)
    `).run(username, message, ip);
}

// Uložení zprávy do JSON souboru 
/*
function addMessage(username, message, ip) {
    const messages = getMessages();
    messages.push({ username, message, timestamp: new Date().toISOString(), ip });
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
}
*/

// Zobrazeni zpráv

async function loadMessages() {
    const response = await fetch('/messages');  // Pošle požadavek na server
    const messages = await response.json();    // Přijme a převede odpověď na JSON
    document.getElementById('messages').innerHTML = messages.map(msg =>
        `<div class="message">
            <strong>${msg.username}</strong>: ${msg.message}
            <small>(${msg.timestamp}) - IP: ${msg.ip}</small>
        </div>`
    ).join('');
}
setInterval(loadMessages, 5000);  // Aktualizace každých 5 sekund

