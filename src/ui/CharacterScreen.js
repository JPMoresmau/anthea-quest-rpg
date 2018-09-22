import React,{Component} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {characteristics} from './UIUtils';
import {textStyle} from './Styles';


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

  CharacterScreen.propTypes = {
    chars: PropTypes.array
    };

  const mapStateToProps = state => {
    let chars = Object.entries(state.character).map(([key, value]) => ({key:characteristics[key],value:value}));
    return {
        chars: chars
    };
  };


  export default connect(mapStateToProps)(CharacterScreen);