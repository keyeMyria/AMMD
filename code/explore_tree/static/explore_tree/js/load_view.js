var removeHighlight = function() {
    var highlightClass = "highlight";

    $.each($("." + highlightClass), function(index, value) {
        $(value).removeClass(highlightClass);
    });
}
var filename = "";
var text = "";
var curent_node;
var xml_doc_id;

$('#explorer-panel-transparent-bgd').css({
                  'position':'fixed',
                  'top':'0px',
                  'left':'0px',
                  'width':'100%',
                  'height':'100%',
                  'display':'block',
                  'background-color':'#000',
                  'z-index':'2147483645',
                  'opacity': '0.8',
                  'filter':'alpha(opacity=80)',
                  'display':'none'
            });
$('#explore-panel-loading').css({
                  'position':'fixed',
                  'top':'50%',
                  'left':'45%',
                  'display':'block',
                  'background-color':'#000',
                  'color':'#337ab7',
                  'z-index':'2147483647',
                  'display':'none',
                  'border-style':'solid',
                  'border-color':'#337ab7'
            });

/**
* Shows a dialog to choose dialog options
*/
downloadOptions_file = function(){
  $(function() {
    $( "#dialog-download-options" ).dialog({
      modal: true,
      buttons: {
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });
//  $("#dialog-download-options").show();
}
/**
* Download the document
*/
downloadExploreTree = function(){
    $('#btn.download').on('click', downloadOptions_file());
}

/**
* Download the displaying data into an XML document
*/
download_xml_tree = function(){
  console.log('BEGIN [downloalXML]');
  //create the file to write
  var link = document.createElement('a');
  // set the file with the displaying data
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  // download the file
  link.setAttribute('download', filename);
  link.click();
  console.log('END [downloalXML]');
}
/**
* Download the displaying data into an XML document
*/
download_all_xml_tree = function(){
  $('#explorer-panel-transparent-bgd').show();
  $('#explore-panel-loading').show();

  $.ajax({
      url: "download_xml",
      method: "GET",
      data: {
          file_name: filename,
          doc_id: xml_doc_id//,
          //curent_node: curent_node
      },
      success: function(data) {
        $('#explorer-panel-transparent-bgd').hide();
        $('#explore-panel-loading').hide();
        console.log('BEGIN [downloadXML]');
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        link.setAttribute('download', filename);
        link.click();
        console.log('END [downloalXML]');
        //$("#dialog-download-options").style.display='none';
        //document.getElementById("dialog-download-options").style.display='none';
      },
      error: function() {
        console.error("An error occured while downloading the xml document");
        //$("#dialog-download-options" ).hide();
      }
    })
}
/**
* Download data corrolated to the attribute
*/
download_xml_tree_corrolation = function(event){
  $('#explorer-panel-transparent-bgd').show();
  $('#explore-panel-loading').show();

  $.ajax({
      url: "download_corrolated_xml",
      method: "GET",
      data: {
          file_name: filename,
          doc_id: xml_doc_id,
          curent_node: curent_node
      },
      success: function(data) {
        $('#explorer-panel-transparent-bgd').hide();
        $('#explore-panel-loading').hide();
        console.log('BEGIN [downloadCorrolatedXML]');
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        link.setAttribute('download', filename);
        link.click();
        console.log('END [downloalCorrolatedXML]');
        //$("#dialog-download-options" ).hide();
      },
      error: function() {
        console.error("No corrolated xml document");
        //$("#dialog-download-options" ).hide();
      }
    })
}


var displayLeafView = function(event) {
    event.preventDefault();
    removeHighlight();

    var nodeClasses = $(this).attr("class").split(" ");
    var documentId = nodeClasses[1];
    var nodeId = nodeClasses[2];
    var navigationId = $.urlParam("nav_id");

    xml_doc_id = documentId;

    $(this).parents("span:first").addClass("highlight");

    $('#explorer-panel-transparent-bgd').show();
    $('#explore-panel-loading').show();

    $.ajax({
        url: "load_view",
        method: "POST",
        data: {
            nav_id: navigationId,
            doc_id: documentId,
            node_id: nodeId,
        },

        success: function(data) {
            $('#explorer-panel-transparent-bgd').hide();
            $('#explore-panel-loading').hide();
            $("#explore-view-error").hide();
            $("#explore-view").html(data);
            $("#explore-view-download").prop('disabled',false);
            // set the filename to the current name in case the user wants to download it
            filename = data.substring(24,data.indexOf("<",24))
            // retrieve the data in case the user wants to download the displaying data
            text = data
            curent_node = nodeId

            console.log("Curent_doc:"+ documentId);

        },
        error: function() {
            $('#explorer-panel-transparent-bgd').hide();
            $('#explore-panel-loading').hide();
            $("#explore-view").hide();
            $("#explore-view-error").show();

            console.error("An error occured while executing load_view");
        }
    })
};

var displayBranchView = function(event) {
    event.preventDefault();
    removeHighlight();

    var nodeClasses = $(this).attr("class").split(" ");
    var nodeId = nodeClasses[1];
    var navigationId = $.urlParam("nav_id");

  //  console.log("Loading branch view for " + nodeId + "...");
    $(this).parents("span:first").addClass("highlight");

    $('#explorer-panel-transparent-bgd').show();
    $('#explore-panel-loading').show();
    $.ajax({
        url: "load_view",
        method: "POST",
        data: {
            nav_id: navigationId,
            node_id: nodeId
        },
        success: function(data) {
            $('#explorer-panel-transparent-bgd').hide();
            $('#explore-panel-loading').hide();
            $("#explore-view-error").hide();
            $("#explore-view").html(data);

            console.log("View successfully loaded");

        },
        error: function() {
            $('#explorer-panel-transparent-bgd').hide();
            $('#explore-panel-loading').hide();
            $("#explore-view").hide();
            $("#explore-view-error").show();

            console.error("An error occured while executing load_view");
        }
    })
};

var displayLinkView = function(event) {
    event.preventDefault();
    removeHighlight();

    var nodeClasses = $(this).attr("class").split(" ");
    var nodeId = nodeClasses[1];
    var documentId = nodeClasses[2];
    var navigationId = $.urlParam("nav_id");
    xml_doc_id = documentId;

    $('#explorer-panel-transparent-bgd').show();
    $('#explore-panel-loading').show();
    $.ajax({
        url: "load_view",
        method: "POST",
        dataType: "json",
        data: {
            nav_id: navigationId,
            doc_id: documentId,
            ref_node_id: nodeId
        },
        success: function(data) {
            $("span>."+data.doc_id).parents("span:first").addClass("highlight");
            $('#explorer-panel-transparent-bgd').hide();
            $('#explore-panel-loading').hide();
            $("#explore-view-error").hide();
            $("#explore-view").html(data.html);
            var f = JSON.stringify(data)//String(data)
            // set the filename to the current name in case the user wants to download it
            filename = f.substring(35,f.indexOf("<",24))
            text = JSON.stringify(data)
            curent_node = nodeId
            console.log("View successfully loaded");
        },
        error: function() {
            $('#explorer-panel-transparent-bgd').hide();
            $('#explore-panel-loading').hide();
            $("#explore-view").hide();
            $("#explore-view-error").show();

            console.error("An error occured while executing load_view...");
        }
    })
};

$("#explore-view-error").hide();
$('#explorer-panel-transparent-bgd').hide();
$('#explore-panel-loading').hide();

$(document).on("click", ".projection", displayLeafView);
$(document).on("click", ".branch", displayBranchView);
$(document).on("click", ".link", displayLinkView);
