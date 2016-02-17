/// <reference path="stpvideoplayer_dataservicetest_references.ts" />
module STPVideoPlayer {
    'use strict';

    export function stpvideoplayer_dataserviceTestDirective(): ng.IDirective {
        return {
            templateUrl: 'js/app/directives/stpvideoplayer_dataserviceTest/stpvideoplayer_dataserviceTest.tpl.html',
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {

            },
            controller: stpvideoplayer_dataserviceTestCtrl,
            controllerAs: "dt", scope:true
        };
    };
}