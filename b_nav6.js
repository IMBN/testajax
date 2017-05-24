/*headlink6*/
var tag;
var org;
var includetxt;


function navactive()
{
    var node=document.getElementsByTagName("head")[0];
    var type=node.getAttribute("nav");
    if(type=="task" || type=="user" || type=="sys")
    {
        var tagid="nav"+type;
        node=document.getElementById(tagid);
        $(node.parentNode).addClass("active");
    }
    //var t=node.parentNode.getAttribute("class");
    //node.parentNode.setAttribute("class",t+" active");
}

function include_nav()
{
    tag=document.getElementById("firstdiv");
    org=tag.innerHTML;
    
    

    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET","nav_nav.html",false);
    xmlhttp.send();

    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        includetxt=xmlhttp.responseText;
        tag.innerHTML=includetxt+org;
    }
    else
    {
        alert("Can't Get Nav.html["+xmlhttp.readyState+"/"+xmlhttp.status+"]");
    }
}

function include_dialog()
{
    tag=document.getElementsByTagName("body")[0];
    org=tag.innerHTML;

    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET","nav_modal.html",false);
    xmlhttp.send();

    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        includetxt=xmlhttp.responseText;
        tag.innerHTML=includetxt+org;
    }
    else
    {
        alert("Can't Get Dialog.html["+xmlhttp.readyState+"/"+xmlhttp.status+"]");
    }
}