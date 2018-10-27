import React,{Component} from 'react';
import { Alert, FlatList, Picker, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { getCurrentLocation, getMonsterInLocation } from '../State';
import { textStyle } from './Styles';
import { moveTo } from '../Actions';
import { hitOrder, getStateActions, hit, CHARACTER_HIT, CHARACTER_MISS, MONSTER_HIT, MONSTER_MISS, SPELL_MISS, SPELL_HIT } from '../Combat';
import { pushArray } from '../Utils';
import { allSpells } from '../World';

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
        const spell = props.spells.length?props.spells[0]:null;
        this.state = { entries : [], spell};
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
        this.setState({ entries: [], spell:null});
        goToExit(getParam('previousLocation'))
        goBack();
     }

     fight(spell) {
         const {state,monster} = this.props;
         const rnd = (low,high)=> Math.floor((Math.random() * high) + low);
         const fst= {state,rnd,spell};
         const hits=hitOrder(fst);
         let br = false;
         hits.forEach(h=> {
            if (!br){
                const cstate = this.props.state;
                hit(h, {...fst,state:cstate}, (act)=>{
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
            case SPELL_MISS:
                entry="The spell fizzles";
                break;
            case SPELL_HIT:
                entry=act.result.description;
                break;
        }
        this.setState((state) => ({...state,
            entries:pushArray(state.entries,{key:state.entries.length.toString(), text:entry})}));
    }

     render() {
        const { navigate } = this.props.navigation;
        const { monster, spells } = this.props;
        const { entries } = this.state;
        let content;
        if (monster){
            content=<Text>{monster.name}</Text>;
        } else {
            content=<Text></Text>;
        }
        let spellChoice;
        if (spells && spells.length){
            const spellItems = spells.map(s=>{
                return <Picker.Item key={s} label={allSpells[s].name} value={s} />;
            });
            spellChoice=<View><Picker
                selectedValue={this.state.spell}
                style={{ height: 50, width: 100 }}
                onValueChange={(itemValue) => this.setState({...this.state,spell: itemValue})}>
                {spellItems}
                
            </Picker>
            <TouchableButton 
                onPress={() =>
                this.fight(this.state.spell)
                }
                text="Cast"
                label="Cast a spell"/></View>;
        } else {
            spellChoice=<Text></Text>;
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
                {spellChoice}
            </View>
        );
        
    }

}


MonsterScreen.propTypes = {
    navigation: PropTypes.object,
    state: PropTypes.object,
    spells: PropTypes.array,
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
          spells: state.spells,
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