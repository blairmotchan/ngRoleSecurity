'use strict';


angular.module('testSecurityService', ['ngRoleSecurity', 'ngRoute'])
    .config(function ($routeProvider, securityConfig) {
        $routeProvider
            .when('/secured-admin', {
                template: '<div>Admins Only</div>',
                allowedRoles: ['ADMIN']
            })
            .when('/unsecured', {
                template: '<div>no security</div>'
            });
        securityConfig.authoritiesUrl = 'http://localhost/me/authorities';
        securityConfig.forbiddenRoute ='/access-denied';
    });

describe('Directive: requireRole', function () {

    // load the directive's module
    beforeEach(module('testSecurityService'));

    var element,
        $rootScope, $compile, $securityService, $sessionStorage;

    beforeEach(inject(function (_$rootScope_, _$compile_, _$sessionStorage_, _$securityService_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $sessionStorage = _$sessionStorage_;
        $securityService = _$securityService_;
    }));

    it('should make the element hidden when the user does not have the role', function () {
        $sessionStorage.authorities = [];
        element = $compile('<div require-role="ADMIN">Admin view only</div>')($rootScope);
        $rootScope.$digest();
        expect(element.hasClass('hidden')).toBeTruthy();
    });

    it('should not make the element hidden when the user has the role', function() {
        $sessionStorage.authorities = ['ADMIN'];
        element = $compile('<div require-role="ADMIN">Admin view only</div>')($rootScope);
        $rootScope.$digest();
        expect(element.hasClass('hidden')).toBeFalsy();
    });

    it('should not make the element hidden when the user has any of the roles', function() {
        $sessionStorage.authorities = ['ADMIN'];
        element = $compile('<div require-role="ADMIN,EMPLOYEE">Admin view only</div>')($rootScope);
        $rootScope.$digest();
        expect(element.hasClass('hidden')).toBeFalsy();
    });

});