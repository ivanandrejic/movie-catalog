app.controller('movies', ['$rootScope', '$scope', '$resource', 'Movie', 'authService', function($rootScope, $scope, $resource, Movie, authService) {
	console.log('movies ctrl')
	
	$scope.searchMovies = function searchMovies() {
		if ($rootScope.currentUser) {
			console.log('current movies: ' + JSON.stringify($rootScope.currentUser));
			let ResMovie;
			if ($scope.byTitle || $scope.byActor || $scope.byCategory || $scope.byDate) {			
				ResMovie = $resource(getNameUrl(), 
					{ title: $scope.byTitle,
					  mainActor: $scope.byActor, 
					  category: $scope.byCategory, 
					  releaseDate: ($scope.byDate?  $scope.byDate : '1-1-1900')});
			} else {
				ResMovie = $resource(getAllUrl());
			}
			let m = ResMovie.get(null, function () {
				console.debug('movies: ' + m);
				$scope.movies = m._embedded.movies;
				$scope.movies.forEach(
						movie => {
							let columns = $resource('/rest/movies/'+ getId(movie) + '/categories').get(null, function(){
								movie.categories = columns;
							});
						});
			});
			
			let c = $resource('/rest/movieCategories/').get(null, function () {
				console.debug('categories: ' + c);
				$scope.categories = c._embedded.movieCategories;
			});
		}
	}	
	
	function getNameUrl() {
		return '/rest/movies/search/findByAll?title=:title&mainActor=:mainActor&category=:category&releaseDate=:releaseDate';
	}
	
	function getAllUrl() {
		return '/rest/movies/';
	}
	
	$scope.searchMovies();
	
	$scope.getCategory = function (category) {
		if (!category) {
			return ''
		} else if (category._embedded) {
			return category._embedded.movieCategories.map(x => x.title);
		} 
		return category;
	}
	
    $scope.addMovie = function addMovie() {
        $scope.movies.push({
        	'offset' : 0,
            'edit' : true,
            'newMovie' : true
        });
    };

    $scope.removeMovie = function removeMovie(movie) {
        let index = $scope.movies.indexOf(movie);
        if (index !== -1 && !movie.newMovie) {
        	Movie.delete({ id:getId(movie)});
            $scope.movies.splice(index, 1);
        }
    }
    
    $scope.editMovie = function editMovie(movie) {
    	movie.edit = true;
    }
    
    $scope.saveMovie = function saveMovie(movie) {
    	let index = $scope.movies.indexOf(movie);
    	
    	movie.edit = false;
    	let movieToSave = {};
    	movieToSave.title = movie.title;
    	movieToSave.categories = movie.categories.map(c => c._links.self.href);
    	movieToSave.releaseDate = movie.releaseDate;
    	movieToSave.mainActor = movie.mainActor;
    	movieToSave.iconData = movie.iconData;
    	if (movie.newMovie) {
    		Movie.save(null, movieToSave, function(value) {
    			console.log('saved movie: ' + value)
    			$scope.movies[index] = value;
    			$resource('/rest/movies-controll/').save(null, { movie: getId(value), categories: movie.categories.map(c => getId(c))})
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
    			$resource('/rest/movies-controll/').save(null, { movie: movieToSave.id, categories: movie.categories.map(c => getId(c))})
    		}, function () {
    			console.log('updated movie error');
    			$scope.error = true;
    		});
    		
    	}
    }
    
    $scope.cancelMovie = function cancelMovie(movie) {
    	movie.edit = false;
    	let index = $scope.movies.indexOf(movie);
    	if (movie.newMovie) {
    		$scope.movies.splice(index, 1);
    	} else {    
//    		reload
    		Movie.get({ id: getId(movie) }, function (value) {
    			$scope.movies[index] = value;
    		});
    	}
    	
    }
    
    $scope.formatDate = function (dateStr) {
    	let date = new Date(dateStr);
    	return date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear(); 
    }
	
	$scope.movies = [];
	$scope.categories = [];
	$scope.error = false;
	
}]);
