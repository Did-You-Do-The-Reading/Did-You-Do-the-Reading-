// import history from '../history'
import firebase from '../../server/firebase'


/* -----------------    ACTIONS     ------------------ */

const SET_QUESTION_SET_ON_STATE = 'SET_QUESTION_SET_ON_STATE';



/* ------------   ACTION CREATORS     ------------------ */

export const setQuestionSetOnState = questionSet => {
  return {
    type: SET_QUESTION_SET_ON_STATE,
    questionSet
  }
}

// export const deleteQuestionFromState = question => {
//   return {
//     type: DELETE_QUESTION_FROM_STATE,
//     question
//   }
// }

/* ------------       THUNK HELPERS     ------------------ */

const activeListeners = {}


/* ------------       THUNK CREATORS     ------------------ */

export const fetchQuestionSetThunk = (qSetId) => dispatch => {
  const path = `questionSets/${qSetId}`
  const ref = firebase.database().ref(path)
  const listener = snapshot => {
    dispatch(setQuestionSetOnState(snapshot.val()))
  }
  activeListeners[path] = { ref, listener }
  ref.on('value', listener)
}

export const deleteQuestionFromSetThunk = (qSetId, qestionId) => async dispatch => {
  const questionRef = firebase.database().ref(`questionSets/${qSetId}`).child(qestionId)
  questionRef.remove()
  .catch((error) => console.error('error removing question: ', error))
}

export const stopFetchingQuestionSetsThunk = qSetId => dispatch => {
  const path = `questionSets/${qSetId}`
  const { ref, listener } = activeListeners[path]
  ref.off('value', listener)
  delete activeListeners[path]
}



/* ------------       REDUCER     ------------------ */

export default function (questionSet = {}, action){
  switch (action.type){
    case SET_QUESTION_SET_ON_STATE:
      return action.questionSet;
    default:
      return questionSet;
  }
}