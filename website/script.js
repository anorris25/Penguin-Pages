const editBtn = document.getElementById("editBtn");
let isEditing = false;

if (editBtn) {
  editBtn.addEventListener("click", () => {
    isEditing = !isEditing;
    toggleEditMode(isEditing);
  });
}

function toggleEditMode(editing) {
  const inputs = ["name", "email", "address"];
  inputs.forEach((field) => {
    const display = document.getElementById(`${field}Display`);
    const input = document.getElementById(`${field}Input`);
    if (editing) {
      display.classList.add("hidden");
      input.classList.remove("hidden");
    } else {
      display.textContent = input.value.replace(/\n/g, "\n");
      display.classList.remove("hidden");
      input.classList.add("hidden");
    }
  });

  editBtn.innerHTML = editing
  ? "Save <i class='fa fa-floppy-o edit-icon' style='color: #444;'></i>"
  : "Edit <i class='fa fa-pencil edit-icon' style='color: #444;'></i>";
}

function showCalendar(view) {
  const personal = document.getElementById('personal-calendar');
  const master = document.getElementById('master-calendar');

  if (view === 'personal') {
    personal.classList.remove('hidden');
    master.classList.add('hidden');
  } else {
    master.classList.remove('hidden');
    personal.classList.add('hidden');
  }
}

// Helper: Get joined clubs from localStorage
function getJoinedClubs() {
  return JSON.parse(localStorage.getItem("joinedClubs")) || [];
}

// Helper: Save joined clubs to localStorage
function saveJoinedClubs(clubs) {
  localStorage.setItem("joinedClubs", JSON.stringify(clubs));
}

// Leave a club
function leaveClub(clubName) {
  const joinedClubs = getJoinedClubs();
  const updatedClubs = joinedClubs.filter(club => club !== clubName);
  saveJoinedClubs(updatedClubs);
  alert(`You've left "${clubName}".`);
  window.location.href = "my-clubs.html";
}

// On My Clubs page: render joined clubs
function renderMyClubs() {
  const joinedClubs = getJoinedClubs();
  const container = document.querySelector(".book-clubs");

  // Define club HTML for known clubs
  const clubHTML = {
    "Classics with a Twist": `
      <div class="club-card">
        <img src="assets/PrideandPrejudiceandZombies.jpeg" class="book-cover-medium" />
        <div class="club-info">
          <h2 class="club-title">Classics with a Twist</h2>
          <p><em>Pride and Prejudice</em> by Jane Austen</p>
          <p><em>Pride and Prejudice and Zombies</em> by Seth Grahame-Smith</p>
          <span class="next-discush"><p>Next discussion: Friday, April 25th at 4:00pm EST</p></span>
          <div class="tags">
            <span>Zoom Meetings</span><span>Chapter by Chapter Discussions</span><span>Forum Threads</span>
          </div>
          <div class="button-wrapper">
            <button class="open-btn" onclick="window.location.href='book-club-1.html'">Open</button>
          </div>
        </div>
      </div>`,

    "Steel City Stories": `
      <div class="club-card">
        <img src="assets/Jazz-in-the-Hill.jpeg" class="book-cover-medium" />
        <div class="club-info">
          <h2 class="club-title">Steel City Stories</h2>
          <p><em>Jazz in the Hill</em> by Colter Harper</p>
          <p><em>Iron City</em> by Lloyd Brown</p>
          <span class="next-discush"><p>Next discussion: Friday, April 25th at 4:00pm EST</p></span>
          <div class="tags">
            <span>Zoom Meetings</span><span>Chapter by Chapter Discussions</span><span>Forum Threads</span>
          </div>
          <div class="button-wrapper">
            <button class="open-btn" onclick="window.location.href='book-club-2.html'">Open</button>
          </div>
        </div>
      </div>`,

    "SciFi": `
      <div class="club-card">
        <img src="assets/Ubik.jpeg" class="book-cover-medium" />
        <div class="club-info">
          <h2 class="club-title">SciFi</h2>
          <p><em>Ubik</em> by Philip K. Dick</p>
          <p><em>The Dreamers</em> by Karen Thompson Walker</p>
          <span class="next-discush"><p>Next discussion: Friday, May 2nd at 1:00pm EST</p></span>
          <div class="tags">
            <span>Zoom Meetings</span><span>Chapter by Chapter Discussions</span><span>Forum Threads</span>
          </div>
          <div class="button-wrapper">
            <button class="open-btn" onclick="window.location.href='book-club-3.html'">Open</button>
          </div>
        </div>
      </div>`
  };

  // Clear container and render
  container.innerHTML = "";
  joinedClubs.forEach(club => {
    if (clubHTML[club]) {
      container.innerHTML += clubHTML[club];
    }
  });
}

function joinClub(clubName) {
  const joinedClubs = getJoinedClubs();

  if (!joinedClubs.includes(clubName)) {
    joinedClubs.push(clubName);
    saveJoinedClubs(joinedClubs);

    // Find the button and update its state
    const button = document.querySelector(`button[onclick="joinClub('${clubName}')"]`);
    if (button) {
      button.textContent = "Joined!";
      button.disabled = true;
      button.classList.add("joined"); // Optional: for styling
    }

    // Optional redirect after short delay
    setTimeout(() => {
      window.location.href = "my-clubs.html";
    }, 800); // short pause before redirecting
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Set Join button text/state
  const joinedClubs = getJoinedClubs();
  joinedClubs.forEach(club => {
    const button = document.querySelector(`button[onclick="joinClub('${club}')"]`);
    if (button) {
      button.textContent = "Joined!";
      button.disabled = true;
      button.classList.add("joined");
    }
  });
});

// Accordion functionality
const accordions = document.getElementsByClassName("accordion");

for (let i = 0; i < accordions.length; i++) {
  accordions[i].addEventListener("click", function () {
    this.classList.toggle("active");

    const panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
    }
  });
}

document.getElementById("searchBar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  // Remove old highlights
  document.querySelectorAll(".highlight").forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize(); // merges adjacent text nodes
  });

  // Collect all visible text nodes
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentNode && node.nodeValue.trim().length > 0 &&
        !["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentNode.tagName)) {
      textNodes.push(node);
    }
  }

  let firstMatch = null;

  textNodes.forEach(node => {
    const text = node.nodeValue;
    const index = text.toLowerCase().indexOf(query);
    if (index > -1 && query !== "") {
      const span = document.createElement("span");
      span.className = "highlight";
      span.textContent = text.substring(index, index + query.length);

      const after = document.createTextNode(text.substring(index + query.length));
      const before = document.createTextNode(text.substring(0, index));

      const fragment = document.createDocumentFragment();
      fragment.appendChild(before);
      fragment.appendChild(span);
      fragment.appendChild(after);

      const parent = node.parentNode;
      parent.replaceChild(fragment, node);

      if (!firstMatch) {
        firstMatch = span;
      }
    }
  });

  // Scroll to first match
  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});