
 
 

 

/// <reference path="Enums.ts" />

declare module STPVideoPlayer.DataLayer {
	interface EpisodeModel extends STPVideoPlayer.DataLayer.LocalVideoModel {
		Id: number;
		EpisodeNumber: number;
		VideoType: string;
		VideoUrl: string;
	}
	interface LocalVideoModel {
		Poster: string;
		M4V: string;
		Mp4: string;
		Ogv: string;
		Webm: string;
	}
	interface PlayEpisodeModel {
		PlayDate: Date;
		EpisodeNumber: number;
	}
	interface TimeLineModel {
		Id: any;
		Name: string;
		Start: System.TimeSpan;
		End: System.TimeSpan;
		Type: string;
		Url: string;
		Local: STPVideoPlayer.DataLayer.LocalVideoModel;
		Youtube: STPVideoPlayer.DataLayer.YoutubeModel;
		PlayEpisodes: STPVideoPlayer.DataLayer.PlayEpisodeModel[];
		CurrentEpisode: STPVideoPlayer.DataLayer.EpisodeModel;
	}
	interface YoutubeModel {
		VideoId: string;
		PlayList: boolean;
	}
}
declare module System {
	interface TimeSpan {
		Ticks: number;
		Days: number;
		Hours: number;
		Milliseconds: number;
		Minutes: number;
		Seconds: number;
		TotalDays: number;
		TotalHours: number;
		TotalMilliseconds: number;
		TotalMinutes: number;
		TotalSeconds: number;
	}
}


