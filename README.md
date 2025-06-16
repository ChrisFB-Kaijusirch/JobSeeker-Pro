# JobSeeker Pro

An automated job application and tracking system built with React.

## Features

- Resume upload and parsing
- Job preference configuration
- Automated job discovery
- Application tracking and management
- Status updates for job applications

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChrisFB-Kaijusirch/JobSeeker-Pro.git
   cd JobSeeker-Pro
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_BASE_URL=https://app.base44.com/api/apps/684625ec7844c991c15bf07f
   REACT_APP_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── applications/ # Application-related components
│   ├── dashboard/    # Dashboard components
│   ├── preferences/  # Preference components
│   ├── ui/           # Base UI components
│   └── upload/       # Resume upload components
├── entities/         # Data models and API interfaces
├── integrations/     # External service integrations
├── lib/              # Utility libraries
├── pages/            # Page components
├── App.tsx           # Main application component
├── index.tsx         # Application entry point
└── utils.ts          # Utility functions
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion
- Radix UI
- Lucide React Icons
- date-fns

## API Integration

This application integrates with the Base44 API for data storage and AI processing. The API provides:

- Resume parsing and data extraction
- Job application storage and management
- AI-powered job matching

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)