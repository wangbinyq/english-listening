# English Dictation Application Architecture

## System Architecture
The application follows a standard React + Vite architecture with TypeScript for type safety. The application is structured as a single-page application (SPA) with client-side routing for navigation between the main dictation page and the history page.

## Source Code Paths
- `src/` - Main source code directory
  - `App.tsx` - Main application component with routing
  - `main.tsx` - Application entry point
  - `components/` - Reusable UI components
    - `Modal.tsx` - Generic modal component
    - `DiffResultDialog.tsx` - Dialog for displaying diff results
  - `pages/` - Page components for different views
    - `DictationPage.tsx` - Main page for dictation exercises
    - `HistoryPage.tsx` - Page for viewing dictation history
  - `hooks/` - Custom React hooks
    - `useAudioPlayer.ts` - Hook for audio playback functionality
    - `useContentExtractor.ts` - Hook for extracting content from URLs
    - `useDictationTimer.ts` - Hook for tracking dictation time
  - `utils/` - Utility functions
    - `textDiff.ts` - Text comparison and diffing utilities
  - `types/` - TypeScript type definitions
    - `index.ts` - Dictation record type definition
  - `services/` - Business logic and data handling
    - `database.ts` - Database service using pglite

## Key Technical Decisions
1. **Client-Side Database**: Using pglite for local storage of dictation records with IndexedDB persistence
2. **Audio Handling**: Using HTML5 Audio API for audio playback with custom React hook
3. **Text Diffing**: Using the `diff` library for word-based text comparison and scoring
4. **State Management**: Using React's built-in state management (useState, useEffect, useRef) for simplicity
5. **Routing**: Using React Router for navigation between pages
6. **Content Extraction**: Using a backend proxy to bypass CORS restrictions when fetching content

## Design Patterns in Use
1. **Component-Based Architecture**: Breaking UI into reusable components
2. **Single Responsibility Principle**: Each component/hook/service has a single purpose
3. **Separation of Concerns**: Separating UI, business logic, and data handling
4. **Hooks Pattern**: Using React hooks for state and side effects
5. **Custom Hooks**: Encapsulating reusable logic in custom hooks

## Component Relationships
- `App` - Root component that handles routing
  - `DictationPage` - Main page for dictation exercises
    - `useAudioPlayer` hook - Handles audio playback functionality
    - `useContentExtractor` hook - Handles content extraction from URLs
    - `useDictationTimer` hook - Tracks time spent on dictation
    - `textDiff` utilities - Calculates similarity score and generates diff view
    - `dbService` - Saves and retrieves dictation records
  - `HistoryPage` - Page for viewing dictation history
    - `dbService` - Retrieves dictation records for display
    - `DiffResultDialog` - Shows detailed diff results in a modal
      - `Modal` - Generic modal component
  - `Modal` - Generic reusable modal component

## Critical Implementation Paths
1. **Audio Handling**: Implementing reliable audio playback from URLs with custom controls
2. **Text Diffing Algorithm**: Creating an accurate scoring mechanism using the diff library
3. **Local Database Integration**: Setting up pglite for data persistence with proper schema
4. **Content Extraction**: Implementing a backend proxy to bypass CORS restrictions
5. **User Interface**: Creating an intuitive and responsive UI with proper state management
6. **Timer Functionality**: Implementing an accurate timer that handles page visibility changes