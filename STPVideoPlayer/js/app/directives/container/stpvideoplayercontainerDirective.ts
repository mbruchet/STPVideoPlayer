/// <reference path="../../../_references.ts" />
module STPVideoPlayer {
    'use strict';

    export function stpvideoplayercontainerDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/templates/main.tpl.html',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {

            },
            controller: stpvideoplayermainCtrl,
            controllerAs: "mainctrl", scope: true
        };
    };
}