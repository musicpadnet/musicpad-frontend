import { createAction, props } from "@ngrx/store";

interface IPlaylstItem {
  title: string,
  cid: string,
  type: string,
  duration: number,
  thumbnail: string,
  unavailable: boolean,
  _id: string
}

export const changeLoaderStyle = createAction("[Preloader Component] Change Style", props<{style: {opacity: number}}>());
export const isLoaded = createAction("[Preloader Component] IsLoaded");
export const LoadingNetworkError = createAction("[Preloader Component] Network Error");
export const LoadingWebSocketError = createAction("[Preloader Component] Socket Connection Error");
export const Login = createAction("[Auth Service] Login");
export const Logout = createAction("[Auth Service] Logout");
export const SetUserData = createAction("[App Component] Set User Data", props<{pfp: string, username: string, id: string | null}>());
export const ChangePlaylistPanel = createAction("[PlaylistPanel open panel]", props<{style: { bottom: string, width?: string}}>());
export const UpdatePlaylists = createAction("[Playlist Component] updatePlaylists", props<{playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[]}>());
export const changePlaylistOpenState = createAction("[Playlist Component] updatePlaylistOpenstate", props<{open: boolean}>());
export const changeNextSongTitle = createAction("[Playlist Change Next Song Title]", props<{title: string}>());
export const appIsReady = createAction("[App] is ready");
export const webScoketDisconnectError = createAction("[Preloader Component] Websocket Disconnected");
export const isNotLoaded = createAction("[Preloader Component] IsNotLoaded");
export const appIsNotReady = createAction("[App] is not ready");
export const changeUserMenuStyle = createAction("[user menu] change style", props<{style: {right: string}}>());
export const changeUserMenuOpen = createAction("[user menu] change open", props<{isOpen: boolean}>());
export const changePreviewStyle = createAction("[Video Prev] change Style", props<{style: {display: string}}>());
export const changeUserAccountSettingsMenuStyle = createAction("[User Sub Menu] change style", props<{style: {right: string}}>());
export const changeUserAccountSettingsMenuOpen = createAction("[User Sub Menu] change open", props<{isOpen: boolean}>());