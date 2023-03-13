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
};

type Src = {
  SD: string;
  HD: string;
};