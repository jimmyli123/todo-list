

const update = document.querySelector('#update')

update.addEventListener('click', _ => {
    fetch('/chores', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'choreName': 'take trash out'
        })
    })
})