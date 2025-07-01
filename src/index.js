let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  
  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  // Fetch and display all toys on page load
  fetchToys();
  
  // Handle form submission for creating new toys
  toyForm.addEventListener("submit", handleFormSubmit);
  
  // Handle like button clicks using event delegation
  toyCollection.addEventListener("click", handleLikeClick);
});

// Fetch all toys from the server
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    })
    .catch(error => console.error("Error fetching toys:", error));
}

// Render a single toy card to the DOM
function renderToy(toy) {
  const toyCollection = document.querySelector("#toy-collection");
  
  const toyCard = document.createElement("div");
  toyCard.className = "card";
  
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  
  toyCollection.appendChild(toyCard);
}

// Handle form submission to create a new toy
function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const toyData = {
    name: formData.get("name"),
    image: formData.get("image"),
    likes: 0
  };
  
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toyData)
  })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      event.target.reset(); // Clear the form
    })
    .catch(error => console.error("Error creating toy:", error));
}

// Handle like button clicks
function handleLikeClick(event) {
  if (event.target.classList.contains("like-btn")) {
    const toyId = event.target.id;
    const likesElement = event.target.previousElementSibling;
    const currentLikes = parseInt(likesElement.textContent);
    const newLikes = currentLikes + 1;
    
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        likesElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
  }
}
