/// <reference path="../../_references.ts" />
module STPVideoPlayer.Services {
    'use strict';

    export class stpvideoplayer_dataservice implements stpvideoplayer_Idataservice {

        private $log: ng.ILogService;
        private $rootScope: stpvideoplayer_Iscope;
        private $http: ng.IHttpService;

        static $inject = ['$http', '$log', '$rootScope', "$q"];

        public generic: () => ng.IPromise<any>;
        public nextvideo: () => ng.IPromise<any>;

        constructor($http: ng.IHttpService, $log: ng.ILogService, $rootScope: stpvideoplayer_Iscope, $q:ng.IQService) {
            this.$log = $log;
            this.$rootScope = $rootScope;
            this.$http = $http;

            this.generic = (): ng.IPromise<any> => {
                var wsurl = this.$rootScope.url + "/videoPlayerServer/GetGeneric";
                var deferred = $q.defer();
                return $http.get(wsurl).then(
                    function (response) {
                        deferred.resolve(response.data);
                        $rootScope.$broadcast('videoReceived', response.data);
                        return deferred.promise;
                    }, function (response) {
                        deferred.reject(response);
                        return deferred.promise;
                    });
            };

            this.nextvideo = (): ng.IPromise<any> => {
                var wsurl = this.$rootScope.url + "/videoPlayerServer/GetNextVideoTimeLine";
                var deferred = $q.defer();
                return $http.get(wsurl).then(
                    function (response) {
                        deferred.resolve(response.data);
                        $rootScope.$broadcast('videoReceived', response.data);
                        return deferred.promise;
                    }, function (response) {
                        deferred.reject(response);
                        return deferred.promise;
                    });
            };
        };
    }
}