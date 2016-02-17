
module STPVideoPlayer {
    'use strict';

    export class youtubePlayerCtrl {

        static $inject = ["$rootScope", "$interval", "$log"];

        constructor(
            private $rootScope: stpvideoplayer_Iscope,
            private $interval: ng.IIntervalService,
            private $log: ng.ILogService
        ) {

            $log.debug('load youtube player');

            var player: YT.Player;

            var playerOptions: YT.PlayerOptions = {
                "playerVars": {
                    autoplay: 1,
                    disablekb: 1
                }, "events": {
                    "onReady":playerReady
                }
            };

            if ($rootScope.video.youtube && $rootScope.video.youtube.playList == false) {
                playerOptions.videoId = $rootScope.video.youtube.videoId;
            }

            playerOptions.width = "100%";
            playerOptions.height = "100%";

            function playerReady(evt) {

                $log.debug("youtube is intialized start to play video");                

                //evt.target.playVideo();

                var promise = $interval(function () {
                    $rootScope.retimevideo(promise, $rootScope.video);
                }, 1000);

                $rootScope.timer = promise;
            }

            player = new YT.Player("player", playerOptions);
        }
    }
}