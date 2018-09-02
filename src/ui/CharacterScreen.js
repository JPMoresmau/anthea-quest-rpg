import React,{Component} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { connect } from 'react-redux';

import {TouchableButton} from './TouchableButton';
import {characteristics} from './Names';
import {textStyle} from './Styles';

import { updateCharacter } from '../Actions'

class CharacterScreen extends Component {
    static navigationOptions = {
      title: 'Character: Anthea',
    };
    render() {
      const { chars } = this.props;
      return (
        
        <View style={styles.container}>
          <FlatList
            data={chars}
            renderItem={({item}) => <Text style={styles.listText}>{item.key}:{item.value}</Text>}
            />

          <TouchableButton 
            onPress={() => {
              this.props.onUpdate();
            }}
            text="Update"
            label="Update"/>
        </View>
      );
    }
  
  }

const styles = StyleSheet.create(Object.assign({},{ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }
  },textStyle));


  const mapStateToProps = state => {
    let chars = Object.entries(state.character).map(([key, value]) => ({key:characteristics[key],value:value}));
    return {
        chars: chars
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onUpdate: () => {
        dispatch(updateCharacter('xp',1))
      }
    }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(CharacterScreen);