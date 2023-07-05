export type Media = {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  genres: string[];
  media_type: string;
  overview: string;
  original_language: string;
  poster_path: string;
  title: string;
  title_id: string;
  title_video_id: string;
  video: boolean;
  video_src: Src;
  adult: boolean;
  name?: string;
  vote_average: number;
};

type Src = {
  SD: string;
  HD: string;
};

export type GenreWithMedia = {
  id: number;
  name: string;
  titles: Media[];
};

export type Genre = {
  id: number;
  name: string;
};
