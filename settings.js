const fs = require('fs');
const path = require('path')

function getPreferences () {
    const default_preferences = {"win-size":[918,432],"win-pos":[273,224]}
    const preferencePath = path.join(__dirname, '.preferences.json');
    try {
        var data = JSON.parse(fs.readFileSync(preferencePath, 'utf-8'));
    }
    catch {
        return default_preferences;
    }
    if (data) return data;
    else return default_preferences;
};

function setPreferences (window) {
    const preferencePath = path.join(__dirname, '.preferences.json');
    const settings = {'win-size': window.getSize(), 'win-pos': window.getPosition()}
    let content = JSON.stringify(settings, null, 2); 
    fs.writeFile(preferencePath, content, function (err) {
        if (err) throw err;
    }); 

};

module.exports = {
    getPreferences: getPreferences,
    setPreferences: setPreferences
}
