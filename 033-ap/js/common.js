$(document).ready(function() {

    var isWider = $( '.wider' );
    isWider.next( '.container' ).addClass( 'push-down' );

    
    var hloc = window.location.href;
    if(hloc.match('#')){

        var jumpLoc = $( '#' + hloc.split("#")[1] ).offset().top - 105;

        $("html, body").animate({scrollTop: jumpLoc}, 1000);
    }

    $( '.navbar-nav li a').on('click', function(event){

        // event.preventDefault();

        var jumpLoc = $( '#' + $( this ).attr( "href" ).split('#')[1] ).offset().top - 105;

        $("html, body").animate({scrollTop: jumpLoc}, 1000);
    });

    $(".TOCtoggle").click(function(){

        var divID = "#toc-" + $(this).attr('data-name'); 
        $(divID).slideToggle(1, function(){

            // buildMasonry();
           
        });
    });  

});


function getresult(url) {

    $('#grid').attr('data-go', '0');

    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function(){

            $('#loader-icon').show();
        },
        success: function(data){
            
            $('#grid').attr('data-go', '0');
            
            var obj = JSON.parse(data);

            if(obj.articles == "noData") {

                $('#grid').append('<div id="no-more-icon">No more<br />items<br />to show</div>');
                $('#loader-icon').hide();
                return;
            }
            // console.log(obj);
            displayArticlesFromJson(data);
        },
        error: function(){console.log("Fail");}
  });
}

function displayArticlesFromJson(json){

    // This requires the following properties in the json file
    // albumID, randomImagePath, leafCount, field

    var gutter = parseInt(jQuery('.post').css('marginBottom'));
    var grid = $('#posts');

    var obj = JSON.parse(json);
    
    // var aux = (obj.auxiliary === undefined) ? '' : obj.auxiliary;
    // var filterString = (aux.filterString === undefined) ? '' : aux.filterString;
    // console.log(obj['articles'][0]['author']);

    for(i = 0; i < Object.keys(obj['articles']).length; i++) {

        var displayString = "";

        displayString += '<div class="full-width-card col-md-5">';
        displayString += '<h4 class="publication-details">';

        if(obj['articles'][i]['feature'])
            displayString += '<span class="orange"><a href="' + base_url + 'articles/category/feature/' + obj['articles'][i]['feature'] + '">' + obj['articles'][i]['feature'] + '</a></span>';

        if(obj['articles'][i]['series'])
            displayString += '<span class="brown"><a href="' + base_url + 'articles/category/series/' + obj['articles'][i]['series'] + '">' + obj['articles'][i]['series'] + '</a></span>';
    
        displayString += '<span class="gray"><a href="' + base_url + 'articles/toc?year=' + obj['articles'][i]['year'] + '&month=' + obj['articles'][i]['month'] + '">' + getMonthDevanagari(obj['articles'][i]['month']) + ' ' + roman2Devnagari(obj['articles'][i]['year']) + ' (' + nav_archive_volume + ' ' + roman2Devnagari(rlZero(obj['articles'][i]['volume'])) + ', ' + getIssueDevanagari(obj['articles'][i]['issue']) + ')</a></span>';
    
        displayString += '</h4>';
        displayString += '<h2 class="title">';
        displayString += '<a target="_blank" href="' + base_url + 'article/text/' + obj['articles'][i]['year'] + '/' + obj['articles'][i]['month'] + '/' + obj['articles'][i]['page'] + '?search=' + obj['fullTextSearch'] + '" class="pdf">' + obj['articles'][i]['title'] + '</a>';
        displayString += '</h2>';

        if(obj['articles'][i]['author']){
            
            displayString +=  '<h3 class="author by">';
            
            for(j = 0; j < Object.keys(obj['articles'][i]['author']).length; j++) {
                displayString += '<span><a href="' + base_url + '/articles/author/' + obj['articles'][i]['author'][j]['name'] + '">' + obj['articles'][i]['author'][j]['name'] + '</a></span>';
            }

            displayString += '</h3>';
        }

        if(obj['articles'][i]['media'] == 'html')
            displayString += '<div class="starred" title="Mobile friendly article"><i class="fa fa-star"></i></div>';

        displayString += '</div>';

        $('#posts').append($.parseHTML(displayString));
    }


    $('#loader-icon').hide();
    $('#grid').attr('data-go', '1');
}

function rlZero(month){

    month = month.replace(/^0+|\-0+/, '');
    return month;
}

function getMonthDevanagari(month){

    month = month.replace(/^special[AB]*/i, 'विशेषाङ्कः');
    
    month = month.replace(/01/, 'जनवरी', month);
    month = month.replace(/02/, 'फेब्रवरी', month);
    month = month.replace(/03/, 'मार्च्', month);
    month = month.replace(/04/, 'एप्रिल्', month);
    month = month.replace(/05/, 'मे', month);
    month = month.replace(/06/, 'जून्', month);
    month = month.replace(/07/, 'जुलै', month);
    month = month.replace(/08/, 'अगस्ट्', month);
    month = month.replace(/09/, 'सप्टम्बर्', month);
    month = month.replace(/10/, 'अक्टोबर्', month);
    month = month.replace(/11/, 'नवम्बर्', month);
    month = month.replace(/12/, 'डिसेम्बर्', month);

    return month;
}

function getIssueDevanagari(issue){

    issue = issue.replace(/^0/g, "", issue);
    
    issue = nav_archive_issue + ' ' + issue;

    issue = issue.replace(/0/g, "०", issue);
    issue = issue.replace(/0/g, "०", issue);
    issue = issue.replace(/1/g, "१", issue);
    issue = issue.replace(/2/g, "२", issue);
    issue = issue.replace(/3/g, "३", issue);
    issue = issue.replace(/4/g, "४", issue);
    issue = issue.replace(/5/g, "५", issue);
    issue = issue.replace(/6/g, "६", issue);
    issue = issue.replace(/7/g, "७", issue);
    issue = issue.replace(/8/g, "८", issue);
    issue = issue.replace(/9/g, "९", issue);
    issue = issue.replace(nav_archive_issue + ' SpecialA', "विशेषाङ्कः");
    issue = issue.replace(nav_archive_issue + ' SpecialB', "विशेषाङ्कः");
    issue = issue.replace(nav_archive_issue + ' Special', "विशेषाङ्कः");

    return issue;
}

function roman2Devnagari(num){

    num = num.replace(/^0/g, "", num);
    num = num.replace(/0/g, "०", num);
    num = num.replace(/0/g, "०", num);
    num = num.replace(/1/g, "१", num);
    num = num.replace(/2/g, "२", num);
    num = num.replace(/3/g, "३", num);
    num = num.replace(/4/g, "४", num);
    num = num.replace(/5/g, "५", num);
    num = num.replace(/6/g, "६", num);
    num = num.replace(/7/g, "७", num);
    num = num.replace(/8/g, "८", num);
    num = num.replace(/9/g, "९", num);
    num = num.replace(/^specialA$/g, "विशेषाङ्कः", num);
    num = num.replace(/^specialB$/g, "विशेषाङ्कः", num);
    num = num.replace(/^special$/g, "विशेषाङ्कः", num);

    return num;
}