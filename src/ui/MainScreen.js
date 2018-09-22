import React,{Component} from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { getCurrentLocation, getNPC, getExits, getInteraction } from '../State';
import { textStyle } from './Styles';
import { pickUpMainWeapon, pickUpQuestItem, pickUpPotion, moveTo } from '../Actions';
import { weaponDescription, toastCharacterChange } from './UIUtils';
import { allPotions, allQuestItems } from '../World';



class MainScreen extends Component {
    static navigationOptions = {
      title: 'FatherSearch',
    };
    render() {
      const { navigate } = this.props.navigation;
      const { location, npcs, weapons, questItems, potions, exits } = this.props;
      return (
        
        <View style={styles.container}>
          <TouchableButton 
            onPress={() =>
              navigate('Menu', { })
            }
            text="Menu"
            label="Main menu"/>
          <Text style={styles.listText}>You are in: {location.name}</Text>
          <Text style={styles.bulletText}>{location.description}</Text>
          <Text style={styles.listText}>You see:</Text>
          <FlatList
            data={npcs}
            renderItem={({item}) => 
                <NPCComponent text={item.name} onInteract={()=>this.interactWithNPC(item.key,item.name)}/> }
            />
            <FlatList
            data={weapons}
            renderItem={({item}) => 
                <ItemComponent text={item.name} onPickup={()=>this.props.pickUpWeapon(item.key)}/> }
            />
              <FlatList
            data={questItems}
            renderItem={({item}) => 
                <ItemComponent text={item.name} onPickup={()=>this.props.pickUpItem(item.key)}/> }
            />
              <FlatList
            data={potions}
            renderItem={({item}) => 
                <ItemComponent text={item.name} onPickup={()=>this.props.pickUpPotion(item.key)}/> }
            />
            <Text style={styles.listText}>You can go to:</Text>
            <FlatList
            data={exits}
            renderItem={({item}) => 
                <ExitComponent text={item.name} onMove={()=>this.props.goToExit(item.key)}/> }
            />
           
        </View>
      );
    }
    interactWithNPC(npcKey,npcName){
      
      const interaction = getInteraction(this.props.state,npcKey);
      if ("question" == interaction.type){
          Alert.alert(npcName +":",'"'+interaction.beforeText+'"',[
          {text:"Yes",
           onPress:()=>{
            if (interaction.actions){
              interaction.actions.forEach(a=>this.props.dynamic(a));
            }
            Alert.alert(npcName +":",'"'+interaction.afterText+'"',[
              {text:"Close"}]);
            }
          },
          {text:"No"}]);
      } else {
          Alert.alert(npcName +":",'"'+interaction.text+'"',[
          {text:"Close",
           onPress:()=>{
            if (interaction.actions){
              interaction.actions.forEach(a=>this.props.dynamic(a));
            }
         }
          }]);
        
      }
     
    }

    componentDidUpdate(prevProps){
      const newChar=this.props.state.character;
      const oldChar=prevProps.state.character;
      toastCharacterChange(oldChar,newChar);
     
    }
  }

MainScreen.propTypes = {
  navigation: PropTypes.object,
  state: PropTypes.object,
  location: PropTypes.object,
  npcs: PropTypes.array,
  dynamic: PropTypes.func,
  weapons: PropTypes.array,
  pickUpWeapon: PropTypes.func,
  questItems: PropTypes.array,
  pickUpItem: PropTypes.func,
  potions: PropTypes.array,
  pickUpPotion: PropTypes.func,
  exits: PropTypes.array,
  goToExit: PropTypes.func,
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
    const npcs=loc.npcs.map(n=>getNPC(state,n));
    const weapons = loc.weapons.map(w=>{
        return {'key':w.name,'name':weaponDescription(w)};
      });
    const questItems = loc.questItems.map(i=>{
        return {'key':i,'name':allQuestItems[i].name};
      });  
    const potions = loc.potions.map(i=>{
        return {'key':i,'name':allPotions[i].name};
      });    
    const exits = getExits(state);

    return {
        state: state,
        location: loc,
        npcs: npcs,
        weapons: weapons,
        questItems: questItems,
        potions: potions,
        exits: exits
    };
  };


  const mapDispatchToProps = dispatch => {
    return {
       dynamic: (action) => {
           dispatch(action);
        },
        pickUpWeapon: (name) => {
          dispatch(pickUpMainWeapon(name));
        } ,
        pickUpItem: (name) => {
          dispatch(pickUpQuestItem(name));
        },
        pickUpPotion: (name) => {
          dispatch(pickUpPotion(name));
        },
        goToExit: (name) => {
          dispatch(moveTo(name));
        }
      }
    };

  export default connect(mapStateToProps,mapDispatchToProps)(MainScreen);


class NPCComponent extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Text style={styles.bulletText}>{this.props.text}</Text>
                <TouchableButton 
                onPress={() => {
                    this.props.onInteract();
                }}
                text="Interact"
                label="Interact"/>
            </View>
        );
    }
}

NPCComponent.propTypes = {
  text: PropTypes.string,
   onInteract: PropTypes.func
  };

  class ItemComponent extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Text style={styles.bulletText}>{this.props.text}</Text>
                <TouchableButton 
                onPress={() => {
                    this.props.onPickup();
                }}
                text="Pickup"
                label="Pickup"/>
            </View>
        );
    }
}

ItemComponent.propTypes = {
  text: PropTypes.string,
  onPickup: PropTypes.func
  };

  class ExitComponent extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Text style={styles.bulletText}>{this.props.text}</Text>
                <TouchableButton 
                onPress={() => {
                    this.props.onMove();
                }}
                text="Go"
                label="Go"/>
            </View>
        );
    }
}

ExitComponent.propTypes = {
  text: PropTypes.string,
  onMove: PropTypes.func
  };
