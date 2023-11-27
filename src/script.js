const title_el = document.getElementById('title');

title_el.innerText = api.title;

const note_title_el = document.getElementById('noteTitle');
const note_content_el = document.getElementById('noteContent');
const note_feeling_el = document.getElementById('noteFeeling');
const note_submit_el = document.getElementById('noteSubmit');

note_submit_el.addEventListener('click', async () => {
    d = new Date
    const timestamp = d.toISOString()
    const title = note_title_el.value.trim();
    const content_text = note_content_el.value.trim();
    const feeling = note_feeling_el.value.trim();
    const row = [timestamp, title, content_text, '\n']
    const content = row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"`: String(item)).join(',');


    console.log(content)

    const res = await api.createNote({
        title,
        content, 
    })

    console.log(res);
    console.log(timestamp);
    note_title_el.value = "";
    note_content_el.value = "";
    


    
})
