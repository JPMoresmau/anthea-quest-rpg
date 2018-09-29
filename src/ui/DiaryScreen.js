import React,{Component} from 'react';
import { FlatList, SectionList, StyleSheet, Switch, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {textStyle} from './Styles';
import { allQuests } from '../World';
import { pushArray } from '../Utils';

class DiaryScreen extends Component {
    static navigationOptions = {
      title: "Anthea's diary",
    };
    constructor(props) {
      super(props);
      this.state = { showQuests : false};
    }
    render() {
      const { entries } = this.props;
      let list;
      if (this.state.showQuests){
        const qs={};
        entries.forEach(e => {
          let a=qs[e.quest];
          qs[e.quest]=pushArray(a,e);
        });
        const sections=[];
        for (const q in qs){
          sections.push({'key':q,'title':allQuests[q].text,'data':qs[q]})
        }
        list=<SectionList
             renderSectionHeader={({section}) => <Text style={styles.listText}>{section.title}</Text>}
             renderItem={({item}) => <Text style={styles.bulletText}>{item.key}</Text>}
             sections={sections}
            />
        
      } else {
        list=<FlatList
          data={entries}
          renderItem={({item}) => <Text style={styles.listText}>{item.key}</Text>}
          />
      }
      return (
        
        <View style={styles.container}>
          <Text style={styles.listText}>Show by quests?</Text>
          <Switch onValueChange={(value) => this.setState({ showQuests: value })}  value={ this.state.showQuests } />
          {list}
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
        entries: state.diary.map(v => ({'key':v.text,'quest':v.quest,'tick':v.tick}))
    };
  };

  export default connect(mapStateToProps)(DiaryScreen);