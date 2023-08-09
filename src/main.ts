let notesNumber = localStorage.length;
const titleNote = document.querySelector("#note-title") as HTMLElement;
const addNewNote = document.querySelector("#add_note") as HTMLElement;
const removeAll = document.querySelector("#exit") as HTMLElement;
let noteClass;
const closePopupButton = document.getElementById('close-popup-btn') as HTMLElement;
const popup = document.getElementById('popup') as HTMLElement;
const addANote = document.getElementById('add_new_note') as HTMLButtonElement;
const remove_btn = document.getElementById('remove_note') as HTMLButtonElement;
const update_btn = document.getElementById('update_note') as HTMLButtonElement;

const addTitleNote = document.getElementById("title_note") as HTMLInputElement;
const addTextNote = document.getElementById("text_note") as HTMLInputElement;
const notes = document.getElementById("notes") as HTMLElement;
const optionsSelect = document.getElementById("options") as HTMLSelectElement;
const toRemoveAll = document.getElementById("remove_all") as HTMLElement;
const yesRemove = document.getElementById("yes_remove") as HTMLButtonElement;
const noRemove = document.getElementById("no_remove") as HTMLButtonElement;
const textRemove = document.getElementById("text_remove") as HTMLElement;
const userName = document.getElementById("user_name") as HTMLElement;
const toInput = document.getElementById("toInput") as HTMLElement;
const iconMainMobile = document.getElementById("main_mobile") as HTMLElement;
const dateNote = document.getElementById("note_date") as HTMLInputElement;
const checkNotes = document.getElementsByClassName("check_note");

forOnNotes();

function addNote(title: string, text: string, date: string, bk: string): void {
  notesNumber++;
  const newNote = {
    id: notesNumber,
    title: title,
    text: text,
    date: date,
    bk: bk,
  };
  localStorage.setItem(`note${notesNumber}`, JSON.stringify(newNote));
  popup.style.display = 'none';
  addTitleNote.value = "";
  addTextNote.value = "";
  optionsSelect.selectedIndex = 0;
  forOnNotes();
}

let selectedColor = "";

optionsSelect.addEventListener("change", function() {
  const selectedOption = optionsSelect.options[optionsSelect.selectedIndex];
  selectedColor = selectedOption.getAttribute("color") || "";
  console.log(selectedColor);
});

function x(): void {
  let addTitle: string = addTitleNote.value;
  let addText: string = addTextNote.value;

  console.log(selectedColor);
  addNote(addTitle, addText, dateNote.value, selectedColor);
  selectedColor = "";
}

addANote.addEventListener("click", x);

function deleteAll(): void {
  if (localStorage.length === 0) {
    toInput.style.display = "none";
    toRemoveAll.style.display = "block";
    textRemove.innerHTML = "error...";
    yesRemove.style.display = "none";
    noRemove.innerHTML = "ok!";
    noRemove.addEventListener("click", () => {
      toRemoveAll.style.display = "none";
    });
  } else {
    toInput.style.display = "none";
    toRemoveAll.style.display = "block";
    textRemove.innerHTML = "delete all are you sure.";
    yesRemove.style.display = "block";
    noRemove.innerHTML = "no";
    noRemove.addEventListener("click", () => {
      toRemoveAll.style.display = "none";
    });
    yesRemove.addEventListener("click", () => {
      toRemoveAll.style.display = "none";
      notesNumber = 0;
      localStorage.clear();
      notes.innerHTML = "";
    });
  }
}

removeAll.addEventListener("click", deleteAll);

addNewNote.addEventListener("click", () => {
  popup.style.display = 'block';
});

closePopupButton.addEventListener('click', () => {
  popup.style.display = 'none';
});

userName.addEventListener("click", () => {
  toRemoveAll.style.display = "block";
  textRemove.innerHTML = "user name:";
  yesRemove.style.display = "none";
  toInput.style.display = 'block';
  noRemove.innerHTML = "save";
  noRemove.addEventListener("click", () => {
    const inputUserName = document.getElementById("inputUserName") as HTMLInputElement;
    const userNameValue = inputUserName.value;
    localStorage.setItem("user name", userNameValue);
    forOnNotes();
    toRemoveAll.style.display = "none";
    inputUserName.value = "";
  });
});

function forOnNotes() {
  const userNameValue = localStorage.getItem("user name");
  if (userNameValue) {
    const dateNow = new Date();
    const hourNow = dateNow.getHours();
    if (hourNow > 6 && hourNow < 12) {
      userName.innerHTML = `Good morning ${userNameValue}`;
    } else if (hourNow > 12 && hourNow < 18) {
      userName.innerHTML = `Good afternoon ${userNameValue}`;
    } else {
      userName.innerHTML = `Good night ${userNameValue}`;
    }
  }

  notes.innerHTML = "";
  try {
    for (let i = 0; i < localStorage.length + 1; i++) {
      let noteNumber = `note${i}`;
      let noteData = localStorage.getItem(noteNumber);

      if (noteData) {
        let note = JSON.parse(noteData);
        notes.innerHTML += `
          <div class="note" style="background:#${note.bk}" id="${noteNumber}">
            <input id="${noteNumber}" class="check_note" type="checkbox"/>
            <h3 class="note-title">${note.title}</h3>
            <div style="max-height: 7em; overflow-y: auto;">
              <p class="note-text" style="white-space: pre-wrap; max-width: 24ch; overflow-wrap: break-word;">${note.text.replace(/\n/g, '<br>')}</p>
            </div>
            <h4 class="note-date">${note.date}</h4>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error("An error occurred while loading notes:", error);
  }
}

remove_btn.addEventListener('click', () => {
  for (let i = 0; i < checkNotes.length; i++) {
    const checkNoteOuter = checkNotes[i] as HTMLInputElement;
    checkNoteOuter.style.display = "block";

    for (let u = 0; u < localStorage.length; u++) {
      const checkNoteInner = checkNotes[u] as HTMLInputElement;
      if (checkNoteInner.checked) {
        localStorage.removeItem(checkNoteInner.id);
        forOnNotes();
        notesNumber--;
      }
    }
  }
});

const searchInput = document.getElementById('search_input') as HTMLInputElement;

searchInput.addEventListener('input', () => {
  const searchText = searchInput.value.toLowerCase();
  filterNotes(searchText);
});

function filterNotes(searchText: string): void {
  notes.innerHTML = '';
  try {
    for (let i = 0; i < localStorage.length + 1; i++) {
      let noteNumber = `note${i}`;
      let noteData = localStorage.getItem(noteNumber);

      if (noteData) {
        let note = JSON.parse(noteData);
        if (
          note.title.toLowerCase().includes(searchText) ||
          note.text.toLowerCase().includes(searchText)
        ) {
          notes.innerHTML += `
            <div class="note" style="background:#${note.bk}" id="${noteNumber}">
              <input id="${noteNumber}" class="check_note" type="checkbox"/>
              <h3 class="note-title">${note.title}</h3>
              <div style="max-height: 7em; overflow-y: auto;">
                <p class="note-text" style="white-space: pre-wrap; max-width: 24ch; overflow-wrap: break-word;">${note.text.replace(/\n/g, '<br>')}</p>
              </div>
              <h4 class="note-date">${note.date}</h4>
            </div>
          `;
        }
      }
    }
  } catch (e) {
    console.error('Error parsing note:', e);
  }
}

iconMainMobile.addEventListener("click", turnMobileMenu)

function turnMobileMenu() {
  let linksMobile = document.getElementById("myLinks") as HTMLElement;
  if (linksMobile.style.display === "block") {
    linksMobile.style.display = "none";
  } else {
    linksMobile.style.display = "block";
  }
}