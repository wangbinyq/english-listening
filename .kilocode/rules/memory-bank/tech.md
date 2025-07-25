# English Dictation Application Technology Stack

## Technologies Used
1. **Frontend Framework**: React 19 with TypeScript
2. **Build Tool**: Vite 7
3. **Language**: TypeScript (~5.8.3)
4. **Styling**: CSS Modules (using existing CSS files)
5. **Routing**: React Router (to be added)
6. **Database**: pglite (PostgreSQL-compatible local database)
7. **Audio Handling**: HTML5 Audio API
8. **Text Diffing**: Custom implementation or library (to be determined)
9. **Linting**: ESLint with TypeScript ESLint plugin
10. **Development Server**: Vite's built-in development server

## Development Setup
1. **Node.js**: Required for running the development environment
2. **npm**: Package manager for installing dependencies
3. **Development Server**: Run with `npm run dev` to start the Vite development server
4. **Build Process**: Run with `npm run build` to create a production build
5. **Linting**: Run with `npm run lint` to check for code issues

## Technical Constraints
1. **Browser Compatibility**: Modern browsers that support ES2022 and HTML5 Audio API
2. **Storage Limitations**: Local storage limitations for pglite database
3. **Audio Format Support**: Limited to formats supported by HTML5 Audio API
4. **Offline Capability**: Application should work offline after initial load
5. **Performance**: Efficient diffing algorithm for scoring transcriptions

## Dependencies
### Production Dependencies
- `react`: ^19.1.0 - Core React library
- `react-dom`: ^19.1.0 - React DOM rendering library

### Development Dependencies
- `@vitejs/plugin-react`: ^4.5.2 - React plugin for Vite
- `typescript`: ~5.8.3 - TypeScript compiler
- `vite`: ^7.0.0 - Build tool and development server
- `@types/react`: ^19.1.8 - TypeScript definitions for React
- `@types/react-dom`: ^19.1.6 - TypeScript definitions for React DOM
- `eslint`: ^9.29.0 - Linting tool
- `@eslint/js`: ^9.29.0 - ESLint JavaScript rules
- `typescript-eslint`: ^8.34.1 - TypeScript ESLint plugin
- `eslint-plugin-react-hooks`: ^5.2.0 - ESLint plugin for React hooks
- `eslint-plugin-react-refresh`: ^0.4.20 - ESLint plugin for React Refresh
- `globals`: ^16.2.0 - Global variables for ESLint

## Tool Usage Patterns
1. **Development Workflow**: 
   - Run `npm run dev` to start development server
   - Code changes are hot-reloaded automatically
   - Run `npm run lint` to check for issues
   - Run `npm run build` to create production build

2. **Component Development**:
   - Create components in `src/components/` directory
   - Use TypeScript for type safety
   - Follow React hooks pattern for state management
   - Use CSS modules for styling

3. **Database Integration**:
   - Use pglite for local data storage
   - Implement database operations in `src/services/` directory
   - Create TypeScript types for database records

4. **Testing**:
   - (Currently no testing framework configured)
   - Consider adding Jest or Vitest for unit testing
   - Consider adding React Testing Library for component testing