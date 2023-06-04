import { createReducer, on } from "@ngrx/store";
import { changeLoaderStyle, ChangePlaylistPanel, isLoaded, LoadingNetworkError, LoadingWebSocketError, Login, Logout, SetUserData, UpdatePlaylists, changePlaylistOpenState, changeNextSongTitle } from "./app.actions";

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
  loggedIn: boolean,
  pfp: string,
  username: string,
  playlistStyle: {bottom: string, width?: string},
  playlistOpenState: boolean,
  nextSongTitle: string | null,
  playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[],
}

export const initsalState: InintalStateI = {
  loaderStyle: {opacity: 1},
  isLoaded: false,
  loadingError: false,
  socketLoadingError: false,
  loggedIn: false,
  pfp: "null",
  username: "null",
  playlistStyle: {bottom: "-100vh", width: "calc(100vw - 300px)"},
  playlistOpenState: false,
  nextSongTitle: null,
  playlists: []
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
      username: action.username
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
  })
)