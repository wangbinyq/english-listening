# English Dictation Application Architecture

## System Architecture
The application follows a standard React + Vite architecture with TypeScript for type safety. The application is structured as a single-page application (SPA) with client-side routing for navigation between the main dictation page and the history page.

## Source Code Paths
- `src/` - Main source code directory
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `components/` - Reusable UI components (to be created)
  - `pages/` - Page components for different views (to be created)
  - `hooks/` - Custom React hooks (to be created)
  - `utils/` - Utility functions (to be created)
  - `types/` - TypeScript type definitions (to be created)
  - `services/` - Business logic and data handling (to be created)

## Key Technical Decisions
1. **Client-Side Database**: Using pglite for local storage of dictation records
2. **Audio Handling**: Using HTML5 Audio API for audio playback
3. **Text Diffing**: Implementing a text comparison algorithm for scoring
4. **State Management**: Using React's built-in state management (useState, useContext) for simplicity
5. **Routing**: Using React Router for navigation between pages

## Design Patterns in Use
1. **Component-Based Architecture**: Breaking UI into reusable components
2. **Single Responsibility Principle**: Each component/function has a single purpose
3. **Separation of Concerns**: Separating UI, business logic, and data handling
4. **Hooks Pattern**: Using React hooks for state and side effects

## Component Relationships
- `App` - Root component that handles routing
  - `DictationPage` - Main page for dictation exercises
    - `AudioPlayer` - Component for audio playback
    - `TextInput` - Component for dictation input
    - `SubmitButton` - Component for submitting answers
    - `ScoreDisplay` - Component for showing results
  - `HistoryPage` - Page for viewing dictation history
    - `RecordList` - Component for displaying past attempts
    - `RecordItem` - Component for individual record display

## Critical Implementation Paths
1. **Audio Handling**: Implementing reliable audio playback from URLs
2. **Text Diffing Algorithm**: Creating an accurate scoring mechanism
3. **Local Database Integration**: Setting up pglite for data persistence
4. **User Interface**: Creating an intuitive and responsive UI
5. **State Management**: Managing application state effectively