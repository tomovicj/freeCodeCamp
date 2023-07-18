const getColor = () => {
    const rgbToHex = (rgb) => {
        // Extract RGB values
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return rgb;
      
        // Convert RGB to hexadecimal
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const hex = "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
      
        return hex;
    }

    const COLORS = [
    '#000080',
    '#2f2f2f',
    '#00a676',
    '#114b5f',
    '#8a2be2',
    '#2e2532'
    ];

    // Prevent the same color from showing two times in a row
    let color;
    do {
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        color = COLORS[randomIndex];
    }
    while (color == rgbToHex($(".bg-color-custom").css("background-color")));

    return color;
}
  
getQuote = async function () {
    fetch("https://api.quotable.io/random")
    .then(response => {
        // Handle the response
        if (response.ok) {
            // If the response status is within the range 200-299
            return response.json(); // Parse the response body as JSON
        } else {
            throw new Error('Error: ' + response.status);
        }
    })
    .then(data => {
        // Use the data returned from the previous promise
        $("#text").text(data.content);
        $("#author").text(data.author);
        $(".bg-color-custom").css("background-color", getColor());
    })
    .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
    });
};
  
// Get quote when page is loaded
$(document).ready(getQuote);
