/// <reference path="stpvideoplayer_dataservicetest_references.ts" />
module STPVideoPlayer {
    'use strict';

    export class stpvideoplayer_dataserviceTestCtrl {

        static $inject = ["$rootScope", "$scope", "$timeout", "$log", "$http", "$q", "stpvideoplayer_dataservice"];

        $stpvideoplayer_dataservice: stpvideoplayer_Idataservice;

        log: ng.ILogService;

        click: () => void;
        ctrl: stpvideoplayer_dataserviceTestCtrl;

        public video: STPVideoPlayer.DataLayer.TimeLineModel;

        constructor(
            private $rootScope: stpvideoplayer_Iscope,
            private $scope: any,
            private $timeout: ng.ITimeoutService,
            private $log: ng.ILogService,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private stpvideoplayer_dataservice: stpvideoplayer_Idataservice
        ) {
            this.$stpvideoplayer_dataservice = stpvideoplayer_dataservice;
            this.log = $log;
            this.ctrl = this;

            this.click = (): void=> {
                var ctrl = this.ctrl;
                this.$stpvideoplayer_dataservice.generic().then(function (result) {

                    $timeout(function (){
                        $scope.$apply(function () {
                            $scope.video = result;
                            $rootScope.$broadcast("videochanged", result);
                        });
                    }, 0);

                        }, function (error) {
                    $log.error(error.statusText);
                    });
            };

            $rootScope.$on('videochanged', function (evt, result) {
                $log.debug("video changed " + result.name);
            });
        }



    }
}