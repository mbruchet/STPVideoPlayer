/// <reference path="../../../_references.ts" />

module STPVideoPlayer {
    'use strict';

    export function controlzoneDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/directives/controlZone/controlzone.tpl.html',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {

            },
            controller: controlzoneCtrl,
            controllerAs: 'ctrlzonec'
        };
    };
}