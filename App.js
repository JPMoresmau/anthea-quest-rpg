import React from 'react';

import {
  createStore
} from 'redux';

import { Provider } from 'react-redux'

import MainScreen from './src/ui/MainScreen';
import {MenuScreen} from './src/ui/MenuScreen';
import CharacterScreen from './src/ui/CharacterScreen';
import DiaryScreen from './src/ui/DiaryScreen';
import InventoryScreen from './src/ui/InventoryScreen';

import { reduceAll } from './src/Reducers';

import {
  createStackNavigator,
} from 'react-navigation';
import { initialState } from './src/State';


const AppNavigator = createStackNavigator({
  Main: { screen: MainScreen },
  Menu: { screen: MenuScreen },
  Character: { screen: CharacterScreen },
  Inventory: { screen: InventoryScreen },
  Diary: { screen: DiaryScreen },
});

const store = createStore(
  reduceAll,initialState
);



export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}



