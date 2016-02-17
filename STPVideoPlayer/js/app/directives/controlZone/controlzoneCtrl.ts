
module STPVideoPlayer {
    'use strict';

    export class controlzoneCtrl {

        static $inject = ["$rootScope", "$scope", "$timeout", "$interval", "$log", "$http", "$q", "stpvideoplayer_dataservice"];

        public stopvideo: () => void;
        public playvideo: () => void;

        constructor(
            private $rootScope: stpvideoplayer_Iscope,
            private $scope: any,
            private $timeout: ng.ITimeoutService,
            private $interval: ng.IIntervalService,
            private $log: ng.ILogService,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private stpvideoplayer_dataservice: Services.stpvideoplayer_dataservice
        ) {
            this.stopvideo = () : void =>{

                $interval.cancel($rootScope.timer);
                $log.debug('stop play video');
                $scope.stopped = true;
            };

            this.playvideo = (): void => {
                $log.debug('restart play video');

                var promise = $interval(function () {
                    $rootScope.retimevideo(promise, $rootScope.video);
                }, 1000);

                $rootScope.timer = promise;
                $scope.stopped = false;
            };
        };
    }
}