import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import {TouchableButton} from './TouchableButton';
import { connect } from 'react-redux';
import { listSaves, getState } from '../Utils';
import { load } from '../Actions';
import Toast from 'react-native-simple-toast';

class LoadScreen extends React.Component {
    static navigationOptions = {
      title: 'Load a saved game',
    };
    render() {
      const { games } = this.props;
      return (
        <View style={styles.container}>
          <Text style={styles.listText}>Quest items</Text>
          <FlatList
            data={games}
            renderItem={({item}) => 
                <View><Text>{item.name}</Text><TouchableButton 
                text="Load"
                label="Load Game"
                onPress={() => {
                    this.load(item.key());
                }}/>
                </View>}
            />
         
          
        </View>
      );
    }

    load(key){
      const { goBack } = this.props.navigation;
      const state=getState(key);
      this.props.load(state);
      Toast.show("Game loaded");
      goBack();
    }
  
  }

LoadScreen.propTypes = {
    navigation: PropTypes.object,
    games: PropTypes.array,
    load: PropTypes.func
};

  export const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });

 
  const mapStateToProps = () => {
    return {
        games:listSaves() 
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
       load: (state) => {
            dispatch(load(state));
        }
    }
  };

  export default connect(mapStateToProps,mapDispatchToProps)(LoadScreen);