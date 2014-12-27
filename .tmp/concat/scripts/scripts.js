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
    .config(["$stateProvider", "$urlRouterProvider", "$authProvider", function($stateProvider, $urlRouterProvider,$authProvider){
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
    }]);

'use strict';

/**
 * @ngdoc function
 * @name weatherAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dotSq
 */
angular.module('weatherAppApp')
//        $scope.city = "";
    .controller('MainCtrl', function () {
        console.log("in dot square");

    })
    .directive('slider',function(){
        return {
            restrict:'E',
            scope:{
                list:'='
            },
            controller:["$scope", function($scope){
                this.toggleIsActiveClass = function(){
                    $scope.isActiveClass = !$scope.isActiveClass;
                };
            }],
            template:'<aside style="background: #f5f5f5">' +
                    '<ul>' +
                    '<li ng-repeat="x in list"><a href="">{{x}}</a></li>' +
                    '</ul></aside>',
            transclude:true,
            link:function(scope,ele,attr){

            }
        };
    })
    .directive('hamberger',function(){
        return {
            restrict:'EA',
            template:'<div id="nav-toggle" ng-click="setClass()" ng-class="isActiveClass ? \'active\':\'\'"><span></span></div>',
            controller:["$scope", function($scope){
                $scope.isActiveClass = false;
                $scope.setClass = function(){
                    $scope.isActiveClass = !$scope.isActiveClass;
                };
            }],
            link:function(scope,attr,ele,slider){
            }
        };
    })
    .directive('mySlider',function(){
        return {
            restrict:'E',
            template:'<hamberger></hamberger>' +
                '<slider list="lists" ng-class="isActiveClass ? \'\':\'show-aside\'" ></slider>',
            link:function(){
                console.log("in my-slider dir");
            }
        };
    });


'use strict';
/**
 * Created by venkat on 4/12/14.
 */
angular.module('weatherAppApp')
//        $scope.city = "";
    .controller('SignInCtrl', ["$scope", "$http", "$location", "addUser", function ($scope,$http,$location, addUser) {
        console.log("in dot square");
        $scope.signIn = function(model,form){
          console.log(model,form);
            console.log("model,form");
            addUser.addUser(form).then(function(data){
                console.log(data);
                if(data.status === 200 && data.statusText === "OK"){
                    $location.path("/");
                }
            },function(err){
                console.log(err);
            })

        };

    }])
    .factory('addUser',["$http", function($http){
        return {
            nodeUrl:"http://localhost:8000/api/addUser",
            addUser:function(data){
                var url = this.nodeUrl;
                return $http({method:"POST",url:this.nodeUrl,data:data}).success(function(data){
                    return data;
                }).error(function(err){
                    return (err);
                });
            }
        };
    }])

/**
 * Created by venkat on 5/12/14.
 */
'use strict';
angular.module('weatherAppApp')
//        $scope.city = "";
    .controller('LoginCtrl', ["$scope", "$location", "loginService", "googleOauth", "$auth", function ($scope,$location,loginService,googleOauth,$auth) {
        console.log("in dot square");
        $scope.logIn = function (model, form) {
            console.log(model, form);
            console.log("model,form");
            loginService.loginUser(form).then(function(data){
                if(data.data.error){
                    console.log(data.data.error);
                }else{
                    $location.path("/loginsuccess");
                }
            },function(err){
                console.log(err);
            })
        };
        $scope.googleOauth = function(){
            googleOauth.loginUser();
        }
        $scope.authenticate = function(provider) {
            $auth.authenticate(provider);
        };
    }])
    .factory("googleOauth", ["$http", function ($http) {
        return {
            nodeUrl: "http://localhost:8000/auth/google",
            loginUser: function (data) {
                var url = this.nodeUrl;
                return $http({method: "GET", url: this.nodeUrl}).success(function (data) {
                    console.log("after login error",data);
                    return data;
                }).error(function (err) {
                    console.log(err);
                    return (err);
                });
            }
        }
    }])
    .factory("loginService", ["$http", function ($http) {
        return {
            nodeUrl: "http://localhost:8000/api/loginUser",
            loginUser: function (data) {
                var url = this.nodeUrl;
                return $http({method: "POST", url: this.nodeUrl, data: data}).success(function (data) {
                    console.log("after login error",data);
                    return data;
                }).error(function (err) {
                    console.log(err);
                    return (err);
                });
            }
        }
    }])
    .controller('VideosCtrl', ["$scope", "$http", "$location", "getVideos", function ($scope,$http,$location, getVideos) {

      getVideos.getVideos().then(function(data){
        console.log("videos data",data);
        $scope.videos = data.data;
      })
    }])
    .factory('getVideos',["$http", function($http){
      return {
        nodeUrl:"http://localhost:8000/videos",
        getVideos:function(data){
          var url = this.nodeUrl;
          return $http({method:"GET",url:this.nodeUrl}).success(function(data){
            return data;
          }).error(function(err){
            return (err);
          });
        }
      };
    }])
