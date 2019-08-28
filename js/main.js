/*!
 * physics
 * Copyright(c) 2016 Adam York
 * MIT Licensed
 */

'use strict';

(function(scope) {

    var canvasText;
    var canvasEffect;
    var contextText;
    var contextEffect;
    var engine;

    let init = function() {
        canvasText = document.getElementById('text');
        contextText = canvasText.getContext('2d'); 
        canvasEffect = document.getElementById('effect');
        contextEffect = canvasEffect.getContext('2d');
        resize();
        engine = new window.Physics(canvasText, canvasEffect, contextText, contextEffect);
        engine.start();
    };

    let resize = function() {
        canvasEffect.width = $(window).width();
        canvasEffect.height = $(window).height()/4;
        canvasText.width = $(window).width();
        canvasText.height = $(window).height()/4;
        contextText.textAlign = 'center';
        contextText.font = '8em Impact';
        contextText.fillStyle = '#dfdde0';
        contextText.fillText('BREAK THINGS', $(window).width()/2 ,$(window).height()/5);
        $("#footer").css('top', canvasEffect.height);
    };

    $(document).ready(init);
    $(window).resize(resize);

})(window);