const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'messages.json');

function getMessages() {
    if (!fs.existsSync(filePath)) return [];  // Pokud soubor neexistuje, vrátíme prázdné pole.

    try {
        const data = fs.readFileSync(filePath, 'utf8');  // Čtení obsahu souboru
        return data ? JSON.parse(data) : [];  // Převod JSON řetězce na JavaScript pole
    } catch (error) {
        console.error("❌ Chyba při čtení messages.json:", error);
        return [];  // Pokud nastane chyba, vrátíme prázdné pole
    }
}

function addMessage(username, message, ip) {
    const messages = getMessages();  // Načtení existujících zpráv
    const newMessage = {
        username,
        message,
        timestamp: new Date().toISOString(), // Přidání aktuálního času
        ip
    };

    messages.push(newMessage); // Přidání nové zprávy do pole

    try {
        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
    } catch (error) {
        console.error("❌ Chyba při zápisu do messages.json:", error);
    }
}

module.exports = { getMessages, addMessage };