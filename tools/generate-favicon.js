const favicons = require('favicons');
const fs = require('fs');
const path = require('path');

// Configuration
const configuration = {
  path: "/", // Path for the favicon files
  appName: "Dream Dentist",
  appShortName: "Dream Dentist",
  appDescription: "Dental Practice Management Application",
  background: "#2196F3", // Background color
  theme_color: "#2196F3", // Theme color
  version: "1.0.0",
  icons: {
    // Only generate favicon.ico
    android: false,
    appleIcon: false,
    appleStartup: false,
    coast: false,
    favicons: true,
    firefox: false,
    windows: false,
    yandex: false
  }
};

// Create a simple SVG source - a blue circle with "DD" text
const source = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2196F3" rx="128" ry="128"/>
  <text x="256" y="300" font-size="220" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">DD</text>
</svg>`;

// Create a temporary SVG file
const tempSvgPath = path.join(__dirname, 'temp-logo.svg');
fs.writeFileSync(tempSvgPath, source);

// Generate the favicon
favicons(tempSvgPath, configuration)
  .then(response => {
    // Create directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'client', 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save favicon.ico
    response.images
      .filter(image => image.name === 'favicon.ico')
      .forEach(image => {
        fs.writeFileSync(path.join(outputDir, image.name), image.contents);
        console.log(`Generated ${image.name} in ${outputDir}`);
      });
    
    // Clean up
    fs.unlinkSync(tempSvgPath);
  })
  .catch(error => {
    console.error('Error generating favicon:', error);
  });