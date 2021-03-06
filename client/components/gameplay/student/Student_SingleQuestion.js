import React, { Component } from 'react'
import { Card, Button, Container } from 'semantic-ui-react'
import history from '../../../history'
import { setGameOnStateThunk, setCurrentQuestionThunk, listenForGameStateChange, stopListeningForGameState, addToStudentStreak, breakStudentStreak, addToStudentScore, determineQuestionNumber } from '../../../store'
import { connect } from 'react-redux'



export class StudentSingleQuestion extends Component {
  constructor() {
    super();

    this.submitAnswer = this.submitAnswer.bind(this);

  }

  componentDidMount() {
    const gameRoomId = this.props.match.params.pin;
    const questionId = this.props.match.params.questionId;

    this.props.setGameOnStateThunk(gameRoomId)
    this.props.setCurrentQuestionThunk(questionId, gameRoomId)
    this.props.listenForGameStateChange(gameRoomId)
  }

  componentWillReceiveProps(nextProps) {
    const gameRoomId = this.props.match.params.pin;
    const questionId = this.props.match.params.questionId;
    const studentId = this.props.match.params.studentId

    if (nextProps.gameState === 'answeringQuestion') {
      history.replace(`/${gameRoomId}/waiting/${questionId}/${studentId}`)
    }
    else if (nextProps.gameState === 'gameOver'){
      history.replace(`/${gameRoomId}/gameOver/${studentId}`)
    }
  }

  componentWillUnmount() {
    const gameRoomId = this.props.match.params.pin;

    this.props.stopListeningForGameState(gameRoomId);
  }

  submitAnswer(e) {
    e.preventDefault();
    const questionObj = this.props.currentQuestion
    const questionId = this.props.match.params.questionId;
    const studentId = this.props.match.params.studentId
    const gameRoomId = this.props.match.params.pin;

    const rightAnswer = questionObj.rightAnswer
    if (e.target.value === rightAnswer) {
      this.props.addToStudentScore(studentId);
      this.props.addToStudentStreak(studentId)
    } else {
      this.props.breakStudentStreak(studentId)
    }

    history.replace(`/${gameRoomId}/waiting/${questionId}/${studentId}`)
  }

  render() {

    const currentQuestion = this.props.currentQuestion
    const answerArray = currentQuestion.answers ? Object.values(currentQuestion.answers) : []

    return (
          <div id="student-question-wrapper">
              <h1 id="student-single-question">{currentQuestion && currentQuestion.question}</h1>
            {
              answerArray.length === 2
              ?
              <div className="student-single-answer">
                <Button  color="orange" value={answerArray[0]} onClick={this.submitAnswer} className="answer-button">{answerArray.length && answerArray[0]}</Button>
                <Button color="orange" value={answerArray[1]} onClick={this.submitAnswer} className="answer-button">{answerArray.length && answerArray[1]}</Button>
              </div>
              :
              <div className="student-single-answer">
                <Button color="orange" value={answerArray[0]} onClick={this.submitAnswer} className="answer-button">{answerArray.length && answerArray[0]}</Button>
                <Button color="orange" value={answerArray[1]} onClick={this.submitAnswer} className="answer-button">{answerArray.length && answerArray[1]}</Button>
                <Button color="orange" value={answerArray[2]} onClick={this.submitAnswer} className="answer-button">{answerArray.length && answerArray[2]}</Button>
                <Button color="orange" value={answerArray[3]} onClick={this.submitAnswer} className="answer-button">{answerArray.length && answerArray[3]}</Button>
              </div>
            }
          </div>
    )
  }
}

const mapState = state => {
  return {
    currentGame: state.currentGame,
    currentQuestion: state.currentQuestion,
    currentStudent: state.currentStudent,
    gameState: state.gameState
  }
}

const mapDispatch = { setGameOnStateThunk, setCurrentQuestionThunk, listenForGameStateChange, stopListeningForGameState, addToStudentStreak, breakStudentStreak, addToStudentScore, determineQuestionNumber }

export default connect(mapState, mapDispatch)(StudentSingleQuestion)
