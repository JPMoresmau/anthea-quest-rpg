/**
 * Simple screen showing the system menu options
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import {TouchableButton} from './TouchableButton';
import { connect } from 'react-redux';
import { saveState } from '../Utils';
import Toast from 'react-native-simple-toast';

class MenuScreen extends React.Component {
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
            label="Inventory"
            onPress={() =>
              navigate('Inventory', { })
            }/>
          <TouchableButton 
            text="Spells"
            label="Spells"
            onPress={()=>
              navigate('Spells',{ })
            }/>
          <TouchableButton 
            text="Diary"
            label="Diary"
            onPress={() =>
              navigate('Diary', { })
            }/>
          <TouchableButton 
            text="Save"
            label="Save Game"
            onPress={()=>
              this.save()
            }/>
          <TouchableButton 
            text="Load"
            label="Load Game"
            onPress={() =>
              navigate('Load', { })
            }/>
          
        </View>
      );
    }

    save(){
      saveState("manual",this.props.state);
      Toast.show("Game saved");
    }
  
  }

MenuScreen.propTypes = {
    navigation: PropTypes.object,
    state: PropTypes.object
    };

  export const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });

 
  const mapStateToProps = state => {
    return {
        state
    };
  };

  export default connect(mapStateToProps)(MenuScreen);