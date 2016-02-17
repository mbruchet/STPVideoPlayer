/// <reference path="../../../../_references.ts" />

module STPVideoPlayer {
    'use strict';

    export function youtubeDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/directives/playerZone/youtubePlayer/youtubePlayer.tpl.html',
            link: ($scope: any, element: JQuery, attributes: any) => {
            },
            controller: youtubePlayerCtrl,
            controllerAs:'ypctrl'
        };
    };
}