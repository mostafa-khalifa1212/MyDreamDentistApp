# Dream Dentist Client

A modern dental practice management system built with React, Vite, and Tailwind CSS.

## Features

- Modern, responsive UI built with Tailwind CSS
- Full calendar integration for appointment management
- User authentication and authorization
- Role-based access control
- Financial management and reporting
- Patient records management
- Mobile-first design

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dream-dentist.git
cd dream-dentist/client-vite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
client-vite/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context providers
│   ├── layouts/         # Layout components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main App component
│   └── index.jsx       # Entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
