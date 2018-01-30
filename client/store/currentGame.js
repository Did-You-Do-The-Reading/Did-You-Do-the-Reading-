import history from '../history'
import firebase from '../../server/firebase'

/* -----------------    ACTIONS     ------------------ */

const SET_GAME_ON_STATE = 'SET_GAME_ON_STATE'

/* ------------   ACTION CREATORS     ------------------ */

export const setGameOnState = game => ({type: SET_GAME_ON_STATE, game})

/* ------------       THUNK CREATORS     ------------------ */

export const setGameOnStateThunk = id => dispatch => {
  firebase.database().ref(`gameRooms/${id}/quiz`)
    .once('value', snapshot => {
      const currentGame = snapshot.val();
      dispatch(setGameOnState(currentGame))
      });
  }

export const buildNewGameRoomThunk = (quiz, teacherId, pin) => dispatch => {
  const gameRoomRef = firebase.database().ref('gameRooms');
  gameRoomRef.child(pin).set({
    quiz: quiz,
    teacherId: teacherId,
    pin: pin,
    gameState: 'waitingRoom'
  })
}

/* ------------       REDUCER     ------------------ */


export default function (currentGame = {}, action) {
  switch (action.type) {
    case SET_GAME_ON_STATE:
    return action.game
    default:
      return currentGame
  }
}
