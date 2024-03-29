angular.module('JNPAPP')
    .controller('CurrentUserController', ['$scope', '$rootScope', 'CurrentUserService', 'UserFriends', function($scope, $rootScope, CurrentUserService, UserFriends) {
        $scope.currentUser = CurrentUserService.getUser();
        $scope.currentUser.$promise.then(function (response) {
            $scope.username = response.username;
            $rootScope.username = response.username;
        });
        $scope.friends = CurrentUserService.getFriends();
        $scope.newFriend = new UserFriends();
        $scope.newFriendError = null;

        $scope.addFriend = function() {
            CurrentUserService.addFriend($scope.newFriend, function(result) {
                $scope.friends.push(result);
                $scope.newFriend = new UserFriends();
                $scope.newFriendError = null;
            },
            function (rejection) {
                $scope.newFriendError = rejection.data;
            });
        };

        $scope.logout = function(){
            $scope.user = undefined;
            CurrentUserService.logout();
        };
    }])
    .controller('WallPostsController', ['$scope', 'WallService', 'Post', function($scope, WallService, Post) {
        $scope.posts = [];
        $scope.newPost = new Post();
        $scope.newPostError = null;
        $scope.pageNumber = 1;
        var onPostsLoad = function(result) {
            Array.prototype.push.apply($scope.posts, result);
            $scope.pageNumber++;
        };

        var onPostsLoadError= function(rejection) {
            if(rejection.status == 404)
                $scope.pageNumber = 0;
            else
                $scope.postsLoadError = rejection.data;
        }

        var onNewPost = function(result) {
            $scope.newPost = new Post();
            $scope.newPostError = null;
            $scope.posts.unshift(result);
        }

        var onNewPostError = function(rejection) {
            $scope.newPostError = rejection.data;
        }

        $scope.getPosts = function() {
            WallService.getPosts($scope.pageNumber, onPostsLoad, onPostsLoadError);
        }

        $scope.Post = function () {
            WallService.addPost($scope.newPost, onNewPost, onNewPostError);
        }

        $scope.getPosts();

        $scope.handleScrollToBottom = function () {
            $scope.getPosts();
        };
    }])
    .controller('UserDetailController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
        $scope.username = $stateParams.username;
    }])
    .controller('UserPostsController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
        $scope.posts = UserService.getPosts($stateParams.username);
    }])
    .controller('UserFriendsController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
        $scope.friends = UserService.getFriends($stateParams.username);
    }])
    .controller('ElasticSearchController', ['$scope', '$state', function($scope, $state) {
        $scope.elasticSearchQuery = "";
        $scope.search = function() {
            $state.go('searchResult', {query: $scope.elasticSearchQuery}, {reload: true});
        }
    }])
    .controller('SearchResultController', ['$scope', '$stateParams', 'ElasticSearchService', function($scope, $stateParams, ElasticSearchService) {
        ElasticSearchService.search($stateParams.query, function(result) {
            $scope.posts = result;
        },
        function (failure) {
            alert(failure);
        });
    }])
    .controller('ChatController', ['$scope', 'ChatFactory', function ($scope, ChatFactory) {
        $scope.chatUser = null;
        $scope.newChatMessage = null;
        $scope.messages = "";
        $scope.chat = ChatFactory;

        $scope.send = function() {
            ChatFactory.send($scope.chatUser, $scope.newChatMessage);
            $scope.newChatMessage = "";
        };
    }])