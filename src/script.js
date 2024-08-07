
const title_el = document.getElementById('title');
title_el.innerText = api.title;
const title = api.title;
const note_project_el = document.getElementById('noteProject');
const note_content_el = document.getElementById('noteContent');
const note_feeling_el = document.getElementById('noteFeeling');
const note_impact_el = document.getElementById('noteImpact');
const note_productivity_el = document.getElementById('noteProductivity');
const note_helpfulness_el = document.getElementById('noteHelpfulness');
const note_remind_time_el = document.getElementById('noteRemind_time');
const note_submit_el = document.getElementById('noteSubmit');
const note_export_to_csv_el = document.getElementById('noteExportCSV');

api.getInitialValues().then(result => {
    const initialValues = JSON.parse(result);
    for (element in initialValues) {
        // TODO clean this up 
        const elHack = 'note' + element.charAt(0).toUpperCase() + element.substring(1)
        el = document.getElementById(elHack);
        if (el) el.value = initialValues[element];
    }
})
note_export_to_csv_el.addEventListener('click', async () => {
    const res = await api.exportCsv()
})
note_submit_el.addEventListener('click', async () => {
    d = new Date
    const username = await api.getUsername()
    let content = {
        username: username,
        timestamp: d.toISOString(),
        project: note_project_el.value.trim(),
        content: note_content_el.value.trim(),
        feeling: note_feeling_el.value.trim(),
        impact: note_impact_el.value,
        productivity: note_productivity_el.value,
        helpfulness: note_helpfulness_el.value,
        remind_time: note_remind_time_el.value
    };
    const res = await api.createNote({
        title,
        content, 
    })
    console.log(res);
})
