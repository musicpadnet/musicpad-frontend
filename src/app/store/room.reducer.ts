import { createReducer, on } from "@ngrx/store";
import { changeRoomIsOpen, changeRoomMenuStyle } from "./room.actions";

const initalState = {
  roomMenuStyle: {top: "-100vh"},
  roomMenuIsOpen: false
}

export const RoomReducer = createReducer(
  initalState,
  on(changeRoomMenuStyle, (state, action) => {
    return {
      ...state,
      roomMenuStyle: action.style
    }
  }),
  on(changeRoomIsOpen, (state, action) => {
    return {
      ...state,
      roomMenuIsOpen: action.isOpen
    }
  })
)