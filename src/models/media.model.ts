import { Genre } from "./genre.model";

export type VideoSrc = {
    HD: string;
    SD: string;
  }

export type TitleDetails = {
  episodeNumber: number;
  backdrop_path: string;
  overview: string;
  name: string;
  episode_run_time: number[];
  genres: Genre[]
}


export type SeasonDetails = {
  _id: string;
  air_date: string;
  overview: string;
  name: string;
  episodes: Episode[];
}

export type Episode = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: Crew[];
  guest_stars: GuestStar[]
}

export type GuestStar = {
  name: string;
  character: string;
}
export type Crew = {
  department: string;
  job: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: number
}