console.log("injected script")
const baseURL = "https://18h.animezilla.com/"
const baseMangaURL = "https://18h.animezilla.com/manga/";
const bypassURL = "http://localhost:8080/";
var imageList = [];
var win;
var windowList = [];
function startCollect(){
    var txt = window.location.href;
    var mangaID = GetMangaID(txt);
    if(imageList.length != fetchMangaTotalPages()){
        for(var i = 1 ; i <= fetchMangaTotalPages() ; i++){
            setTimeout(function(mID,pageN){fetchComicPageImageURL(mID,pageN)},0,mangaID,i)
        }
    }
    checkLoadFinishedLoop();
}
function checkLoadFinishedLoop(){
    if(imageList.length == fetchMangaTotalPages()){
        //load finished
        showDownloadedManga(imageList)
    }else{
        setTimeout(checkLoadFinishedLoop, 1000);
    }
}
function showDownloadedManga(imgList){
    var w = window.open("");
    for(var i = 0 ; i < imgList.length ; i++){
        for(var j = 0 ; j < imgList.length ; j++){
            var datum = imgList[j];
            if(datum[0] == i){
                var dataURI = imgList.find(datum=>datum[0]==i)[1];
                //var blob = dataURItoBlob(dataURI);
                //var uri = URL.createObjectURL(blob);
                console.log(dataURI)
                var img = w.document.createElement("img");
                img.src = dataURI;
                w.document.body.appendChild(img);
                var br = w.document.createElement("br");
                w.document.body.appendChild(br);
            }
        }
    }
}
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }
function submitWebsite(){
    var txt = document.getElementById("website").value;;
    var mangaID = GetMangaID(txt);
    for(var i = 1 ; i <= fetchMangaTotalPages() ; i++){
        fetchComicPageImageURL(mangaID, i);
    }
    
    
}
function fetchMangaTotalPages(){
    var result = document.getElementsByClassName("entry-title")[0];
    if(result == undefined){
    }else{
        var txt = result.innerHTML;
        var indexOfSlash = -1;
        for(var i = txt.length-1 ; i>=0 ; i--){
            if(txt[i]=="/"){
                indexOfSlash = i;
                break;
            }
        }
        return txt.substring(indexOfSlash+1,txt.length);
    }
    return undefined;
}
function fetchWebsiteBlob(webURL){
    return new Promise(function (resolve, reject) {
        var element = fetch(bypassURL+webURL)
        .then(res => res.blob())
        .then(b=> URL.createObjectURL(b))
        .then(blobURL => {
            if (blobURL==undefined) reject(err);
            else resolve(blobURL);
        })
    });
    
}
function AddImageByURL(pageNumber, url){
    url = bypassURL+url;
    fetch(url)
    .then(res => res.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(img => {
        imageList.push([pageNumber,img]);
    })
}
function fetchComicPageImageURL(id, pageNumber){
    var url = GetMangaPageURL(id,pageNumber);
    url = url;
    w = window.open(url)
    //w.onload = 
    doWhenAllImagesIsLoadedInWindow(w,
        function(ww){
            try{
                var imgElement = ww.document.getElementById("comic");
                imageList.push([pageNumber,imgElement.src])
                //imageList.push([pageNumber,imageToDataUri(imgElement)])
            }catch(e){

            }
            ww.close();
        },w
    )
}
function imageToDataUri(imgElement){
    return (function(w,d,element) {
        'use strict';
        var svg = new XMLSerializer().serializeToString(element);
        var base64 = w.btoa( svg );
        return 'data:image/svg+xml;base64,' + base64;
     }(window, document, imgElement));
}
function doWhenAllImagesIsLoadedInWindow(www,func,...args){
    www.onload=function(){
        func.apply(this,args);
    }
}
function AddPageNumberElementToWindow(w, pageNumber){
    var para = w.document.createElement("p");
    para.id = "pageNumber"
    var node = w.document.createTextNode(pageNumber);
    para.appendChild(node);
    var element = w.document.head
    element.appendChild(para);
}
function GetMangaID(txt){
    txt = txt.replace(baseMangaURL,"");
    if(txt.indexOf("/")!=-1){
        txt = txt.substring(0,txt.indexOf("/"))
    }
    return txt;
}
function GetMangaString(txt){
    var id = GetMangaID(txt);
    var result = "manga/"+id;
    return result;
}
function GetMangaPageURL(id, pageNumber){
    return baseMangaURL+id+"/"+pageNumber
}