import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import {TouchableButton} from './TouchableButton';

export class MenuScreen extends React.Component {
    static navigationOptions = {
      title: 'Main menu',
    };
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
          <TouchableButton 
            text="Character"
            label="Character Sheet" 
            onPress={() =>
              navigate('Character', { })
            }/>
          <TouchableButton 
            text="Inventory"
            label="Inventory" onPress={() =>
              navigate('Inventory', { })
            }/>
          <TouchableButton 
            text="Spells"
            label="Spells"/>
          <TouchableButton 
            text="Diary"
            label="Diary"/>
          <TouchableButton 
            text="Load"
            label="Load Game"/>
          <TouchableButton 
            text="Close"
            label="Close Menu"
            onPress={() =>
                navigate('Main', { })
              }/>
        </View>
      );
    }
  
  }

MenuScreen.propTypes = {
    navigation: PropTypes.object
    };

  export const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });

  