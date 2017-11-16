app.controller('movies', ['$rootScope', '$scope', '$resource', 'Movie', 'authService', function($rootScope, $scope, $resource, Movie, authService) {
	console.log('movies ctrl')
	
	$scope.searchMovies = function searchMovies() {
		if ($rootScope.currentUser) {
			console.log('current movies: ' + JSON.stringify($rootScope.currentUser));
			
			if ($scope.byTitle) {			
				var Movie = $resource(getNameUrl(), { title: $scope.byTitle });
				
			} else {			
				var Movie = $resource(getAllUrl());
			}
			
			var movies = Movie.get(null, function () {
				console.debug('movies: ' + movies);
				$scope.movies = movies._embedded.movies;
			});
		}
		
	}	
	
	function getNameUrl() {
		return '/rest/movies/search/findByTitleContaining?title=:title';
	}
	
	function getAllUrl() {
		return '/rest/movies/';
	}
	
	$scope.searchMovies();
	
    $scope.addMovie = function addMovie() {
        $scope.movies.push({
        	'offset' : 0,
            'edit' : true,
            'newMovie' : true
        });
    };

    $scope.removeMovie = function removeMovie(movie) {
        var index = $scope.movies.indexOf(movie);
        if (index !== -1 && !movie.newMovie) {
        	Movie.delete({ id:getId(movie)});
            $scope.movies.splice(index, 1);
        }
    }
    
    $scope.editMovie = function editMovie(movie) {
    	movie.edit = true;
    }
    
    $scope.saveMovie = function saveMovie(movie) {
    	var index = $scope.movies.indexOf(movie);
    	
    	movie.edit = false;
    	var movieToSave = {};
    	movieToSave.offset = movie.offset;
    	movieToSave.name = movie.name;
    	movieToSave.city = movie.city;
    	movieToSave.userId = movie.userId;
    	if (movie.newMovie) {
    		movieToSave.userId = $rootScope.currentUser.id;
    		Movie.save(null, movieToSave, function(value) {
    			console.log('saved movie: ' + value)
    			$scope.movies[index] = value;
    		}, function () {
    			console.log('save movie error');
    			$scope.error = true;
    		});
    		movie.newMovie = false;
    	} else {
    		movieToSave.id = getId(movie);
    		Movie.update({ id:movieToSave.id }, movieToSave, function(value) {
    			console.log('updated movie sucess');
    			$scope.movies[index] = value;
    		}, function () {
    			console.log('updated movie error');
    			$scope.error = true;
    		});
    		
    	}
    }
    
    $scope.cancelMovie = function cancelMovie(movie) {
    	movie.edit = false;
    	var index = $scope.movies.indexOf(movie);
    	if (movie.newMovie) {
    		$scope.movies.splice(index, 1);
    	} else {    
//    		reload
    		Movie.get({ id: getId(movie) }, function (value) {
    			$scope.movies[index] = value;
    		});
    	}
    	
    }
	
	$scope.movies = [];
	$scope.error = false;
}]);