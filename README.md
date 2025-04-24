# Career Study Project

## Project Structure

```
careerstudy/
├── assets/
│   ├── styles/
│   │   ├── main.css          # Main stylesheet for the application
│   │   └── forms/
│   │       ├── survey1.css   # Styles specific to Survey1
│   │       └── survey2.css   # Styles specific to Survey2
│   └── js/
│       ├── config/
│       │   └── constants.js   # Global constants and configuration
│       ├── core/
│       │   ├── api.js        # API interaction handling
│       │   ├── auth.js       # Authentication functionality
│       │   └── events.js     # Event management system
│       └── forms/
│           ├── components/
│           │   ├── birthday.js    # Birthday selector component
│           │   ├── choices.js     # Multiple choice input component
│           │   ├── form.js        # Base form functionality
│           │   └── selector.js    # Generic selector component
│           ├── events.js          # Event selection handling
│           ├── survey1.js         # First survey implementation
│           └── survey2.js         # Second survey implementation
├── index.html                     # Main entry point
├── survey1.html                   # Survey1 specific page
├── survey2.html                   # Survey2 specific page
├── index.js                       # Application initialization
├── liff.js                        # LINE Front-end Framework integration
└── debug.js                       # Debugging utilities
```

## Component Descriptions

### Core Files
- `index.html`: Main entry point of the application, contains the base HTML structure
- `survey1.html`: First survey page with specific form structure
- `survey2.html`: Second survey page with specific form structure
- `index.js`: Initializes the application and sets up necessary configurations
- `liff.js`: Handles LINE Front-end Framework integration for LINE platform features
- `debug.js`: Contains utilities for development and debugging purposes

### Assets Structure

#### Styles
- `main.css`: Primary stylesheet containing global styles and layout definitions
- `forms/survey1.css`: Specific styles for Survey1 components and layout
- `forms/survey2.css`: Specific styles for Survey2 components and layout

#### JavaScript Modules

##### Config
- `constants.js`: Defines global constants, configuration values, and enums used throughout the application

##### Core Modules
- `api.js`: Manages all API interactions and data fetching
- `auth.js`: Handles user authentication and authorization
- `events.js`: Core event system for managing user event selections and interactions

##### Form Components
- `birthday.js`: Custom component for date of birth selection with year/month/day inputs
- `choices.js`: Reusable component for multiple choice or checkbox-based selections
- `form.js`: Base form handling including validation and submission
- `selector.js`: Generic selection component for dropdown and multi-select functionality

##### Form Implementations
- `events.js`: Specific implementation for event selection interface
- `survey1.js`: First survey form implementation with validation and data handling
- `survey2.js`: Second survey form implementation with its specific validation and handling

## Survey Structure

### Survey1
- Initial registration and event selection
- Personal information collection
- Event preferences
- Basic user profile creation

### Survey2
- Post-event feedback
- Detailed experience evaluation
- Future preferences collection
- Career development insights

## Key Features

- Form validation with immediate feedback
- Dynamic event selection interface
- Birthday input with separate year/month/day selectors
- LINE platform integration
- Responsive design with modern UI components
- Error handling and user feedback system
- Multi-survey support with shared components

## Technical Details

- Uses vanilla JavaScript for better performance and maintainability
- Implements modular component architecture
- Includes comprehensive form validation
- Features responsive CSS using modern layout techniques
- Integrates with LINE's LIFF platform
- Reusable components between surveys
