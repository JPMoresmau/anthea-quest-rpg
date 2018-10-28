/**
 * Screen showing the list of known spells
 */
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { allSpells } from '../World';
import { textStyle } from './Styles';

class SpellScreen extends React.Component {
    static navigationOptions = {
      title: 'Known Spells',
    };
    render() {
      const { spells } = this.props;
      return (
        <View style={styles.container}>
          <FlatList
            data={spells}
            renderItem={({item}) => 
                <Text style={styles.listText}>{item.name}</Text>}
            />
         
          
        </View>
      );
    }
    
  
  }

SpellScreen.propTypes = {
    navigation: PropTypes.object,
    spells: PropTypes.array
};

const styles = StyleSheet.create(Object.assign({},{ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }
  },textStyle));

 
  const mapStateToProps = state => {
    return {spells:state.spells
        .map(s=>({key: s, name: allSpells[s].name+': '+allSpells[s].description}))
        .sort((a,b)=>a.name.localeCompare(b.name))
        };
  };


  export default connect(mapStateToProps)(SpellScreen);