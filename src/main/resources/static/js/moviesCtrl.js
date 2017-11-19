app.controller('movies', ['$rootScope', '$scope', '$resource', 'Movie', 'authService', function($rootScope, $scope, $resource, Movie, authService) {
	console.log('movies ctrl')
	
	$scope.searchMovies = function searchMovies() {
		if ($rootScope.currentUser) {
			console.log('current movies: ' + JSON.stringify($rootScope.currentUser));
			let Movie = $resource(getAllUrl());
			if ($scope.byTitle || $scope.byActor || $scope.byCategory || $scope.byDate) {			
				Movie = $resource(getNameUrl(), 
					{ title: $scope.byTitle,
					  mainActor: $scope.byActor, 
					  category: $scope.byCategory, 
					  releaseDate: ($scope.byDate?  $scope.byDate : '1-1-1900')});
			} 
			let movies = Movie.get(null, function () {
				console.debug('movies: ' + movies);
				$scope.movies = movies._embedded.movies;
			});
		}
	}	
	
	function getNameUrl() {
		return '/rest/movies/search/findByAll?title=:title&mainActor=:mainActor&category=:category&releaseDate=:releaseDate';
//		return '/rest/movies/search/findByTitleStartingWith?title=:title';
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
    	movieToSave.category = movie.category;
    	movieToSave.releaseDate = movie.releaseDate;
    	movieToSave.mainActor = movie.mainActor;
    	movieToSave.iconData = movie.iconData;
    	if (movie.newMovie) {
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
    
    function readIcon(formName, fileName, callback) {
    	var fileInput = document.forms[formName]["file"];
    	var file = fileInput.files[0];
    	if (file) {
    		var reader = new FileReader();
    		reader.onloadend = function() {
    			callback(reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
    		}
    		reader.readAsDataURL(file);
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
	$scope.error = false;
	
}]);

app.directive("imageread", [function () {
    return {
        scope: {
        	imageread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.imageread = loadEvent.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);