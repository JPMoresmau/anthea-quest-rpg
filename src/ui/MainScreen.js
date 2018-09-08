import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {TouchableButton} from './TouchableButton';
import { getCurrentLocation } from '../State';
import { textStyle } from './Styles';

class MainScreen extends React.Component {
    static navigationOptions = {
      title: 'FatherSearch',
    };
    render() {
      const { navigate } = this.props.navigation;
      const { location } = this.props;
      return (
        
        <View style={styles.container}>
          <TouchableButton 
            onPress={() =>
              navigate('Menu', { })
            }
            text="Menu"
            label="Main menu"/>
          <Text style={styles.listText}>{location.name}</Text>
        </View>
      );
    }
  
  }

MainScreen.propTypes = {
  navigation: PropTypes.object,
  location: PropTypes.object
  };

const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  },textStyle);

  const mapStateToProps = state => {
    return {
        location: getCurrentLocation(state)
    };
  };

  export default connect(mapStateToProps)(MainScreen);