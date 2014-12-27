'use strict';

/**
 * @ngdoc overview
 * @name weatherAppApp
 * @description
 * # weatherAppApp
 *
 * Main module of the application.
 */
angular
  .module('weatherAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'satellizer'
  ])
    /*.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/signin', {
            templateUrl: 'views/signIn.html',
            controller: 'SignCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  })*/
    .config(function($stateProvider, $urlRouterProvider,$authProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('landing',{
                url:'/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .state('signin',{
                url:'/signin',
                templateUrl: 'views/signin.html',
                controller: 'SignInCtrl'
            })
            .state('login',{
                url:'/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('loginSuccess',{
                url:'/loginsuccess',
                templateUrl: 'views/loginsuccess.html',
                controller: 'LoginCtrl'
            })
            .state('videos',{
              url : '/videos',
              templateUrl:'views/videoslist.html',
              controller:'VideosCtrl'
            });

        $authProvider.google({
            clientId: '748388540408-ehicrpsrll1gb9od0f2la5kde8krkvkj.apps.googleusercontent.com'
        });
        $authProvider.loginRedirect = 'http://localhost:8000/facedef.html';
    });
