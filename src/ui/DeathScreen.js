/**
 * screen shown when you're dead
 */
import React,{Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { textStyle } from './Styles';

class DeathScreen extends Component {
    static navigationOptions = {
      title: 'Anthea has failed',
    };
    render() {
      const { navigate } = this.props.navigation;
      const { level, kills } = this.props;
      return (
        
        <View style={styles.container}>
          <TouchableButton 
            onPress={() =>
              navigate('Menu', { })
            }
            text="Menu"
            label="Main menu"/>
            <Text style={styles.listText}>You are dead!</Text>
            <Text style={styles.bulletText}>You&apos;ve reached level {level}.</Text>
            <Text style={styles.bulletText}>You&apos;ve killed {kills} monsters.</Text>
         </View>
      );
    }

}


DeathScreen.propTypes = {
    navigation: PropTypes.object,
    level: PropTypes.number,
    kills: PropTypes.number
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
    return {
        level: state.character.level,
        kills: state.kills
    };
}

export default connect(mapStateToProps)(DeathScreen);