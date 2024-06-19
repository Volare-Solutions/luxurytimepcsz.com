// Select all product card elements
const productCards = document.querySelectorAll('.sf__pcard');

// Initialize an array to store the product data
const products = [];

// Loop through each product card to extract information
productCards.forEach(card => {
  const titleElement = card.querySelector('.sf__pcard-name');
  const imageElement = card.querySelector('.sf__image-box img');
  const descriptionElement = card.querySelector('.content-view-list .leading-7');
  
  const title = titleElement ? titleElement.innerText.trim() : 'No title';
  // Check for data-srcset attribute for lazy-loaded images
  const imageUrl = imageElement ? (imageElement.getAttribute('data-srcset') || imageElement.src).split(',')[0].split(' ')[0] : 'No image';
  const description = descriptionElement ? descriptionElement.innerText.trim() : 'No description';
  
  // Push the product data to the products array
  products.push({
    title: title,
    imageUrl: imageUrl,
    description: description
  });
});

// Convert the product data to JSON format
const jsonData = JSON.stringify(products, null, 2);

// Function to download data as a JSON file
function downloadJson(jsonData, filename) {
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download the JSON file
downloadJson(jsonData, 'rolex_products.json');

// Log the product data to the console (optional)
console.log(products);
console.log(jsonData);
