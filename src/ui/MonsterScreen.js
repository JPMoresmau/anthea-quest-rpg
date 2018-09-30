import React,{Component} from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { getCurrentLocation } from '../State';
import { allMonsters } from '../World';
import { textStyle } from './Styles';
import { moveTo } from '../Actions';
import { hitOrder, getStateActions, hit } from '../Combat';

class MonsterScreen extends Component {
    static navigationOptions =({ navigation }) => {
        return {
            title: 'Encounter with a Monster',
            headerLeft: (
                <TouchableButton 
                        onPress={navigation.getParam('flee')}
                        text="Flee"
                        label="Flee"/>
               )
        };
      };
    
      componentDidMount() {
        this.props.navigation.setParams({ flee: this.flee });
      }

     flee = () => {
        const { goBack, getParam } = this.props.navigation;
        const { goToExit } = this.props;
        goToExit(getParam('previousLocation'))
        goBack();
     }

     fight() {
         const {state} = this.props;
         const rnd = (low,high)=> Math.floor((Math.random() * high) + low);
         const hits=hitOrder(state,rnd);
         hits.forEach(h=> {
            const cstate = this.props.state;
            hit(h, cstate, rnd, (act)=>{
                console.log(act);
                getStateActions(act).forEach(a=>this.props.dynamic(a));
                
            });
         });
         
     }

     render() {
        const { navigate } = this.props.navigation;
        const { monster } = this.props;
        let content;
        if (monster){
            content=<Text>{monster.name}</Text>;
        } else {
            content=<Text></Text>;
        }
        return (
            <View style={styles.container}>
                <TouchableButton 
                    onPress={() =>
                    navigate('Menu', { })
                    }
                    text="Menu"
                    label="Main menu"/>
                {content}
                <TouchableButton 
                    onPress={() =>
                    this.fight()
                    }
                    text="Fight"
                    label="Fight the monster"/>
            </View>
        );
        
    }

}


MonsterScreen.propTypes = {
    navigation: PropTypes.object,
    state: PropTypes.object,
    location: PropTypes.object,
    monster: PropTypes.object,
    goToExit: PropTypes.func,
    dynamic: PropTypes.func
    };
  
  const styles = StyleSheet.create(Object.assign({},{ 
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      item : {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start'
      }
    },textStyle));
  
    const mapStateToProps = state => {
      const loc = getCurrentLocation(state);
      const monster = allMonsters[loc.monster];
  
      return {
          state: state,
          location: loc,
          monster: monster
      };
    };
  
  
    const mapDispatchToProps = dispatch => {
      return {
        dynamic: (action) => {
            dispatch(action);
         },
        goToExit: (name) => {
            dispatch(moveTo(name));
          }
        }
      };
  
    export default connect(mapStateToProps,mapDispatchToProps)(MonsterScreen);