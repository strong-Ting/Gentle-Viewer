// ==UserScript==
// @name         Gentle Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.4
// @description  Auto load hentai pic.
// @icon         http://e-hentai.org/favicon.ico
// @author       KNowlet
// @include      /^http[s]?:\/\/g.e-hentai.org\/g\/.*$/
// @include      /^http[s]?:\/\/exhentai.org\/g\/.*$/
// @grant        none
// @downloadURL  https://github.com/knowlet/Gentle-Viewer/raw/master/GentleViewer.user.js
// ==/UserScript==

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



function viewer(lpPage, lpImg,minPic,maxPic) {
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
                            var pic_num = (imgNo-1) % 20;
                            document.getElementById("gdt").children[pic_num].setAttribute('width',width*page_width);
                        })


                    }
                };
                ajax.open("GET", item.href);
                ajax.send(null);
            });
        },
        getNextPage: function() {
            var LoadPageUrls = this.loadPageUrls;
            for (var i = 1; i < this.pageNum; ++i) {
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function() {
                    if (4 == this.readyState && 200 == this.status) {
                        var dom = (new DOMParser()).parseFromString(this.responseText, "text/html");
                        LoadPageUrls(dom.getElementById("gdt"));
                    }
                };
                ajax.open("GET", location.href + "?p=" + i);
                ajax.send(null);
            }
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
                }
            }

            document.getElementById("gdt").style.textAlign="center";
            document.getElementById("gdt").style.maxWidth="100%";
            
            document.getElementById('gdo4').innerHTML= ""; //clear origin button(Normal Large)

            var single_pic = document.createElement("div");//create single button
            single_pic.className = "tha nosel";
            single_pic.innerHTML += 'single';
            gdo4.appendChild(single_pic);


            var double_pic = document.createElement("div"); //create double button
            double_pic.className = "tha nosel";
            double_pic.innerHTML = 'double';
            gdo4.appendChild(double_pic);

            document.getElementById('gdo4').children[0] //when single button click change value of width
                    .addEventListener('click', function (event) {
                chrome.storage.sync.set({"width":0.8});
            });


            document.getElementById('gdo4').children[1] //when double button click change value of width
                    .addEventListener('click', function (event) {
                chrome.storage.sync.set({"width":0.48});
            });


            chrome.storage.onChanged.addListener(function(changes,area){ //when value of width is changed,change width of pics
        
                var page_width = document.getElementById("gdt").offsetWidth;
                pic_width(changes.width.newValue*page_width);

            })
        
            function pic_width(width)//change width of pics 
            {
                for(var i = document.getElementById('gdt').children.length;i>0;i--) 
                document.getElementById('gdt').children[i-1].setAttribute('width',width); 
            }    


            callback && callback();
        }
    };
    var g = new Gallery(lpPage, lpImg,minPic,maxPic);
    if (g.checkFunctional()) {
        g.generateImg(function() {
            g.loadPageUrls(gdt);
            g.claenGDT();
        //    if (g.pageNum)
                //g.getNextPage();
        });
    }
    else {
        alert("There are some issue in the script\nplease open an issue on Github");
        window.open("https://github.com/knowlet/Gentle-Viewer/issues");
    }
}
