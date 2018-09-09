import React,{Component} from 'react';
import {FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { getCurrentLocation, getNPC } from '../State';
import { textStyle } from './Styles';
import { pickUpMainWeapon, pickUpQuestItem, pickUpPotion } from '../Actions';
import { weaponDescription } from './Names';

class MainScreen extends Component {
    static navigationOptions = {
      title: 'FatherSearch',
    };
    render() {
      const { navigate } = this.props.navigation;
      const { location, npcs, weapons, questItems, potions } = this.props;
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
                <NPCComponent text={item.name} onInteract={()=>this.props.interact(item.key)}/> }
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
        </View>
      );
    }
  
  }

MainScreen.propTypes = {
  navigation: PropTypes.object,
  location: PropTypes.object,
  npcs: PropTypes.array,
  interact: PropTypes.func,
  weapons: PropTypes.array,
  pickUpWeapon: PropTypes.func,
  questItems: PropTypes.array,
  pickUpItem: PropTypes.func,
  potions: PropTypes.array,
  pickUpPotion: PropTypes.func,
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
        return {'key':i.name,'name':i.name};
      });  
    const potions = loc.potions.map(i=>{
        return {'key':i.name,'name':i.name};
      });    
    return {
        location: loc,
        npcs: npcs,
        weapons: weapons,
        questItems: questItems,
        potions: potions
    };
  };


  const mapDispatchToProps = dispatch => {
    return {
       interact: () => {
           
        },
        pickUpWeapon: (name) => {
          dispatch(pickUpMainWeapon(name));
        } ,
        pickUpItem: (name) => {
          dispatch(pickUpQuestItem(name));
        },
        pickUpPotion: (name) => {
          dispatch(pickUpPotion(name));
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
