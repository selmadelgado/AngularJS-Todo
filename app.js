var todoApp = angular.module('TodoApp', []);


todoApp.controller('TodoCtrl', ['$scope',
    function($scope) {

        // CREATE A FIREBASE REFERENCE
        var rootRef = firebase.database();
        var todoRef = rootRef.ref("/todos");

        // GET TODOS AS AN ARRAY
        $scope.todos = {};

        todoRef.on("child_added", function (snapshot) {
               var todo = snapshot.val();
               var key = snapshot.key;
               $scope.todos[key] = todo;
               try { $scope.$apply(); } catch(err) {}
            });

        todoRef.on("child_changed", function (snapshot) {
               var todo = snapshot.val();
               var key = snapshot.key;
               $scope.todos[key] = todo;
               try { $scope.$apply(); } catch(err) {}
            });

        todoRef.on("child_removed", function (snapshot) {
               var key = snapshot.key; 
               delete $scope.todos[key];
               try { $scope.$apply(); } catch(err) {}
            });

        // ADD TODO ITEM METHOD
        $scope.addTodo = function () {

            // CREATE A UNIQUE ID
            var timestamp = new Date().valueOf();

            var newTodoRef = todoRef.push();
            newTodoRef.set({
                id: timestamp,
                name: $scope.todoName,
                status: 'pending'
            });
            $scope.todoName = "";

        };

        $scope.filterSecId = function(items, status) {
            var result = {};
            for (var itemKey in items) {
                var todo = items[itemKey];
                if (todo.status === status) {
                    result[itemKey] = todo;
                } 
            }
            return result;
        };

        // REMOVE TODO ITEM METHOD
        $scope.removeTodo = function (key) {
            todoRef.child(key).remove();
        };

        // MARK TODO AS IN PROGRESS METHOD
        $scope.startTodo = function (key) {
            $scope.todos[key].status = "in progress";
            todoRef.child(key).set($scope.todos[key]);
        };

        // MARK TODO AS COMPLETE METHOD
        $scope.completeTodo = function (key) {

            $scope.todos[key].status = "complete";
            todoRef.child(key).set($scope.todos[key]);
        };

    }]);