import React,{Component} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { dropMainWeapon,dropSecondaryWeapon,dropQuestItem,dropPotion,usePotion } from '../Actions'

import {TouchableButton} from './TouchableButton';
import {weaponDescription} from './Names';
import {textStyle} from './Styles';

class InventoryScreen extends Component {
    static navigationOptions = {
      title: 'Inventory',
    };
    render() {
      const { inventory } = this.props;
      return (
        <View style={styles.container}>
          <MainItem text="Main Weapon" value={inventory.mainWeapon} onDrop={this.props.dropMainWeapon}/>
          <MainItem text="Secondary Weapon" value={inventory.secondaryWeapon} onDrop={this.props.dropSecondaryWeapon}/>
          <Text style={styles.listText}>Quest items</Text>
          <FlatList
            data={inventory.questItems}
            renderItem={({item}) => 
                <SecondaryItem text={item.key} onDrop={()=>this.props.dropQuestItem(item.type)}/> }
            />
          <Text style={styles.listText}>Potions</Text>
            <FlatList
                data={inventory.potions}
                renderItem={({item}) => 
                    <SecondaryItem text={item.key} onUse={()=>this.props.usePotion(item.type)} onDrop={()=>this.props.dropPotion(item.type)}/> }
                />
        </View>
      );
    }
  
  }

  InventoryScreen.propTypes = {
    inventory: PropTypes.object,
    dropMainWeapon: PropTypes.func,
    dropSecondaryWeapon: PropTypes.func,
    dropQuestItem: PropTypes.func,
    usePotion: PropTypes.func,
    dropPotion: PropTypes.func
    };

class MainItem extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Text style={styles.listText}>{this.props.text}:{this.props.value}</Text>
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

MainItem.propTypes = {
    text: PropTypes.string,
    value: PropTypes.string,
    onDrop: PropTypes.func
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
            mainWeapon: weaponDescription(state.inventory.mainWeapon),
            secondaryWeapon: weaponDescription(state.inventory.secondaryWeapon),
            questItems: state.inventory.questItems.map(i=>{return {key:i.name,type:i.type}}),
            potions: state.inventory.potions.map(i=>{return {key:i.name,type:i.type}})
        }
       
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