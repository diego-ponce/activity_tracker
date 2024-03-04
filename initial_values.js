const fs = require('fs');
const path = require('path')

function getValues () {
    const valuePath = path.join(__dirname, 'config.json');
    try {
        var data = JSON.parse(fs.readFileSync(valuePath, 'utf-8'))
    }
    catch {
        return {}
    }
    console.log(data)
    if (data) return data;
    else console.log('error reading ' + valuePath)
};

function setValues (values) {
    const valuePath = path.join(__dirname, 'config.json');
    let content = JSON.stringify(values, null, 2); 
    fs.writeFile(valuePath, content, function (err) {
        if (err) throw err;
    }); 

};

module.exports = {
    getValues: getValues,
    setValues: setValues
}
