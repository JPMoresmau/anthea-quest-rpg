import React,{Component} from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { getCurrentLocation, getMonsterInLocation } from '../State';
import { textStyle } from './Styles';
import { moveTo } from '../Actions';
import { hitOrder, getStateActions, hit, CHARACTER_HIT, CHARACTER_MISS, MONSTER_HIT, MONSTER_MISS } from '../Combat';
import { pushArray } from '../Utils';

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
    
    constructor(props) {
        super(props);
        this.state = { entries : []};
    }

    componentDidMount() {
        this.props.navigation.setParams({ flee: this.flee });
    }

    componentDidUpdate() {
        if (this.props.monster === null){
            Alert.alert("Victory!","You win the fight!",[
                {text:"Close",
                onPress:()=>{
                    this.props.navigation.goBack();
                }
                }]);
        } else if (this.props.state.dead){
            Alert.alert("Defeat!","You die!",[
                {text:"Close",
                onPress:()=>{
                    this.props.navigation.navigate('Death');
                }
                }]);
        }
    }

     flee = () => {
        const { goBack, getParam } = this.props.navigation;
        const { goToExit } = this.props;
        this.setState({ entries: []});
        goToExit(getParam('previousLocation'))
        goBack();
     }

     fight() {
         const {state,monster} = this.props;
         const rnd = (low,high)=> Math.floor((Math.random() * high) + low);
         const hits=hitOrder(state,rnd);
         let br = false;
         hits.forEach(h=> {
            if (!br){
                const cstate = this.props.state;
                hit(h, cstate, rnd, (act)=>{
                    this.addEntry(act);
                    getStateActions(act,monster).forEach(a=>this.props.dynamic(a));
                    br=act.death;
                });
            }
         });
         
     }

    addEntry(act){
        const { monster } = this.props;
        const critical = act.critical? "CRITICALLY ":""
        let entry="";
        switch (act.type){
            case MONSTER_MISS:
                entry=monster.miss || monster.name + " misses!";
                break;
            case MONSTER_HIT:
                if (monster.attacks){
                    let att = monster.attacks[0];
                    if (monster.attacks.length>1){
                        att=monster.attacks[Math.floor((Math.random() * monster.attacks.length) )]
                    }
                    entry= att.replace("${damages}",act.damages.toString());
                } else {
                    entry=monster.name+" "+critical+"hit for "+act.damages+" damages";
                }
               
                break;
            case CHARACTER_MISS:
                entry="You miss!";
                break;
            case CHARACTER_HIT:
                entry="You "+critical+"hit for "+act.damages+" damages";
                break;
        }
        this.setState((state) => ({entries:pushArray(state.entries,{key:state.entries.length.toString(), text:entry})}));
    }

     render() {
        const { navigate } = this.props.navigation;
        const { monster } = this.props;
        const { entries } = this.state;
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
                <FlatList
                    data={entries}
                    renderItem={({item}) => <Text style={styles.listText}>{item.text}</Text>}
                    />
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
      const monster = getMonsterInLocation(loc);
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