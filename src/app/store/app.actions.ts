import { createAction, props } from "@ngrx/store";

export const changeLoaderStyle = createAction("[Preloader Component] Change Style", props<{style: {opacity: number}}>());
export const isLoaded = createAction("[Preloader Component] IsLoaded");
export const LoadingNetworkError = createAction("[Preloader Component] Network Error");
export const LoadingWebSocketError = createAction("[Preloader Component] Socket Connection Error");
export const Login = createAction("[Auth Service] Login");
export const Logout = createAction("[Auth Service] Logout");
export const SetUserData = createAction("[App Component] Set User Data", props<{pfp: string, username: string}>());
export const ChangePlaylistPanel = createAction("[PlaylistPanel open panel]", props<{style: { bottom: string}}>());
export const UpdatePlaylists = createAction("[Playlist Component] updatePlaylists", props<{playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}>());