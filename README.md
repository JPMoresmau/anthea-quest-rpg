
# What is this app?

This app is a little Role-Playing Game developed in React Native. The goal for me was to practice Javascript, React, React Native and mobile development using a fun project.

The game is not graphical, it's using basic React component like buttons, texts and lists. Still, it allows you to navigate a little world, interact with non playing characters, fight a couple of monsters, etc.

# Technology
This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app), which hae now [moved](https://github.com/expo/expo-cli/issues).


We use also Redux, React navigation and Jest for tests.

# Running

Currently I've only run this via Expo, I haven't tried to eject it and build a native app.

# Extending

If you want to take this and extend it for fun, you can start looking at the `src/World.js` file that declares the world, NPCs, quests, etc.
In the same folder there are all the other core Javascript modules that implement the game mechanics.
All the UI is in the `src/ui` folder.
