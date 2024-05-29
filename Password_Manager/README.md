# Details Management App

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)


## Introduction

This is a full-stack web application for managing details such as site name, username, and password. It allows users to perform CRUD (Create, Read, Update, Delete) operations on details data.

## Technologies Used

- **Frontend**:
  - React.js (useEffect, useState...)
  - `react-hook-form`: For form handling and validation
  - `react-toastify`: For displaying toast messages
  - Tailwind CSS

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)

## Setup Instructions

### Backend Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
    ```
    cd backend
    ```
3. Install dependencies:
    ```
    npm install
    ```



### STEP 1: 
### Setting up the Backend

- #### Creating Models:
    You started by defining a Mongoose model for the Details collection in MongoDB. This model includes the schema for the details such as sitename, username, and password.

- #### Creating Controllers:
    Next, you created controller methods to handle various operations:

- #### Creating Routes: 
    You defined routes in Express to map HTTP requests to the corresponding controller methods:

- ####  ROUTES

    GET -/api/details: Retrieves all details.

    POST /api/details: Creates a new detail.

    DELETE /api/details/:id: Deletes a detail with the specified ID.

    PUT /api/details/:id: Updates a detail with the specified ID.

### Step 2: Setting up the Frontend

- #### Creating the React Component:

    In your React component, you set up a form to collect details data. You used react-hook-form to handle form validation and submission.

- #### Fetching Data: 
    You used fetch API within a useEffect hook to fetch details data from the backend when the component mounts or when fetchTrigger state changes.

- #### Submitting Data: 
    You implemented a form submission handler (onSubmit) to send details data to the backend. Upon successful submission, you toggled fetchTrigger to trigger a refetch of data and updated the state accordingly.

- ####  Deleting Data: 
    You created a handleDelete function to send a DELETE request to the backend when the delete button is clicked. This function toggles fetchTrigger to trigger a refetch of data upon successful deletion.

- #### Editing Data: 
    You implemented an editItemId state variable to keep track of the item being edited. When the user clicks the edit button, you populate the form with the item's data and set editItemId. On form submission, you check if editItemId exists to determine whether to send a PUT request for editing or a POST request for creating a new item.

### Overall Flow:
- #### Initial Render: 
    On initial render, the component fetches data from the backend using fetch and displays it.
- #### Form Submission:
    When the user submits the form, data is sent to the backend using either POST (for new items) or PUT (for editing existing items).
- #### Upon successful submission, 
    the component triggers a refetch of data from the backend to update the displayed list.

- #### Delete Operation:
    When the user clicks the delete button for an item, a DELETE request is sent to the backend to delete the item.

    Upon successful deletion, the component triggers a refetch of data from the backend to update the displayed list.
- #### Edit Operation:
    When the user clicks the edit button for an item, the form is populated with the item's data for editing.

    On form submission, data is sent to the backend using PUT to update the existing item.

    Upon successful edit, the component triggers a refetch of data from the backend to update the displayed list.