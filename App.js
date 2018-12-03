/**
 * Application entry point, defines the navigation screens and the redux store 
 */
import React from 'react';

import {
  createStore
} from 'redux';

import { Provider } from 'react-redux'

import MainScreen from './src/ui/MainScreen';
import MenuScreen from './src/ui/MenuScreen';
import CharacterScreen from './src/ui/CharacterScreen';
import DiaryScreen from './src/ui/DiaryScreen';
import InventoryScreen from './src/ui/InventoryScreen';
import MonsterScreen from './src/ui/MonsterScreen';
import DeathScreen from './src/ui/DeathScreen';
import LoadScreen from './src/ui/LoadScreen';
import SpellScreen from './src/ui/SpellScreen';

import { reduceAll } from './src/Reducers';

import {
  createStackNavigator, createAppContainer,
} from 'react-navigation';
import { initialState } from './src/State';



const AppNavigator = createStackNavigator({
  Main: { screen: MainScreen },
  Menu: { screen: MenuScreen },
  Character: { screen: CharacterScreen },
  Inventory: { screen: InventoryScreen },
  Diary: { screen: DiaryScreen },
  Monster: { screen: MonsterScreen},
  Death: {screen: DeathScreen},
  Load: {screen: LoadScreen},
  Spells: {screen : SpellScreen}
}, {
  initialRouteName: 'Main',
  navigationOptions: {
    headerTitleStyle: { textAlign: "center", width: "100%" }
  }
}
);

const store = createStore(
  reduceAll,initialState
);

const AppContainer = createAppContainer(AppNavigator);


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}



