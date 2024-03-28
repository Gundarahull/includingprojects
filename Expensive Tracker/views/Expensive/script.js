document.getElementById('limit').addEventListener('change', function() {
    const select = this;
    const limit = select.value;
    console.log("Selected limit:", limit); // Check if the correct limit is selected
    const url = `<%= pagination.baseUrl %>?limit=${limit}&page=1`;
    console.log("New URL:", url); // Check if the constructed URL is correct
    window.location.href = url;
});
