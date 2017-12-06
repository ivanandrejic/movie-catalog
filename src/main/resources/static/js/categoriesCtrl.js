app.controller('categories', ['$rootScope', '$scope', '$resource', 'Category', 'authService', function($rootScope, $scope, $resource, Category, authService) {
	console.log('category ctrl')
	
	$scope.searchCategories = function searchCategories() {
		if ($rootScope.currentUser) {
			console.log('current category: ' + JSON.stringify($rootScope.currentUser));
			let ResCategory;
			if ($scope.byTitle) {			
				ResCategory = $resource(getNameUrl(), 
					{ title: $scope.byTitle });
			} else {
				ResCategory = $resource(getAllUrl());
			}
			let m = ResCategory.get(null, function () {
				console.debug('Categories: ' + m);
				$scope.categories = m._embedded.movieCategories;
			});
		}
	}	
	
	function getNameUrl() {
		return '/rest/movieCategories/search/findByTitleStartingWith?title=:title';
	}
	
	function getAllUrl() {
		return '/rest/movieCategories/';
	}
	
	$scope.searchCategories();
	
    $scope.addCategory = function addCategory() {
        $scope.categories.push({
        	'offset' : 0,
            'edit' : true,
            'newCategory' : true
        });
    };

    $scope.removeCategory = function removeCategory(category) {
        let index = $scope.categories.indexOf(category);
        if (index !== -1 && !category.newCategory) {
        	Category.delete({ id:getId(category)});
            $scope.categories.splice(index, 1);
        }
    }
    
    $scope.editCategory = function editCategory(category) {
    	category.edit = true;
    }
    
    $scope.saveCategory = function saveCategory(category) {
    	let index = $scope.categories.indexOf(category);
    	
    	category.edit = false;
    	let categoryToSave = {};
    	categoryToSave.title = category.title;
    	categoryToSave.description = category.description;
    	if (category.newCategory) {
    		Category.save(null, categoryToSave, function(value) {
    			console.log('saved category: ' + value)
    			$scope.categories[index] = value;
    		}, function () {
    			console.log('save category error');
    			$scope.error = true;
    		});
    		category.newCategory = false;
    	} else {
    		categoryToSave.id = getId(category);
    		Category.update({ id:categoryToSave.id }, categoryToSave, function(value) {
    			console.log('updated category sucess');
    			$scope.categories[index] = value;
    		}, function () {
    			console.log('updated category error');
    			$scope.error = true;
    		});
    		
    	}
    }
    
    $scope.cancelCategory = function cancelCategory(category) {
    	category.edit = false;
    	let index = $scope.categories.indexOf(category);
    	if (category.newCategory) {
    		$scope.categories.splice(index, 1);
    	} else {    
//    		reload
    		Category.get({ id: getId(category) }, function (value) {
    			$scope.categories[index] = value;
    		});
    	}
    	
    }
	
	$scope.categories = [];
	$scope.error = false;
	
}]);
