<script  type="text/javascript" src= "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js">
	<script>
	var app = angular.module('myApp', []);
	app.controller('customersCtrl', function($scope, $http) {
		alert("in controller")
		$http({
		  
		    data: {"accountNumber":"1000000001"},
		
		})
	  .success(function (response) {alert("success")});
	});










<script src= "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
<body>

<div ng-app="myApp" ng-controller="customersCtrl"> 

<ul>
  <li ng-repeat="x in names">
    {{ x.Name + ', ' + x.Country }}
  </li>
</ul>

</div>

<script>
var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http) {
	
	$http({
	  
	    data: {"accountNumber":"1000000001"},
	
	})
  .success(function (response) {$scope.names = response.records;});
});
</script>