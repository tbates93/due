import React, { Component } from 'react';
import router from './router.js'
import './App.css';
import { connect } from 'react-redux';
import { getUser, getClassInfo, setEvents, setTopFive } from './ducks/reducer.js';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)

    this.getAll = this.getAll.bind(this);
  }

  componentWillMount() {
    this.props.getUser().then(res => {
      console.log('faslkdfjaosifjhaosdifjasdo', res)
      this.getAll(res.value.user_id)
    })
  }

  componentWillReceiveProps(newProps){
    this.getAll(newProps.user.user_id)
  }

  getAll(userId){
    axios.get(`/api/assignments/getall/${userId}`).then(
      events => {
        events.data.map((event, index) => {
          event.start = new Date(event.start)
          event.end = new Date(event.end)

        })
        
        this.props.setEvents(events.data)

        axios.get(`/api/assignments/get/topfive/${userId}`).then(response => {
          // this.setState({ topFive: response.data })
          this.props.setTopFive(response.data)
        })
      })
    this.props.getClassInfo(userId).then(res => {
      console.log('app res', res)
    });
  }

  render() {
    return (
      <div className="App">
        {router}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    calId: state.calId,
    classInfo: state.classInfo
  }
}
export default connect(mapStateToProps, { getUser, getClassInfo, setEvents, setTopFive })(App);
