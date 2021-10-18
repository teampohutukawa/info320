// Add your code here

var app = angular.module('myApp', ["ui.bootstrap"]);

app.controller('myCtrl', function($scope, $http, $filter) {

    $http.get('results.json').then(function(data){
        $scope.results = data.data;

        $scope.results = $scope.create_hearts($scope.results)
        $scope.fav_page = false;
        $scope.adv_search = false;
        $scope.results_page = false;
    });


    // Toggle home nav bar
    var home = document.getElementById("myHome");
    var about = document.getElementById("myAbout");

    $scope.click_home_about = function(){
        about.classList.add("home_active");
        about.classList.remove("home_not_active");

        home.classList.remove("home_active");
        home.classList.add("home_not_active");
    }
    $scope.click_home_home = function(){
        home.classList.add("home_active");
        home.classList.remove("home_not_active");
        
        about.classList.remove("home_active");
        about.classList.add("home_not_active");
    }    
    

    $scope.viewby = 10;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 10;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first page
    };

    $scope.reset_currentPage = function(){
        $scope.currentPage = 1; // reset
    }

    // Sort by 
    $scope.reverse = false;
    $scope.setSortBy = function(sortby){
         $scope.reverse = ($scope.sortby === sortby) ? !$scope.reverse : false;  
         $scope.predicate = sortby;
    }
    
    $scope.sortby = 'title';
    $scope.reverse = true;
    $scope.predicate = '';
    $scope.setSortBy = function (sortby) {
        if (sortby === "Title"){
            $scope.predicate = "title";
        }
        if (sortby === "Author"){
            $scope.predicate = "authors";
        }
        if (sortby === "Date-newest"){
            $scope.predicate = "year";
        }
        if (sortby === "Date-newest"){
            $scope.predicate = "year";
            $scope.reverse = false;
        }
        $scope.reverse = ($scope.sortby === predicate) ? !$scope.reverse : false;  
        $scope.sortby = sortby;  
    };  

    // ng-show
    $scope.showHome = true;
    $scope.showResults = false;
    $scope.showNavBar = false;
    $scope.showFeedback = false;
    $scope.showPagination = false;
    $scope.show_adv_search = false;
    

    // testing use
    // $scope.showHome = false;
    // $scope.showResults = true;
    // $scope.showNavBar = true;
    // $scope.showFeedback = false;
    // $scope.showPagination = true;
    // $scope.show_adv_search = false;

    // Hide all function
    $scope.hideAll = function (){
        $scope.showHome = false;
        $scope.showResults = false;
        $scope.showNavBar = false;
        $scope.showFeedback = false;
        $scope.showPagination = false;
        $scope.show_adv_search = false;
    };

    // Reset Advancded search
    $scope.reset_search_adv = function(){
        $scope.search_field_1 ='Any field';
        $scope.search_opt_1 ='contains';
        $scope.search_input_1 = "";

        $scope.search_comparator_2 ='AND';
        $scope.search_field_2 ='Any field';
        $scope.search_opt_2 ='starts with';
        $scope.search_input_2 = "";

        $scope.adv_year_start_model = "";
        $scope.adv_year_end_model = "";
    }

    // Toggle Advanced filter Arrow Drop
    $scope.show_adv_up = false;
    $scope.show_adv_down = true;
    $scope.toggle_adv = function(){
        var results = document.getElementById("resultsPage");
        var topnav = document.getElementById("topnav");
        var feedback = document.getElementById("searchFeedback");
        

        // show advanced filters
        if($scope.show_adv_down == true){
            $scope.adv_search = true;
            $scope.reset_search_adv();

            $scope.show_adv_down = false;
            $scope.show_adv_up = true;
            $scope.show_adv_search = true;

            // change results page top
            results.classList.remove("resultsPage_top");
            results.classList.add("resultsPage_adv_top");

            feedback.classList.remove("resultsPage_top");
            feedback.classList.add("resultsPage_adv_top");

            // change nav bar height
            topnav.classList.remove("topnav_height");
            topnav.classList.add("topnav_adv_height");   
        }
        // dont show
        else if($scope.show_adv_up == true){
            $scope.adv_search = false;
            $scope.reset_search_adv();

            $scope.show_adv_down = true;
            $scope.show_adv_up = false;
            $scope.show_adv_search = false;

            // change results page top
            results.classList.add("resultsPage_top");
            results.classList.remove("resultsPage_adv_top");

            feedback.classList.add("resultsPage_top");
            feedback.classList.remove("resultsPage_adv_top");

            // change nav bar height
            topnav.classList.add("topnav_height");
            topnav.classList.remove("topnav_adv_height");
        }
    }
    
    // add heart illed filed to data
    $scope.create_hearts = function(data){
        for (var i = 0; i < data.length; i++) {
            data[i].heart_filled = false;
        }
        return data;
    }
    //user favs
    $scope.my_favs = [];
    

    $scope.userSearch = "";
    $scope.searchFeedback = "Please enter a query in the search box above.";
    

    // Clear button
    $scope.clickClear = function(){
        $scope.userSearch = "";
    }
    // Search button
    $scope.clickSearch = function(userSearch){
        if ($scope.fav_page ===  false){
            $scope.results_page = true;
            $scope.results_page_userSearch = userSearch;
            $scope.database = $scope.results;
        }
        else if($scope.fav_page ===  true){
            $scope.database = $scope.my_favs;
        }

        $scope.hideAll();
        $scope.showNavBar = true;
        $scope.showResults = true;
        $scope.showPagination = true;

        // search feedback
        if (userSearch == ""){
            $scope.hideAll();
            $scope.showNavBar = true;
            $scope.showFeedback = true;
        }
        else{
            // change bg color
            var body = document.body;
            body.classList.add("resultPage_color");

            // Filter results
            $scope.filteredSearch = $filter('filter')($scope.database,
                function(result) {
                    $scope.result = result && (
                        result.title.match(userSearch) || 
                        result.publ_info_summary.match(userSearch) || 
                        result.snippet.match(userSearch)
                    );
                    return $scope.result
                }
            );

            $scope.search_results = $scope.filteredSearch;
            $scope.totalItems = $scope.filteredSearch.length;
            $scope.currentPage = 1; // reset

                        
            $scope.hideAll();
            $scope.showNavBar = true;
            $scope.showResults = true;
            $scope.showPagination = true;
            
        }
    }

    // Advanced search button
    $scope.clickSearch_adv = function(search_field_1, search_opt_1, search_input_1, adv_year_start_model, adv_year_end_model){
        if ($scope.fav_page ===  false){
            $scope.results_page = true;
            $scope.results_page_search_field_1 = search_field_1;
            $scope.results_page_search_opt_1 = search_opt_1;
            $scope.results_page_search_input_1 = search_input_1;
            $scope.results_page_adv_year_start_model = adv_year_start_model;
            $scope.results_page_adv_year_end_model = adv_year_end_model;
            $scope.database = $scope.results;
        }
        else if($scope.fav_page ===  true){
            $scope.database = $scope.my_favs;
        }

         
        //reset general search
        $scope.userSearch = "";

        $scope.hideAll();
        $scope.showNavBar = true;
        $scope.showResults = true;
        $scope.showPagination = true;

        
        // No search or year
        if($scope.search_input_1 == "" && !adv_year_start_model && !adv_year_end_model){
            console.log("completely empty")
            $scope.searchFeedback = "Please enter a query in the search box above.";
            $scope.hideAll();
            $scope.showNavBar = true;
            $scope.show_adv_search = true;
            $scope.showFeedback = true;
        }
        else{
            // End year bigger than Start year
            if (adv_year_start_model && adv_year_end_model && adv_year_start_model > adv_year_end_model){
                $scope.searchFeedback = "Invalid Start and End Year.";
                $scope.hideAll();
                $scope.showNavBar = true;
                $scope.show_adv_search = true;
                $scope.showFeedback = true;    
            }
            // Every other condition 
            else{
                // no search, end yr
                // no search, start yr
                // no search both  yrs
                if (adv_year_start_model || adv_year_end_model){
                    $scope.filteredSearch = $filter('filter')($scope.database, function(result) {
                        // Only Start year
                        if (adv_year_start_model && !adv_year_end_model){
                            console.log("start !end")
                            $scope.result = result && (
                                result.year >= adv_year_start_model
                            );
                        }
                        // Only End year
                        if(!adv_year_start_model && adv_year_end_model){
                            console.log("empty   !start end")
                            $scope.result = result && (
                                result.year <= adv_year_end_model
                            );
                        }
                        // Both years
                        if(adv_year_start_model && adv_year_end_model){
                            console.log("empty   start end")
                            $scope.result = result && (
                                result.year >= adv_year_start_model &&
                                result.year <= adv_year_end_model
                            );
                        }
                        return $scope.result;
                    });
                }
                // search, end yr
                // search start yr
                // search, both yrs
                // search, no yr
                if (!$scope.search_input_1 == ""){
                    console.log("search not empty")
                    // data depending on if Year is entered
                    if (!adv_year_start_model && !adv_year_end_model){
                        $scope.filtered = $scope.database;
                    }
                    else{
                        $scope.filtered = $scope.filteredSearch;
                    }

                    $scope.filteredSearch = $filter('filter')($scope.filtered, function(result) {
                        if (search_field_1 === "Any field"){
                            if (search_opt_1 === "contains"){
                                $scope.result = result && (
                                    result.title.toLowerCase().match(search_input_1) || 
                                    result.publ_info_summary.toLowerCase().match(search_input_1) || 
                                    result.snippet.toLowerCase().match(search_input_1)
                                );
                            }
                            else if (search_opt_1 === "is (exact)"){
                                $scope.result = result && (
                                    result.title === search_input_1 || 
                                    result.publ_info_summary === search_input_1 || 
                                    result.snippet === search_input_1
                                );
                            } 
                            else{
                                $scope.result = result && (
                                    result.title.toLowerCase().startsWith(search_input_1) || 
                                    result.publ_info_summary.toLowerCase().startsWith(search_input_1) || 
                                    result.snippet.toLowerCase().startsWith(search_input_1)
                                );
                            }
                        }
                        else if (search_field_1 === "Title"){
                            if (search_opt_1 === "contains"){
                                $scope.result = result && (
                                    result.title.toLowerCase().match(search_input_1)
                                );
                            }
                            else if (search_opt_1 === "is (exact)"){
                                $scope.result = result && (
                                    result.title === search_input_1
                                );
                            } 
                            else{
                                $scope.result = result && (
                                    result.title.toLowerCase().startsWith(search_input_1)
                                );
                            }
                        }
                        else if (search_field_1 === "Author"){
                            if (search_opt_1 === "contains"){
                                $scope.result = result && (
                                    result.authors.toLowerCase().match(search_input_1)
                                );
                            }
                            else if (search_opt_1 === "is (exact)"){
                                $scope.result = result && (
                                    result.authors === search_input_1
                                );
                            } 
                            else{
                                $scope.result = result && (
                                    result.authors.toLowerCase().startsWith(search_input_1)
                                );
                            }
                        }
                        else{
                            if (search_opt_1 === "contains"){
                                $scope.result = result && (
                                    result.snippet.toLowerCase().match(search_input_1)
                                );
                            }
                            else if (search_opt_1 === "is (exact)"){
                                $scope.result = result && (
                                    result.snippet === search_input_1
                                );
                            } 
                            else{
                                $scope.result = result && (
                                    result.snippet.toLowerCase().startsWith(search_input_1)
                                );
                            }
                        }
                        return $scope.result
                    });
                }

                $scope.search_results = $scope.filteredSearch;
                $scope.totalItems = $scope.filteredSearch.length;
                $scope.currentPage = 1; // reset

                $scope.hideAll();
                $scope.showNavBar = true;
                $scope.show_adv_search = true;
                $scope.showResults = true;
                $scope.showPagination = true;
            }
        }
    };
    
    

    


    // Results page - Pohutukawa icon
    $scope.clickHome = function(){
        var body = document.body;
        body.classList.remove("resultPage_color");

        // reset results page
        var results = document.getElementById("resultsPage");
        results.classList.remove("resultsPage_adv_top");
        results.classList.add("resultsPage_top");

        //reset nav bar
        var topnav = document.getElementById("topnav");
        topnav.classList.add("topnav_height");
        topnav.classList.remove("topnav_adv_height");


        $scope.hideAll();
        $scope.userSearch = "";
        $scope.showHome = true;
    }

    // Results Page - open link
    $scope.clickLink = function(index){
        var link = $scope.filteredSearch[index].link;
        const tab = window.open(link, '_blank');
    }

    // click heart to add to favourites
    $scope.click_heart = function(index){
        // click to add to favs
        if($scope.filteredSearch[index].heart_filled === false){
            $scope.filteredSearch[index].heart_filled = true;

            // add to favs
            var result = {
                "result_id": $scope.filteredSearch[index].result_id,
                "title": $scope.filteredSearch[index].title,
                "publ_info_summary": $scope.filteredSearch[index].publ_info_summary,
                "authors": $scope.filteredSearch[index].authors,
                "year": $scope.filteredSearch[index].year,
                "site": $scope.filteredSearch[index].site,
                "snippet": $scope.filteredSearch[index].snippet,
                "link": $scope.filteredSearch[index].link,
                "cited_by_total": $scope.filteredSearch[index].cited_by_total,
                "heart_filled": $scope.filteredSearch[index].heart_filled
            }
            $scope.my_favs.push(result);
            
        } // click to remove from favs
        else if($scope.filteredSearch[index].heart_filled === true){
            $scope.filteredSearch[index].heart_filled = false;

            var my_favs_ind = $scope.my_favs.findIndex(x => x.result_id === $scope.filteredSearch[index].result_id);
            $scope.my_favs.splice(my_favs_ind, 1);
            
        }
    }


    // click favs
    $scope.click_favs = function(){
        $scope.results_page = false;

        $scope.userSearch = "";
        var input = document.getElementById ("nav_input");
        input.placeholder = "Search favourites";

        $scope.show_adv_down = true;
        $scope.show_adv_up = false;

        $scope.fav_page = true;
        $scope.filteredSearch = $scope.my_favs
        $scope.totalItems = $scope.filteredSearch.length;
        $scope.currentPage = 1; // reset

        // reset results page
        var results = document.getElementById("resultsPage");
        results.classList.remove("resultsPage_adv_top");
        results.classList.add("resultsPage_top");

        //reset nav bar
        var topnav = document.getElementById("topnav");
        topnav.classList.add("topnav_height");
        topnav.classList.remove("topnav_adv_height");

        $scope.hideAll();
        $scope.showNavBar = true;
        $scope.showPagination = true;
        $scope.showResults = true;
    }
    

    // click go back
    $scope.click_back = function(){
        $scope.fav_page = false;
        $scope.filteredSearch = $scope.search_results;
        $scope.totalItems = $scope.search_results.length;
        $scope.currentPage = 1; // reset

                    
        $scope.hideAll();
        $scope.showNavBar = true;
        $scope.showResults = true;
        $scope.showPagination = true;
        

        var results = document.getElementById("resultsPage");
        var topnav = document.getElementById("topnav");
        var feedback = document.getElementById("searchFeedback");

        if ($scope.results_page === true){
            $scope.clickHome();
        }
        // if didnt use advanced
        else if ($scope.adv_search === false){
            var input = document.getElementById ("nav_input");
            input.placeholder = "Search anything";

            $scope.results_page = true;

            $scope.userSearch = $scope.results_page_userSearch;

            $scope.show_adv_down = true;
            $scope.show_adv_up = false;
            $scope.show_adv_search = false;

            // change results page top
            results.classList.add("resultsPage_top");
            results.classList.remove("resultsPage_adv_top");

            feedback.classList.add("resultsPage_top");
            feedback.classList.remove("resultsPage_adv_top");

            // change nav bar height
            topnav.classList.add("topnav_height");
            topnav.classList.remove("topnav_adv_height");

            $scope.clickSearch($scope.userSearch)

        }
        // if used advanced
        else if ($scope.adv_search === true){
            var input = document.getElementById ("nav_input");
            input.placeholder = "Search anything";

            $scope.results_page = true;

            $scope.search_field_1 = $scope.results_page_search_field_1;
            $scope.search_opt_1 = $scope.results_page_search_opt_1;
            $scope.search_input_1 = $scope.results_page_search_input_1;
            $scope.adv_year_start_model = $scope.results_page_adv_year_start_model;
            $scope.adv_year_end_model = $scope.results_page_adv_year_end_model;

            $scope.show_adv_down = false;
            $scope.show_adv_up = true;
            $scope.show_adv_search = true;

            // change results page top
            results.classList.remove("resultsPage_top");
            results.classList.add("resultsPage_adv_top");

            feedback.classList.remove("resultsPage_top");
            feedback.classList.add("resultsPage_adv_top");

            // change nav bar height
            topnav.classList.remove("topnav_height");
            topnav.classList.add("topnav_adv_height");   

            $scope.clickSearch_adv($scope.search_field_1, $scope.search_opt_1, $scope.search_input_1, $scope.adv_year_start_model, $scope.adv_year_end_model);
        }
        

    }

});

