fetch('includes/actions.json')
.then(response => response.json())
.then(data => {
// Process the data as needed
console.log(data);
// Further actions can be performed here
})
.catch(error => {
console.error('Error fetching the data:', error);
});