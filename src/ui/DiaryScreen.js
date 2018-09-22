import React,{Component} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {textStyle} from './Styles';

class DiaryScreen extends Component {
    static navigationOptions = {
      title: "Anthea's diary",
    };
    render() {
      const { entries } = this.props;
      return (
        
        <View style={styles.container}>
          <FlatList
            data={entries}
            renderItem={({item}) => <Text style={styles.listText}>{item.key}</Text>}
            />

          </View>
      );
    }
  
  }

const styles = StyleSheet.create(Object.assign({},{ 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }
  },textStyle));

  DiaryScreen.propTypes = {
    entries: PropTypes.array
    };

  const mapStateToProps = state => {
    return {
        entries: state.diary.map(v => ({key:v}))
    };
  };

  export default connect(mapStateToProps)(DiaryScreen);