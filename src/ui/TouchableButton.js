/**
 * A button reacting to touch and styleable
 */
import React from 'react';
import { TouchableOpacity , StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
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

  TouchableButton.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    label: PropTypes.string
};

const styles = StyleSheet.create(buttonStyle);
