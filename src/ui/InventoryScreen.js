/**
 * Screen showing the inventory
 */
import React,{Component} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { dropMainWeapon,dropSecondaryWeapon,dropQuestItem,dropPotion,usePotion } from '../Actions'

import {TouchableButton} from './TouchableButton';
import {weaponDescription, toastCharacterChange} from './UIUtils';
import {textStyle} from './Styles';
import { allQuestItems, allPotions, allWeapons } from '../World';

class InventoryScreen extends Component {
    static navigationOptions = {
      title: 'Inventory',
    };
    render() {
      const { inventory } = this.props;
      return (
        <View style={styles.container}>
          <MainItem text="Main Weapon" value={inventory.mainWeapon} canDrop={inventory.mainWeapon!==weaponDescription(null)} onDrop={this.props.dropMainWeapon}/>
          {/*<MainItem text="Secondary Weapon" value={inventory.secondaryWeapon} canDrop={inventory.secondaryWeapon!==weaponDescription(null)} onDrop={this.props.dropSecondaryWeapon}/>*/}
          <Text style={styles.listText}>Quest items</Text>
          <FlatList
            data={inventory.questItems}
            renderItem={({item}) => 
                <SecondaryItem text={item.name} onDrop={()=>this.props.dropQuestItem(item.key)}/> }
            />
          <Text style={styles.listText}>Potions</Text>
            <FlatList
                data={inventory.potions}
                renderItem={({item}) => 
                    <SecondaryItem text={item.name} onUse={()=>this.props.usePotion(item.key)} onDrop={()=>this.props.dropPotion(item.key)}/> }
                />
        </View>
      );
    }
  
    componentDidUpdate(prevProps){
        const newChar=this.props.character;
        const oldChar=prevProps.character;
        toastCharacterChange(oldChar,newChar);
       
      }
  }

  InventoryScreen.propTypes = {
    inventory: PropTypes.object,
    dropMainWeapon: PropTypes.func,
    dropSecondaryWeapon: PropTypes.func,
    dropQuestItem: PropTypes.func,
    usePotion: PropTypes.func,
    dropPotion: PropTypes.func,
    character: PropTypes.object
    };

class MainItem extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Text style={styles.listText}>{this.props.text}:{this.props.value}</Text>
                { this.props.canDrop &&
                    <TouchableButton 
                    onPress={() => {
                        this.props.onDrop();
                    }}
                    text="Drop"
                    label="Drop"/>
                }
            </View>
        );
    }
}

MainItem.propTypes = {
    text: PropTypes.string,
    value: PropTypes.string,
    onDrop: PropTypes.func,
    canDrop: PropTypes.bool
    };

class SecondaryItem extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Text style={styles.bulletText}>{this.props.text}</Text>
                {
                    this.props.onUse && 
                    <TouchableButton 
                    onPress={() => {
                        this.props.onUse();
                    }}
                    text="Use"
                    label="Use"/>
                }
                <TouchableButton 
                onPress={() => {
                    this.props.onDrop();
                }}
                text="Drop"
                label="Drop"/>
            </View>
        );
    }
}

SecondaryItem.propTypes = {
    text: PropTypes.string,
    onUse: PropTypes.func,
    onDrop: PropTypes.func
    };

const styles = StyleSheet.create(Object.assign({},{ 
    container: {
      flex: 1,
      flexDirection: 'column',
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
    return {
        inventory : {
            mainWeapon: weaponDescription(allWeapons[state.inventory.mainWeapon]),
            secondaryWeapon: weaponDescription(allWeapons[state.inventory.secondaryWeapon]),
            questItems: state.inventory.questItems.map(i=>{return {key:i,name:allQuestItems[i].name}}),
            potions: state.inventory.potions.map(i=>{return {key:i,name:allPotions[i].name}})
        },
        character: state.character
       
    };
  };

const mapDispatchToProps = dispatch => {
    return {
        dropMainWeapon: () => {
            dispatch(dropMainWeapon());
        },
        dropSecondaryWeapon: () => {
            dispatch(dropSecondaryWeapon());
        },
        dropQuestItem: (name) => {
            dispatch(dropQuestItem(name));
        },
        dropPotion: (name) => {
            dispatch(dropPotion(name));
        },
        usePotion: (name) => {
            dispatch(usePotion(name));
        }
    }
  }

  export default connect(mapStateToProps,mapDispatchToProps)(InventoryScreen);