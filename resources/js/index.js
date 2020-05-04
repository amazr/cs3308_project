// change body background image
var imageList = ['url(../img/bg1.jpg)','url(../img/bg2.png)','url(../img/bg3.jpg)']
var imageIndex = 0;
var changeInterval = 8*1000*3600;
function changeBodyBg(){
    $('body').css('background-image',imageList[0]);
    imageIndex++;
    setInterval(function(){
        if(imageIndex>=imageList.length){
            imageIndex = 0
        }
        $('body').css('background-image',imageList[imageIndex])
        imageIndex++;
    },changeInterval)
    
}

changeBodyBg();