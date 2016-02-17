/// <reference path="../../../_references.ts" />

module STPVideoPlayer {
    'use strict';

    export function playerzoneDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/directives/playerZone/playerZone.tpl.html',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {

            }
        };
    };
}