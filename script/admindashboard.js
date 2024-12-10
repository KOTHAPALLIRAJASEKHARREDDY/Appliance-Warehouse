document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("user_data"));
  if (userData) {
    document.getElementById("user-name").textContent = userData.firstname;
    document.getElementById("profile-letter").textContent = userData.firstname
      .charAt(0)
      .toUpperCase();
  }
  callGetAppliances();
  // Add event listener for search input
  document
    .getElementById("search-input")
    .addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().replace(/ /g, "");
      filterApplianceList(searchTerm);
    });

  // Add event listener for add appliance form
  // Add event listener for Add Appliance button
  document
    .getElementById("add-appliance-btn")
    .addEventListener("click", function () {
      document.getElementById("add-appliance-modal").style.display = "block";
    });

  // Add event listener for closing the modal
  document.querySelector(".close-btn").addEventListener("click", function () {
    document.getElementById("add-appliance-modal").style.display = "none";
    resetForm();
  });

  // Add event listener for form submission
  document
    .getElementById("add-appliance-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const applianceData = {
        brand: formData.get("brand"),
        model: formData.get("model"),
        type: formData.get("type"),
        condition: formData.get("condition"),
        rental_rate: formData.get("rental_rate"),
        availability_status: formData.get("availability_status"),
        deposit_amount: formData.get("deposit_amount"),
        serial_number: formData.get("serial_number"),
        features: formData.get("features").split(","),
        image_url: formData.get("image_url"),
      };
      console.log("applianceData", applianceData);
      addAppliance(applianceData);
    });
});

const profileIcon = document.getElementById("profile-icon");
const profileUpload = document.getElementById("profile-upload");
const profileLetter = document.getElementById("profile-letter");

// Event listener for clicking on the profile icon to upload a picture
profileIcon.addEventListener("click", () => {
  profileUpload.click();
});

// Event listener for handling the file upload
profileUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileIcon.style.backgroundImage = `url(${e.target.result})`;
      profileLetter.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

callGetAppliances = () => {
  fetch("/getAllAppliances")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const applianceListContainer = document.getElementById("appliance-list");
      applianceListContainer.innerHTML = ""; // Clear existing content
      data.data.forEach((appliance) => {
        const applianceElement = createApplianceElement(appliance);
        applianceListContainer.appendChild(applianceElement);
      });
      applianceListContainer.addEventListener("click", function (event) {
        const target = event.target;
        const form = target.closest("form");
        const applianceId = form.getAttribute("data-id");

        if (target.classList.contains("edit-btn")) {
          toggleEditMode(applianceId, true);
        }
      });

      applianceListContainer.addEventListener("submit", function (event) {
        event.preventDefault();
        const form = event.target;
        const applianceId = form.getAttribute("data-id");

        const updatedFields = getUpdatedFields(form);

        fetch(`/updateAppliance/${applianceId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              alert("Appliance updated successfully!");
              updateDisplayValues(form, updatedFields);
            } else {
              alert("Failed to update appliance.");
            }
          })
          .catch((error) => {
            console.error("Error updating appliance:", error);
          });

        toggleEditMode(applianceId, false);
      });
    })
    .catch((error) => {
      console.error("Error fetching appliance data:", error);
    });
};

const createApplianceElement = (appliance) => {
  const applianceElement = document.createElement("div");
  applianceElement.classList.add("appliance-item");
  applianceElement.innerHTML = `
    <form class="appliance-card" data-id="${appliance._id}">
      <div class="appliance-image">
        <img src="${appliance.image_url}" alt="${appliance.brand} ${
    appliance.model
  }" width="200">
      </div>
      <div class="appliance-details">
        <p><strong>Brand:</strong> <input type="text" value="${
          appliance.brand
        }" name="brand" class="edit-input" readonly></p>
        <p><strong>Model:</strong> <input type="text" value="${
          appliance.model
        }" name="model" class="edit-input" readonly></p>
        <p>Type: <input type="text" value="${
          appliance.type
        }" name="type" class="edit-input" readonly></p>
        <p>Condition: <input type="text" value="${
          appliance.condition
        }" name="condition" class="edit-input" readonly></p>
        <p>Rental Rate: $<input type="number" value="${
          appliance.rental_rate
        }" name="rental_rate" class="edit-input" readonly></p>
        <p>Availability: <input type="text" value="${
          appliance.availability_status
        }" name="availability_status" class="edit-input" readonly></p>
        <p>Deposit Amount: $<input type="number" value="${
          appliance.deposit_amount
        }" name="deposit_amount" class="edit-input" readonly></p>
        <p>Serial Number: <input type="text" value="${
          appliance.serial_number
        }" name="serial_number" class="edit-input" readonly></p>
        <p>Features:</p>
        <textarea name="features" class="edit-input" readonly style="border: none; background: transparent; width: 100% ; height:80px">${appliance.features.join(
          ", "
        )}</textarea>
        <button type="button" class="edit-btn">Edit</button>
        <button type="button" class="delete-btn">Delete</button>
        <button type="submit" class="save-btn" style="display: none;">Save</button>
      </div>
    </form>
  `;

  // Add event listener for delete button
  applianceElement
    .querySelector(".delete-btn")
    .addEventListener("click", function () {
      const applianceId = applianceElement
        .querySelector(".appliance-card")
        .getAttribute("data-id");
      if (confirm("Are you sure you want to delete this appliance?")) {
        deleteAppliance(applianceId);
      }
    });
  return applianceElement;
};

const deleteAppliance = (applianceId) => {
  fetch(`/deleteAppliance/${applianceId}`, {
    type: "application/json",
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Appliance deleted successfully!");
        callGetAppliances(); // Refresh the appliance list
      } else {
        alert("Failed to delete appliance.");
      }
    })
    .catch((error) => {
      console.error("Error deleting appliance:", error);
    });
};

const filterApplianceList = (searchTerm) => {
  const applianceItems = document.querySelectorAll(".appliance-item");
  applianceItems.forEach((item) => {
    const brand = item
      .querySelector('input[name="brand"]')
      .value.toLowerCase()
      .replace(/ /g, "");
    const model = item
      .querySelector('input[name="model"]')
      .value.toLowerCase()
      .replace(/ /g, "");
    const type = item
      .querySelector('input[name="type"]')
      .value.toLowerCase()
      .replace(/ /g, "");
    if (
      brand.includes(searchTerm) ||
      model.includes(searchTerm) ||
      type.includes(searchTerm)
    ) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

function toggleEditMode(applianceId, isEditMode) {
  document
    .querySelectorAll(`form[data-id="${applianceId}"] .edit-input`)
    .forEach((element) => {
      element.readOnly = !isEditMode;
      element.style.border = isEditMode ? "1px solid" : "none";
      element.classList.toggle("editable", isEditMode);
    });
  document.querySelector(
    `form[data-id="${applianceId}"] .edit-btn`
  ).style.display = isEditMode ? "none" : "inline";
  document.querySelector(
    `form[data-id="${applianceId}"] .save-btn`
  ).style.display = isEditMode ? "inline" : "none";
}

function getUpdatedFields(form) {
  const updatedFields = {};
  new FormData(form).forEach((value, key) => {
    updatedFields[key] = value;
    if (key === "features") {
      updatedFields[key] = value.split(",").map((feature) => feature.trim());
    }
  });
  console.log("updatedFields", updatedFields);
  return updatedFields;
}

function updateDisplayValues(form, updatedFields) {
  Object.keys(updatedFields).forEach((key) => {
    if (key === "features") {
      form.querySelector(`textarea[name="${key}"]`).value =
        updatedFields[key].join(", ");
      return;
    } else {
      form.querySelector(`input[name="${key}"]`).value = updatedFields[key];
    }
  });
}

function resetForm() {
  document.getElementById("add-appliance-form").reset();
}

const addAppliance = (applianceData) => {
  fetch("/addAppliance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applianceData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Appliance added successfully!");
        document.getElementById("add-appliance-modal").style.display = "none";
        resetForm();
        callGetAppliances();
      } else {
        alert("Failed to add appliance.");
      }
    })
    .catch((error) => {
      console.error("Error adding appliance:", error);
    });
};
