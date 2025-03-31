module.exports = { getMessages, addMessage };

const Database = require('better-sqlite3');
const db = new Database('messages.db', { verbose: console.log });


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

// Uložení zprávy do SQLite databáze
function addMessage(username, message, ip) {
    try {
        db.prepare(`
            INSERT INTO messages (username, message, timestamp, ip)
            VALUES (?, ?, CURRENT_TIMESTAMP, ?)
        `).run(username, message, ip);
        console.log("✅ Zpráva uložena do SQLite");
    } catch (error) {
        console.error("❌ Chyba při ukládání do SQLite:", error);
    }
}