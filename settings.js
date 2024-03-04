const fs = require('fs');
const path = require('path')

function getPreferences () {
    const preferencePath = path.join(__dirname, '.preferences.json');
    var data = JSON.parse(fs.readFileSync(preferencePath, 'utf-8'))
    console.log(data)
    if (data) return data;
    else console.log('error reading ' + preferencePath)
};

function setPreferences (preferences, bounds) {
    const preferencePath = path.join(__dirname, '.preferences.json');
    const settings = {'win-size': bounds.getSize(), 'win-pos': bounds.getPosition()}
    let content = JSON.stringify(settings, null, 2); 
    fs.writeFile(preferencePath, content, function (err) {
        if (err) throw err;
    }); 

};

module.exports = {
    getPreferences: getPreferences,
    setPreferences: setPreferences
}
