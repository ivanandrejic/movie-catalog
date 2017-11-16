var app = angular.module('demo', [ 'ngRoute', 'hateoas', 'smart-table']);

app.config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home',
		controllerAs: 'controller'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'login',
		controllerAs: 'controller'
	}).when('/movies', {
		templateUrl : 'movies.html',
		controller : 'movies',
		controllerAs: 'controller'
	}).when('/users', {
		templateUrl : 'users.html',
		controller : 'users',
		controllerAs: 'controller'
	}).otherwise('/');
	
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
});


app.config(function (HateoasInterceptorProvider) {
    HateoasInterceptorProvider.transformAllResponses();
});

app.service('authService', ['$rootScope', '$http', function($rootScope, $http) {
	
	var authenticateImpl = function (credentials, callback) {

		var headers = credentials ? {
			authorization : 'Basic ' + btoa(credentials.username + ':' + credentials.password)
		} : {};
		
		$http.get('user', {
			headers : headers
		}).then(function(response) {
			console.log('authenticate resp: ' + JSON.stringify(response));
			if (response.data.username) {
				$rootScope.authenticated = true;
				$rootScope.currentUser = response.data;
			} else {
				$rootScope.authenticated = false;
			}
			callback && callback($rootScope.authenticated);
		}, function() {
			$rootScope.authenticated = false;
			callback && callback(false);
		});
	};
	
	var getRoleImpl = function () {
    	if ($rootScope.currentUser) {
    		return $rootScope.currentUser.role ? $rootScope.currentUser.role : $rootScope.currentUser.authorities.map(function(elem) {return elem.authority});
    	}
    };
	
	return {
		authenticate: authenticateImpl,
		getRole: getRoleImpl,
	};
}]);


app.controller('navigation', ['$rootScope', '$scope', '$http', '$location', 'authService', function($rootScope, $scope, $http, $location, authService) {
	
	console.log('nav ctrl');
	
    $scope.tab = 1;
    $rootScope.authenticated = false;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
      $location.path($scope.templates[newTab-1].url);
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    
    $scope.templates =
        [{ name: 'home', url: '/home'},
         { name: 'movies', url: '/movies'},
         { name: 'users', url: '/users'},
         { name: 'login', url: '/login'}];
    $scope.template = $scope.templates[0];
    
    $scope.logout = function() {
    	console.log('logout');
		$http.post('logout', {}).finally(function() {
			$rootScope.authenticated = false;
			$scope.setTab(1);
		});
	}
    
    authService.authenticate($scope.credentials, function(authenticated) {
		$rootScope.authenticated = authenticated === true;
	});
    
    $rootScope.isUsersVisible = function() {
    	return authService.getRole() && authService.getRole() == 'ROLE_ADMIN'; 
    }
    $rootScope.isMoviesVisible = function() {
    	return authService.getRole() && (authService.getRole() == 'ROLE_USER' || authService.getRole() == 'ROLE_ADMIN'); 
    }
    
}]);

app.controller('login', ['$rootScope', '$scope', 'authService', function($rootScope, $scope, authService) {
	console.log('login ctrl');
	
	$scope.credentials = {};
	$scope.login = function() {
		console.log('login func');
		authService.authenticate($scope.credentials, function(authenticated) {
			if (authenticated) {
				console.log('Login succeeded')
				$scope.error = false;
				$rootScope.authenticated = true;
				$scope.setTab(1);
			} else {
				console.log('Login failed')
				$scope.error = true;
				$rootScope.authenticated = false;
			}
		});
	};
	
}]);
		
app.controller('home', ['$rootScope', '$scope', '$http', 'authService', 'User', function($rootScope, $scope, $http, authService, User) {
	console.log('home ctrl');
	
	$scope.editUser = {};
	
	$scope.updateUser = function() {
		
		if ($scope.editUser.password1 != $scope.editUser.password2) {
			$scope.error = true;
		} else if ($scope.editUser.password1 && !$scope.editUser.password1.match(passRegex)) {
			$scope.error = true;
		} else {
			$scope.error = false;
			User.update({ id:$rootScope.currentUser.id }, 
				{
					id: $rootScope.currentUser.id,
					name: $scope.editUser.name,
					password: $scope.editUser.password1,
					role: $rootScope.currentUser.role,
				}, 
				function (value) {
					console.log('update successs');
					$scope.setTab(1);
			}, 
			function (value) {
				console.log('update error');
			}
			);
		}
		
	}
	
}]);

app.factory('Movie', ['$resource', function($resource) {
	return $resource('rest/movies/:id', null,
			{'update': { method:'PUT' }});
}]);

app.factory('User', ['$resource', function($resource) {
	return $resource('rest/secureUsers/:id', null,
	    {'update': { method:'PUT' }});
}]);

function getId(data) {
	var urlStr = data._links.self.href;
	return urlStr.substring(urlStr.lastIndexOf('/') + 1);
}

