import listSongs from "../functions/songs/listSongs";
import getSongById from "../functions/songs/getSongById";
import querySongByArtist from "../functions/songs/querySongByArtist"
import Song from "../types/Song";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string;
    songId: string;
    artistSlug: string;
    songSlug: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<Song[] | Song | string | null | undefined> {
  switch (event.info.fieldName) {
    case "listSongs":
      return await listSongs();
    case "getSongById":
      return await getSongById(event.arguments.userId, event.arguments.songId);
    case "querySongByArtist":
      return await querySongByArtist(event.arguments.artistSlug, event.arguments.songSlug);
    default:
      return null;
  }
}