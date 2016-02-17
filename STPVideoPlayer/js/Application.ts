/// <reference path="_references.ts" />
module STPVideoPlayer {
    'use strict';
    var stpvideoplayer = angular.module('stpvideoplayer', []);

    //#region "declare objets for the application"
    stpvideoplayer.service('stpvideoplayer_dataservice', ['$http', '$log', '$rootScope', '$q', Services.stpvideoplayer_dataservice]);

    stpvideoplayer.controller('stpvideoplayermainCtrl', stpvideoplayermainCtrl);
    stpvideoplayer.controller('controlzoneCtrl', controlzoneCtrl);
    stpvideoplayer.controller('youtubePlayerCtrl', youtubePlayerCtrl);

    stpvideoplayer.directive('stpvideoplayer', stpvideoplayercontainerDirective);
    stpvideoplayer.directive('headerzone', headerzoneDirective);
    stpvideoplayer.directive('controlzone', controlzoneDirective);

    //video player
    stpvideoplayer.directive('youtubeplayer', youtubeDirective);
    stpvideoplayer.directive('localplayer', html5videoplayerDirective);
    stpvideoplayer.directive('playerzone', playerzoneDirective);

    //#endregion

    stpvideoplayer.run(function ($http: ng.IHttpService, $log: ng.ILogService, $rootScope: any) {
        $rootScope.url = "api";
        $rootScope.applicationname = "TV Player";

        $rootScope.computeTicks = (time: string): number => {
            if (time == undefined || time == "")
                return 0;

            var parts: string[] = time.split(':');

            var hour: number = parseInt(parts[0]);
            var minute: number = parseInt(parts[1]);

            var seconde: number = 0;

            if(parts.length == 3)
                seconde = parseInt(parts[2]);

            return (hour * 3600) + (minute * 60) + seconde;
        };

        $rootScope.tickToTime = (duration: number): string => {

            if (duration == 0)
                return "00:00:00";

            if (duration < 0)
                duration = duration + 1440;

            var dm: number = parseInt((duration / 60).toString());
            var ds: number = duration - (dm * 60);
            var dh: number = 0;

            if (dm > 60) {
                var o: number = dm;
                dh = o / 60;
                dm = o - (dh * 60);
            }

            var result: string = "";

            if (dh.toString().length == 1) {
                result = "0" + dh.toString() + ":";
            }
            else {
                result = dh.toString() + ":";
            }

            if (dm.toString().length == 1) {
                result += "0" + dm.toString();
            } else {
                result += dm.toString();
            }

            if (ds > 0) {
                result += ":";
                if (ds.toString().length == 1) {
                    result += "0" + ds.toString();
                } else {
                    result += ds.toString();
                }
            }

            return result;
        };

        $rootScope.computeDuration = (start: string, end: string): string => {
            if (start == undefined || start == "")
                return start;

            if (end == undefined || end == "")
                return start;

            var t1: number = $rootScope.computeTicks(start);
            var t2: number = $rootScope.computeTicks(end);

            var duration: number = t2 - t1;

            return $rootScope.tickToTime(duration);
        }
    });
}