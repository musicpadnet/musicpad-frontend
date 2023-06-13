import { createAction, props } from "@ngrx/store";

export const changeRoomMenuStyle = createAction("[Room Menu] change style", props<{style: {top: string}}>());
export const changeRoomIsOpen = createAction("[Room Menu] Chnage is open state", props<{isOpen: boolean}>())