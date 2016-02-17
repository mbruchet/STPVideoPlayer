/// <reference path="../../_references.ts" />
module STPVideoPlayer {
    'use strict';

    export interface stpvideoplayer_Iscope extends ng.IScope {
        url: string;
        video: any;

        computeDuration: (start: string, end: string) => string;
        computeTicks: (time: string) => number;
        tickToTime: (duration: number) => string;
        retimevideo: (promise: any, video: any) => void;
        timer: ng.IPromise<any>;
    }
}