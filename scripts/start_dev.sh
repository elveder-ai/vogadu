#!/bin/bash

# Navigate to the Firebase Cloud Functions directory
cd ../src/firebase/functions

# Run the clean command
npm run clean

# Run the build command
npm run build:watch &

# Navigate back to the Firebase directory
cd ..

# Start the Firebase emulators
firebase emulators:start --import ../../firebase-emulators --export-on-exit ../../firebase-emulators
