
module STPVideoPlayer {
    'use strict';

    export class stpvideoplayermainCtrl {

        static $inject = ["$rootScope", "$scope", "$timeout", "$interval", "$log", "$http", "$q", "stpvideoplayer_dataservice"];

        public generic: () => void;
        public getnextvideo: () => void;        

        public video: STPVideoPlayer.DataLayer.TimeLineModel;

        constructor(
            private $rootScope: stpvideoplayer_Iscope,
            private $scope: any,
            private $timeout: ng.ITimeoutService,
            private $interval:ng.IIntervalService,
            private $log: ng.ILogService,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private stpvideoplayer_dataservice: Services.stpvideoplayer_dataservice
        ) {
            
            this.generic = (): void=> {
                stpvideoplayer_dataservice.generic().then(function (result) {

                    $timeout(function () {
                        $scope.$apply(function () {

                            this.computevideo(result);

                            $scope.video = result;
                            $rootScope.$broadcast("videochanged", result);

                        });
                    }, 0);
                   
                }, function (error) {
                    $log.error(error.statusText);
                });
            };

            this.getnextvideo = (): void=> {
                nextvideo();
            };

            function nextvideo() {
                stpvideoplayer_dataservice.nextvideo().then(function (result) {
                    $scope.parseresult(result);
                    $rootScope.$emit('videogetted', result);
                }, function (error) {
                    $log.error(error.statusText);
                });
            }

            $scope.parseresult = (result: any): void=> {
                $timeout(function () {
                    $scope.$apply(function () {

                        $scope.computevideo(result);

                        $scope.video = result;
                        $rootScope.$broadcast("videochanged", result);
                        $log.debug("video charged " + result.name);
                    });
                }, 0);
            };

            $rootScope.retimevideo = (promise: any, video:any): void => {

                var remaintimeTotal: number = video.remaintimeTotal;
                remaintimeTotal = remaintimeTotal - 1;

                if (remaintimeTotal > 0) {
                    var remaintime: string = $rootScope.tickToTime(remaintimeTotal);
                    $scope.video.remaintimeTotal = remaintimeTotal;
                    video.remaintime = $rootScope.tickToTime(remaintimeTotal);
                    $rootScope.$broadcast("videochanged", video);
                    $log.debug("video charged " + video.name + "remain time " + video.remaintime);
                } else {
                    $interval.cancel(promise);
                    nextvideo();
                }
            };

            $scope.computevideo = (video:any):void=>{
                var duration: string = $rootScope.computeDuration(video.start, video.end);
                var remaintimeTotal: number = $rootScope.computeTicks(duration);
                var remaintime: string = $rootScope.tickToTime(remaintimeTotal);

                angular.extend(video, {
                    duration: duration,
                    remaintimeTotal: remaintimeTotal,
                    remaintime: remaintime
                });

                $rootScope.video = video;
            };

            $rootScope.$on('videochanged', function (evt, result) {
                $log.debug("video changed " + result.name);
            });

            this.getnextvideo();
        }

        
    }
}