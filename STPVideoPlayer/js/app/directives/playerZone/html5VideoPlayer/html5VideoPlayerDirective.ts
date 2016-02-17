/// <reference path="../../../../_references.ts" />

module STPVideoPlayer {
    'use strict';

    export function html5videoplayerDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/directives/playerzone/html5videoplayer/html5videoplayer.tpl.html',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {

            }
        };
    };
}