/**
 * Screen showing the saved games to be able to load a game
 */
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import {TouchableButton} from './TouchableButton';
import { connect } from 'react-redux';
import { listSaves, getState, removeState } from '../Utils';
import { load } from '../Actions';
import Toast from 'react-native-simple-toast';
import { textStyle } from './Styles';

class LoadScreen extends React.Component {
    static navigationOptions = {
      title: 'Load a saved game',
    };
    constructor(props) {
      super(props);
      this.state = { games : []};
    }
    render() {
      const { games } = this.state;
      return (
        <View style={styles.container}>
          <FlatList
            data={games}
            renderItem={({item}) => 
                <View style={styles.item}><Text style={styles.listText}>{item.name}</Text>
                <TouchableButton 
                text="Load"
                label="Load Game"
                onPress={() => {
                    this.load(item.key);
                }}/>
                <TouchableButton 
                text="Remove"
                label="Remove Game"
                onPress={() => {
                    this.remove(item.key);
                }}/>
                </View>}
            />
         
          
        </View>
      );
    }
    componentDidMount() {
      listSaves().then(gs=>this.setState({games:gs}));
    }
    load(key){
      const { goBack } = this.props.navigation;
      getState(key).then(state=>{
        this.props.load(state);
        Toast.show("Game loaded");
        goBack();
      });
    }
    remove(key){
      Alert.alert("Remove saved game","Are you sure you want to delete his saved game?",[
        {text:"Yes",
         onPress:()=>{
          removeState(key).then(()=>{
            Toast.show("Save removed");
            listSaves().then(gs=>this.setState({games:gs}));
          });
          }
        },
        {
          text:"No"}
        ]);
      
    }
  
  }

LoadScreen.propTypes = {
    navigation: PropTypes.object,
    load: PropTypes.func
};

const styles = StyleSheet.create(Object.assign({},{ 
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },item : {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
}
},textStyle));

 
  const mapStateToProps = () => {
    return {};
  };

  const mapDispatchToProps = dispatch => {
    return {
       load: (state) => {
            dispatch(load(state));
        }
    }
  };

  export default connect(mapStateToProps,mapDispatchToProps)(LoadScreen);