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


(function(lpPage, lpImg,minPic,maxPic) {
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
                        console.log(imgNo);
                        console.log(src);
                        console.log(Gallery.prototype.imgList);
                        Gallery.prototype.imgList[imgNo-1].src = src;
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
            console.log(maxPic,minPic,this.imgNum);
                        for (var i = 0; i < this.imgNum; i++) {
                if(i<maxPic && i >= minPic - 1 )
                {
                    var img = document.createElement('img');
                    img.setAttribute("src", "http://ehgt.org/g/roller.gif");
                    this.imgList.push(img);
                    console.log(this.imgList.length);
                    gdt.appendChild(img);
                   
                }
                else
                {
                    var img = document.createElement("img");
                    this.imgList.push(img);
                    console.log(this.imgList.length);
                    
                }
            }
            callback && callback();
            document.getElementById("gdt").style.textAlign="center";
            document.getElementById("gdt").style.maxWidth="100%";

        }
    };
    var g = new Gallery(lpPage, lpImg,minPic,maxPic);
    if (g.checkFunctional()) {
        g.generateImg(function() {
            g.loadPageUrls(gdt);
            g.claenGDT();
            if (g.pageNum)
                g.getNextPage();
        });
    }
    else {
        alert("There are some issue in the script\nplease open an issue on Github");
        window.open("https://github.com/knowlet/Gentle-Viewer/issues");
    }
})(document.querySelectorAll("table.ptt td").length - 2,imgNum ,minPic,maxPic);

