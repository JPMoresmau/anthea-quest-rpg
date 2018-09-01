import React from 'react';
import { TouchableOpacity , StyleSheet, Text, View } from 'react-native';


import {TouchableButton} from './TouchableButton';

export class MainScreen extends React.Component {
    static navigationOptions = {
      title: 'FatherSearch',
    };
    render() {
      const { navigate } = this.props.navigation;
      return (
        
        <View style={styles.container}>
          <TouchableButton 
            onPress={() =>
              navigate('Menu', { })
            }
            text="Menu"
            label="Main menu"/>
        </View>
      );
    }
  
  }


const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  });
