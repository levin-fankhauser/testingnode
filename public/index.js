async function fetchNotes() {
    const response = await fetch('/notes');
    const notes = await response.json();
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';
    notes.forEach(note => {
        const button = document.createElement('button');
        button.textContent = note.name;
        button.addEventListener('click', () => openNoteModal(note));
        noteList.appendChild(button);
    });
}

async function addNote() {
    const noteNameInput = document.getElementById('note-name');
    const noteContentInput = document.getElementById('note-content');
    const name = noteNameInput.value.trim();
    const content = noteContentInput.value.trim();
    if (name && content) {
        const response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, content })
        });
        if (response.ok) {
            fetchNotes();
            noteNameInput.value = '';
            noteContentInput.value = '';
        } else {
            console.error('Failed to add note');
        }
    }
}

async function deleteNote(id) {
    const response = await fetch(`/notes/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        closeNoteModal();
        fetchNotes();
    } else {
        console.error('Failed to delete note');
    }
}

function openNoteModal(note) {
    const modal = document.getElementById('note-modal');
    const modalNoteName = document.getElementById('modal-note-name');
    const modalNoteContent = document.getElementById('modal-note-content');
    const deleteButton = document.getElementById('delete-note');

    modalNoteName.textContent = note.name;

    modalNoteContent.innerHTML = note.content.replace(/\n/g, '<br>');

    deleteButton.addEventListener('click', () => deleteNote(note._id));

    modal.style.display = 'block'; 
}


function closeNoteModal() {
    const modal = document.getElementById('note-modal');
    modal.style.display = 'none'; 
}

document.getElementsByClassName('close')[0].addEventListener('click', closeNoteModal);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('note-modal');
    if (event.target === modal) {
        closeNoteModal();
    }
});

document.getElementById('add-note-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addNote();
});

fetchNotes();
