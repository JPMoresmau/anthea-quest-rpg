import React from 'react';
import { TouchableOpacity , StyleSheet, Text, View } from 'react-native';

import {buttonStyle} from './Styles';

export class TouchableButton extends React.Component {
     render() {
      return (
          <TouchableOpacity 
            onPress={this.props.onPress}
            title={this.props.text}
            style={styles.button}
            accessibilityLabel={this.props.label}
          ><Text style={styles.buttonText}> {this.props.text} </Text>
          </TouchableOpacity>
       
      );
    }
  
  }



const styles = StyleSheet.create(buttonStyle);
