# PathFinder

PathFinder is a mobile route-tracking application built with Expo and React Native.  
It allows users to view their current location on a map, track movement in real time, calculate distance and duration, save completed activities locally, and review past routes through a history and detail view.

## 1. How to run the project

1. Clone the repository:
   ```bash
   git clone <YOUR_GITHUB_REPO_LINK>

Open the project folder:

cd PathFinder

Install dependencies:

npm install

Create a .env file in the project root and add:

EXPO_PUBLIC_MAPTILER_KEY=your_maptiler_key_here

Start the Expo development server:

npx expo start -c

Open the app using Expo Go on your mobile device by scanning the QR code.

## 2. AI tools used and how they helped

I used AI-assisted development tools throughout the project to accelerate development, structure the codebase, and troubleshoot implementation issues.

- **ChatGPT** was my main development assistant. I used it to break the project into smaller steps, plan the app architecture, generate and refine React Native code, debug Expo setup issues, and implement features such as real-time GPS tracking, route persistence, activity history, and map-based detail views.
- **GitHub Copilot** was used mainly to speed up repetitive setup work, such as generating the initial folder and file structure, creating boilerplate code, and assisting with smaller implementation tasks.

The most valuable part of using AI was not only code generation, but also debugging and iteration. I used AI to refine prompts, resolve compatibility issues, adjust the project setup for Expo SDK 54, and improve the overall structure of the app while keeping the code organized and functional.

## 3. Biggest challenge during the vibe coding process

The biggest challenge during the vibe coding process was environment compatibility.

My phone did not support the newest Expo Go version required for the latest Expo SDK, so instead of using Expo SDK 55, I had to work with Expo SDK 54. Because of that, the project also had to be configured and implemented specifically to remain compatible with SDK 54 so it could run correctly on my device.

This affected dependency selection, project setup, and debugging, but it was an important part of making the application stable and usable in the intended environment.