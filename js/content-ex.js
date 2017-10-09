
var lpPage = (document.querySelectorAll("table.ptt td").length - 2);

var data = document.querySelector("body div.gtb p.gpc").textContent.split(" ");

var minPic = parseInt(data[1]);
var maxPic = parseInt(data[3]);

var imgNum = parseInt(gdd.querySelector("#gdd tr:nth-child(n+6) td.gdt2").textContent.split(" ")[0]);

var pagePic = maxPic - minPic +1;

var status = "false";

chrome.storage.sync.get("status",function(items) {
    status = items.status;
    if(status == "true")
    {
        viewer(document.querySelectorAll("table.ptt td").length - 2,imgNum ,minPic,maxPic);
    }



});
/*
window.onload = function(){
    console.log('load');
    var change_width = document.getElementsByClassName('tha');
    for (var i = change_width.length  ;i>0;i--)
    {
        change_width[i].setAttribute('width',100);
    }
}
*/
function viewer(lpPage, imgNum,minPic,maxPic) {
    var Gallery = function(pageNum, imgNum,minPic,maxPic) {
        this.pageNum = pageNum || 0;
        this.imgNum = imgNum || 0;
    };

    Gallery.prototype = {
        imgList: [],
        
        checkFunctional: function() {
            return (this.imgNum > 41 && this.pageNum < 2) || this.imgNum !== 0;
        },
        loadPageUrls: function(element) {
            [].forEach.call(element.querySelectorAll("a[href]"), function(item) {
                console.log('load work');
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function() {
                    if (4 == ajax.readyState && 200 == ajax.status) {
                        var imgNo =  parseInt(ajax.responseText.match("startpage=(\\d+)").pop());
                        var src = (new DOMParser()).parseFromString(ajax.responseText, "text/html").getElementById("img").src;

                        Gallery.prototype.imgList[imgNo-1].src = src;
                        chrome.storage.sync.get("width",function(item){ //when load pic ,change to its width of setting 
                            var width = null;
                            var page_width = document.getElementById("gdt").offsetWidth;
                            
                            if(item.width == undefined)
                            {
                                width = 0.8;
                            }
                            else
                            {
                                width = item.width
                            }
                            var pic_num = (imgNo-1) % (maxPic-minPic+1);
                            document.getElementById("gdt").children[pic_num].setAttribute('width',width*page_width);
                        })


                    }
                };
                ajax.open("GET", item.href);
                ajax.send(null);
            });
        },
        download_file: function(element,dir) {
            [].forEach.call(element.querySelectorAll("a[href]"), function(item) {
                console.log('load work');
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function() {
                    if (4 == ajax.readyState && 200 == ajax.status) {
                        var imgNo =  parseInt(ajax.responseText.match("startpage=(\\d+)").pop());
                        var src = (new DOMParser()).parseFromString(ajax.responseText, "text/html").getElementById("img").src;
                        
                        var download_url = src;
                        var download_filename = dir+"/" + (imgNo).toString();
                        chrome.runtime.sendMessage({url:download_url ,filename:download_filename}, function(response) {  
                            console.log(response);  
                        });



                    }
                };
                ajax.open("GET", item.href);
                ajax.send(null);
            });
        },
        getNextPage: function(action) {
            var LoadPageUrls = this.loadPageUrls;
            var download = this.download_file;
            var dir_name = document.getElementById('gj').innerHTML;
            if (dir_name == "")
            {
                dir_name = document.getElementById('gn').innerHTML;
            }
            dir_name = dir_name.replace("/"," ");
            dir_name = dir_name.replace("?"," ");
            dir_name = dir_name.replace("*"," ");
            dir_name = dir_name.replace("<"," ");
            dir_name = dir_name.replace('"'," ");
            dir_name = dir_name.replace(":"," ");
            dir_name = dir_name.replace(">"," ");
            dir_name = dir_name.replace("|"," ");
            for (var i = 0; i < this.pageNum; ++i) {
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function() {
                    if (4 == this.readyState && 200 == this.status) {
                        var dom = (new DOMParser()).parseFromString(this.responseText, "text/html");
                        if (action == 'download')
                        {
                            download(dom.getElementById("gdt"),dir_name);
                        }
                        else
                        {
                            LoadPageUrls(dom.getElementById("gdt"));
                        }
                    }
                };
                ajax.open("GET", location.href + "?p=" + i);
                ajax.send(null);
            }
        },
        download: function() {
            this.getNextPage("download");   
        },
        claenGDT: function() {
            while (gdt.firstChild && gdt.firstChild.className)
                gdt.removeChild(gdt.firstChild);
        },
        generateImg: function(callback) {
            for (var i = 0; i < this.imgNum; i++) {
                if(i<maxPic && i >= minPic - 1 )
                {
                    var img = document.createElement('img');
                    img.setAttribute("src", "http://ehgt.org/g/roller.gif");

                    this.imgList.push(img);

                    gdt.appendChild(img);
                }
                else
                {
                    var img = document.createElement("img");
                    this.imgList.push(img);
 //                   gdt.appendChild(img); //cant load all
                }
            }

            document.getElementById("gdt").style.textAlign="center";
            document.getElementById("gdt").style.maxWidth="100%";
            
            document.getElementById('gdo4').innerHTML= ""; //clear origin button(Normal Large)


            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.buttonCss{font-weight:bold;padding:3px 2px;margin:0 2px 4px 2px;white-space:nowrap;float:left;border-radius:5px;text-align:center;font-size:10pt;border:1px solid #706563;cursor:pointer}';
            document.getElementsByTagName('head')[0].appendChild(style);
            

            var single_pic = document.createElement("div");//create single button
            single_pic.className = "buttonCss";
            single_pic.innerHTML += 'single';
            gdo4.appendChild(single_pic);


            var double_pic = document.createElement("div"); //create double button
            double_pic.className = "buttonCss";
            double_pic.innerHTML = 'double';
            gdo4.appendChild(double_pic);

            var downloads = document.createElement("div");
            downloads.className = "buttonCss";
            downloads.innerHTML = "downloads";
            gdo4.appendChild(downloads);

            document.getElementById('gdo4').children[0] //when single button click change value of width
                    .addEventListener('click', function (event) {
                chrome.storage.sync.set({"width":0.8});
            });


            document.getElementById('gdo4').children[1] //when double button click change value of width
                    .addEventListener('click', function (event) {
                chrome.storage.sync.set({"width":0.48});
            });
            
            document.getElementById('gdo4').children[2]
                    .addEventListener('click',function(event){
                    
                        download_files(lpPage,imgNum,minPic,maxPic);
                    
            });

            chrome.storage.onChanged.addListener(function(changes,area){ //when value of width is changed,change width of pics
        
                var page_width = document.getElementById("gdt").offsetWidth;
                pic_width(changes.width.newValue*page_width);

            })
        
            function pic_width(width)//change width of pics 
            {
                for(var i = (maxPic-minPic+1);i>0;i--)
                { 
                document.getElementById('gdt').children[i-1].setAttribute('width',width); 
                }
            }    


            callback && callback();
        }
    };
    var g = new Gallery(lpPage,imgNum,minPic,maxPic);
    if (g.checkFunctional()) {
        g.generateImg(function() {
            g.loadPageUrls(gdt);
            g.claenGDT();
//            if (g.pageNum)
//                g.getNextPage('load');
        });
    }
    else {
        alert("There are some issue in the script\nplease open an issue on Github");
        window.open("https://github.com/strong-Ting/Gentle-Viewer/issues");
    }
    function download_files(lpPage ,imgNum,minPic,maxPic)
    {
        console.log(lpPage,imgNum,minPic,maxPic);
        var download_obj = new Gallery(lpPage,imgNum,minPic,maxPic);
        download_obj.download();
    }
/*
    chrome.contextMenus.create({
        title: 'downlaod this page! ',
        type: 'normal',
        id: 'download' ,
        contexts: ['all']
      });
*/
}


