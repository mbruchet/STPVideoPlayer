/// <reference path="../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../_references.ts" />
/// <reference path="../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    var Services;
    (function (Services) {
        'use strict';
        var stpvideoplayer_dataservice = (function () {
            function stpvideoplayer_dataservice($http, $log, $rootScope, $q) {
                var _this = this;
                this.$log = $log;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.generic = function () {
                    var wsurl = _this.$rootScope.url + "/videoPlayerServer/GetGeneric";
                    var deferred = $q.defer();
                    return $http.get(wsurl).then(function (response) {
                        deferred.resolve(response.data);
                        $rootScope.$broadcast('videoReceived', response.data);
                        return deferred.promise;
                    }, function (response) {
                        deferred.reject(response);
                        return deferred.promise;
                    });
                };
                this.nextvideo = function () {
                    var wsurl = _this.$rootScope.url + "/videoPlayerServer/GetNextVideoTimeLine";
                    var deferred = $q.defer();
                    return $http.get(wsurl).then(function (response) {
                        deferred.resolve(response.data);
                        $rootScope.$broadcast('videoReceived', response.data);
                        return deferred.promise;
                    }, function (response) {
                        deferred.reject(response);
                        return deferred.promise;
                    });
                };
            }
            ;
            stpvideoplayer_dataservice.$inject = ['$http', '$log', '$rootScope', "$q"];
            return stpvideoplayer_dataservice;
        })();
        Services.stpvideoplayer_dataservice = stpvideoplayer_dataservice;
    })(Services = STPVideoPlayer.Services || (STPVideoPlayer.Services = {}));
})(STPVideoPlayer || (STPVideoPlayer = {}));
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    var stpvideoplayermainCtrl = (function () {
        function stpvideoplayermainCtrl($rootScope, $scope, $timeout, $interval, $log, $http, $q, stpvideoplayer_dataservice) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$interval = $interval;
            this.$log = $log;
            this.$http = $http;
            this.$q = $q;
            this.stpvideoplayer_dataservice = stpvideoplayer_dataservice;
            this.generic = function () {
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
            this.getnextvideo = function () {
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
            $scope.parseresult = function (result) {
                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.computevideo(result);
                        $scope.video = result;
                        $rootScope.$broadcast("videochanged", result);
                        $log.debug("video charged " + result.name);
                    });
                }, 0);
            };
            $rootScope.retimevideo = function (promise, video) {
                var remaintimeTotal = video.remaintimeTotal;
                remaintimeTotal = remaintimeTotal - 1;
                if (remaintimeTotal > 0) {
                    var remaintime = $rootScope.tickToTime(remaintimeTotal);
                    $scope.video.remaintimeTotal = remaintimeTotal;
                    video.remaintime = $rootScope.tickToTime(remaintimeTotal);
                    $rootScope.$broadcast("videochanged", video);
                    $log.debug("video charged " + video.name + "remain time " + video.remaintime);
                }
                else {
                    $interval.cancel(promise);
                    nextvideo();
                }
            };
            $scope.computevideo = function (video) {
                var duration = $rootScope.computeDuration(video.start, video.end);
                var remaintimeTotal = $rootScope.computeTicks(duration);
                var remaintime = $rootScope.tickToTime(remaintimeTotal);
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
        stpvideoplayermainCtrl.$inject = ["$rootScope", "$scope", "$timeout", "$interval", "$log", "$http", "$q", "stpvideoplayer_dataservice"];
        return stpvideoplayermainCtrl;
    })();
    STPVideoPlayer.stpvideoplayermainCtrl = stpvideoplayermainCtrl;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function stpvideoplayercontainerDirective() {
        return {
            templateUrl: 'js/app/templates/main.tpl.html',
            link: function ($scope, element, attributes) {
            },
            controller: STPVideoPlayer.stpvideoplayermainCtrl,
            controllerAs: "mainctrl", scope: true
        };
    }
    STPVideoPlayer.stpvideoplayercontainerDirective = stpvideoplayercontainerDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function headerzoneDirective() {
        return {
            templateUrl: 'js/app/directives/headerZone/headerzone.tpl.html',
            link: function ($scope, element, attributes) {
            }
        };
    }
    STPVideoPlayer.headerzoneDirective = headerzoneDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    var controlzoneCtrl = (function () {
        function controlzoneCtrl($rootScope, $scope, $timeout, $interval, $log, $http, $q, stpvideoplayer_dataservice) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$interval = $interval;
            this.$log = $log;
            this.$http = $http;
            this.$q = $q;
            this.stpvideoplayer_dataservice = stpvideoplayer_dataservice;
            this.stopvideo = function () {
                $interval.cancel($rootScope.timer);
                $log.debug('stop play video');
                $scope.stopped = true;
            };
            this.playvideo = function () {
                $log.debug('restart play video');
                var promise = $interval(function () {
                    $rootScope.retimevideo(promise, $rootScope.video);
                }, 1000);
                $rootScope.timer = promise;
                $scope.stopped = false;
            };
        }
        ;
        controlzoneCtrl.$inject = ["$rootScope", "$scope", "$timeout", "$interval", "$log", "$http", "$q", "stpvideoplayer_dataservice"];
        return controlzoneCtrl;
    })();
    STPVideoPlayer.controlzoneCtrl = controlzoneCtrl;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function playerzoneDirective() {
        return {
            templateUrl: 'js/app/directives/playerZone/playerZone.tpl.html',
            link: function ($scope, element, attributes) {
            }
        };
    }
    STPVideoPlayer.playerzoneDirective = playerzoneDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function html5videoplayerDirective() {
        return {
            templateUrl: 'js/app/directives/playerzone/html5videoplayer/html5videoplayer.tpl.html',
            link: function ($scope, element, attributes) {
            }
        };
    }
    STPVideoPlayer.html5videoplayerDirective = html5videoplayerDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    var youtubePlayerCtrl = (function () {
        function youtubePlayerCtrl($rootScope, $interval, $log) {
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$log = $log;
            $log.debug('load youtube player');
            var player;
            var playerOptions = {
                "playerVars": {
                    autoplay: 1,
                    disablekb: 1
                }, "events": {
                    "onReady": playerReady
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
        youtubePlayerCtrl.$inject = ["$rootScope", "$interval", "$log"];
        return youtubePlayerCtrl;
    })();
    STPVideoPlayer.youtubePlayerCtrl = youtubePlayerCtrl;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function youtubeDirective() {
        return {
            templateUrl: 'js/app/directives/playerZone/youtubePlayer/youtubePlayer.tpl.html',
            link: function ($scope, element, attributes) {
            },
            controller: STPVideoPlayer.youtubePlayerCtrl,
            controllerAs: 'ypctrl'
        };
    }
    STPVideoPlayer.youtubeDirective = youtubeDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
//#region "global"
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../Scripts/TypeLite.Net4.d.ts"/>
/// <reference path="../scripts/typings/moment/moment.d.ts" />
/// <reference path="../scripts/typings/moment/moment-node.d.ts" />
/// <reference path="../scripts/typings/youtube/youtube.d.ts" />
//#endregion "global"
/// <reference path="app/interfaces/stpvideoplayer_iscope.ts" />
//#region "data service"
/// <reference path="app/interfaces/stpvideoplayer_idataservice.ts" />
/// <reference path="app/services/stpvideoplayer_dataservice.ts" />
//#endregion
//#region "main container"
/// <reference path="app/controllers/stpvideoplayermainctrl.ts" />
/// <reference path="app/directives/container/stpvideoplayercontainerdirective.ts" />
//#endregion "main container"
//#region "header"
/// <reference path="app/directives/headerzone/headerzonedirective.ts" />
//#endregion
//#region "control zone"
/// <reference path="app/directives/controlzone/controlzonectrl.ts" />
/// <refference path="app/directives/controlZone/controlzonedirective.ts" />
//#endregion
//#region "player zone"
/// <reference path="app/directives/playerzone/playerzonedirective.ts" />
/// <reference path="app/directives/playerzone/html5videoplayer/html5videoplayerdirective.ts" />
/// <reference path="app/directives/playerzone/youtubeplayer/youtubeplayerctrl.ts" />
/// <reference path="app/directives/playerzone/youtubeplayer/youtubeplayerdirective.ts" />
//#endregion 
/// <reference path="_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    var stpvideoplayer = angular.module('stpvideoplayer', []);
    //#region "declare objets for the application"
    stpvideoplayer.service('stpvideoplayer_dataservice', ['$http', '$log', '$rootScope', '$q', STPVideoPlayer.Services.stpvideoplayer_dataservice]);
    stpvideoplayer.controller('stpvideoplayermainCtrl', STPVideoPlayer.stpvideoplayermainCtrl);
    stpvideoplayer.controller('controlzoneCtrl', STPVideoPlayer.controlzoneCtrl);
    stpvideoplayer.controller('youtubePlayerCtrl', STPVideoPlayer.youtubePlayerCtrl);
    stpvideoplayer.directive('stpvideoplayer', STPVideoPlayer.stpvideoplayercontainerDirective);
    stpvideoplayer.directive('headerzone', STPVideoPlayer.headerzoneDirective);
    stpvideoplayer.directive('controlzone', STPVideoPlayer.controlzoneDirective);
    //video player
    stpvideoplayer.directive('youtubeplayer', STPVideoPlayer.youtubeDirective);
    stpvideoplayer.directive('localplayer', STPVideoPlayer.html5videoplayerDirective);
    stpvideoplayer.directive('playerzone', STPVideoPlayer.playerzoneDirective);
    //#endregion
    stpvideoplayer.run(function ($http, $log, $rootScope) {
        $rootScope.url = "api";
        $rootScope.applicationname = "TV Player";
        $rootScope.computeTicks = function (time) {
            if (time == undefined || time == "")
                return 0;
            var parts = time.split(':');
            var hour = parseInt(parts[0]);
            var minute = parseInt(parts[1]);
            var seconde = 0;
            if (parts.length == 3)
                seconde = parseInt(parts[2]);
            return (hour * 3600) + (minute * 60) + seconde;
        };
        $rootScope.tickToTime = function (duration) {
            if (duration == 0)
                return "00:00:00";
            if (duration < 0)
                duration = duration + 1440;
            var dm = parseInt((duration / 60).toString());
            var ds = duration - (dm * 60);
            var dh = 0;
            if (dm > 60) {
                var o = dm;
                dh = o / 60;
                dm = o - (dh * 60);
            }
            var result = "";
            if (dh.toString().length == 1) {
                result = "0" + dh.toString() + ":";
            }
            else {
                result = dh.toString() + ":";
            }
            if (dm.toString().length == 1) {
                result += "0" + dm.toString();
            }
            else {
                result += dm.toString();
            }
            if (ds > 0) {
                result += ":";
                if (ds.toString().length == 1) {
                    result += "0" + ds.toString();
                }
                else {
                    result += ds.toString();
                }
            }
            return result;
        };
        $rootScope.computeDuration = function (start, end) {
            if (start == undefined || start == "")
                return start;
            if (end == undefined || end == "")
                return start;
            var t1 = $rootScope.computeTicks(start);
            var t2 = $rootScope.computeTicks(end);
            var duration = t2 - t1;
            return $rootScope.tickToTime(duration);
        };
    });
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function controlzoneDirective() {
        return {
            templateUrl: 'js/app/directives/controlZone/controlzone.tpl.html',
            link: function ($scope, element, attributes) {
            },
            controller: STPVideoPlayer.controlzoneCtrl,
            controllerAs: 'ctrlzonec'
        };
    }
    STPVideoPlayer.controlzoneDirective = controlzoneDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="stpvideoplayer_dataservicetest_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    function stpvideoplayer_dataserviceTestDirective() {
        return {
            templateUrl: 'js/app/directives/stpvideoplayer_dataserviceTest/stpvideoplayer_dataserviceTest.tpl.html',
            link: function ($scope, element, attributes) {
            },
            controller: STPVideoPlayer.stpvideoplayer_dataserviceTestCtrl,
            controllerAs: "dt", scope: true
        };
    }
    STPVideoPlayer.stpvideoplayer_dataserviceTestDirective = stpvideoplayer_dataserviceTestDirective;
    ;
})(STPVideoPlayer || (STPVideoPlayer = {}));
/// <reference path="../../../_references.ts" />
/// <reference path="stpvideoplayer_dataservicetestctrl.ts" />
/// <reference path="stpvideoplayer_dataservicetestdirective.ts" />
/// <reference path="stpvideoplayer_dataservicetest_references.ts" />
var STPVideoPlayer;
(function (STPVideoPlayer) {
    'use strict';
    var stpvideoplayer_dataserviceTestCtrl = (function () {
        function stpvideoplayer_dataserviceTestCtrl($rootScope, $scope, $timeout, $log, $http, $q, stpvideoplayer_dataservice) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$log = $log;
            this.$http = $http;
            this.$q = $q;
            this.stpvideoplayer_dataservice = stpvideoplayer_dataservice;
            this.$stpvideoplayer_dataservice = stpvideoplayer_dataservice;
            this.log = $log;
            this.ctrl = this;
            this.click = function () {
                var ctrl = _this.ctrl;
                _this.$stpvideoplayer_dataservice.generic().then(function (result) {
                    $timeout(function () {
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
        stpvideoplayer_dataserviceTestCtrl.$inject = ["$rootScope", "$scope", "$timeout", "$log", "$http", "$q", "stpvideoplayer_dataservice"];
        return stpvideoplayer_dataserviceTestCtrl;
    })();
    STPVideoPlayer.stpvideoplayer_dataserviceTestCtrl = stpvideoplayer_dataserviceTestCtrl;
})(STPVideoPlayer || (STPVideoPlayer = {}));
//# sourceMappingURL=STPVideoPlayer.js.map