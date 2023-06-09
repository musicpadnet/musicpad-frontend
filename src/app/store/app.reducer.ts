import { createReducer, on } from "@ngrx/store";
import { changeLoaderStyle, ChangePlaylistPanel, isLoaded, LoadingNetworkError, LoadingWebSocketError, Login, Logout, SetUserData, UpdatePlaylists, changePlaylistOpenState, changeNextSongTitle, appIsReady, webScoketDisconnectError, isNotLoaded, appIsNotReady, changeUserMenuStyle, changeUserMenuOpen, changePreviewStyle, changeUserAccountSettingsMenuOpen, changeUserAccountSettingsMenuStyle } from "./app.actions";

interface IPlaylstItem {
  title: string,
  cid: string,
  type: string,
  duration: number,
  thumbnail: string,
  unavailable: boolean,
  _id: string
}

interface InintalStateI {
  loaderStyle: {opacity: number},
  isLoaded: boolean,
  loadingError: boolean,
  socketLoadingError: boolean,
  socketDisconnected: boolean,
  loggedIn: boolean,
  pfp: string,
  username: string,
  playlistStyle: {bottom: string, width?: string},
  playlistOpenState: boolean,
  nextSongTitle: string | null,
  appIsReady: boolean,
  playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[],
  userMenuIsOpen: boolean,
  userMenuStyle: {right: string},
  userAccountSettingsMenuStyle: {right: string},
  userAccountSettingsMenuOpen: boolean,
  prevStyle: {display: string},
  id: string | null
}

export const initsalState: InintalStateI = {
  loaderStyle: {opacity: 1},
  isLoaded: false,
  loadingError: false,
  appIsReady: false,
  socketLoadingError: false,
  loggedIn: false,
  pfp: "null",
  username: "null",
  id: null,
  socketDisconnected: false,
  playlistStyle: {bottom: "-100vh", width: "calc(100vw - 300px)"},
  playlistOpenState: false,
  nextSongTitle: null,
  playlists: [],
  userMenuIsOpen: false,
  userMenuStyle: {right: "-300px"},
  prevStyle: {display: "none"},
  userAccountSettingsMenuOpen: false,
  userAccountSettingsMenuStyle: {right: "-250px"}
}

export const AppReducer = createReducer(
  initsalState,
  on(changeLoaderStyle, (state, action) => {
    return {
      ...state,
      loaderStyle: action.style
    }
  }),
  on(isLoaded, (state) => {
    return {
      ...state,
      isLoaded: true
    }
  }),
  on(LoadingNetworkError, (state) => {
    return {
      ...state,
      loadingError: true
    }
  }),
  on(LoadingWebSocketError, (state) => {
    return {
      ...state,
      socketLoadingError: true
    }
  }),
  on(Login, (state) => {
    return {
      ...state,
      loggedIn: true
    }
  }),
  on(Logout, (state) => {
    return {
      ...state,
      loggedIn: false
    }
  }),
  on(SetUserData, (state, action) => {
    return {
      ...state,
      pfp: action.pfp,
      username: action.username,
      id: action.id
    }
  }),
  on(ChangePlaylistPanel, (state, action) => {
    return {
      ...state,
      playlistStyle: action.style
    }
  }),
  on(UpdatePlaylists, (state, action) => {
    return {
      ...state,
      playlists: action.playlists
    }
  }),
  on(changePlaylistOpenState, (state, action) => {
    return {
      ...state,
      playlistOpenState: action.open
    }
  }),
  on(changeNextSongTitle, (state, action) => {
    return {
      ...state,
      nextSongTitle: action.title
    }
  }),
  on(appIsReady, (state) => {
    return {
      ...state,
      appIsReady: true
    }
  }),
  on(webScoketDisconnectError, (state) => {
    return {
      ...state,
      socketDisconnected: true
    }
  }),
  on(isNotLoaded, (state) => {
    return {
      ...state,
      isLoaded: false
    }
  }),
  on(appIsNotReady, (state) => {
    return {
      ...state,
      appIsReady: false
    }
  }),
  on(changeUserMenuStyle, (state, action) => {
    return {
      ...state,
      userMenuStyle: action.style
    }
  }),
  on(changeUserMenuOpen, (state, action) => {
    return {
      ...state,
      userMenuIsOpen: action.isOpen
    }
  }),
  on(changePreviewStyle, (state, action) => {
    return {
      ...state,
      prevStyle: action.style
    }
  }),
  on(changeUserAccountSettingsMenuStyle, (state, action) => {
    return {
      ...state,
      userAccountSettingsMenuStyle: action.style
    }
  }),
  on(changeUserAccountSettingsMenuOpen, (state, action) => {
    return {
      ...state,
      userAccountSettingsMenuOpen: action.isOpen
    }
  })
)