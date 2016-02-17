/// <reference path="../../../_references.ts" />

module STPVideoPlayer {
    'use strict';

    export function headerzoneDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/directives/headerZone/headerzone.tpl.html',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {

            }
        };
    };
}