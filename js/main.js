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

    var init = function() {
        canvasText = document.getElementById('text');
        canvasEffect = document.getElementById('effect');
        contextText = canvasText.getContext('2d');
        contextEffect = canvasEffect.getContext('2d');
        resize();
        contextText.font = '8em Impact';

        var hCenter = $(window).width() / 2;
        var vCenter = $(window).height() / 4;
        var titles = $('span.title');
        var padding = titles.first().height();
        var textTopX = hCenter - (titles.first().width() / 2);
        var textTopY = vCenter - (titles.first().height() / 4);
        var textBottomX = hCenter - (titles.last().width() / 2);
        var textBottomY = vCenter - (titles.last().height() / 4) + padding;

        contextText.fillStyle = generateColor();
        contextText.fillText('ADAM', textTopX, textTopY);
        contextText.fillStyle = generateColor();
        contextText.fillText('YORK', textBottomX, textBottomY);
        engine = new window.Physics(canvasText, canvasEffect, contextText, contextEffect);
        engine.start();
    };

    var resize = function() {
        canvasText.width = $(window).width();
        canvasText.height = $(window).height() / 2;
        canvasEffect.width = $(window).width();
        canvasEffect.height = $(window).height() / 2;
    };

    var generateColor = function(str) {
        var color = str || '#';
        color += Number(Math.round(Math.random() * 255)).toString(16);
        if (color.length < 7) {
            return generateColor(color);
        }
        return color;
    };

    $(document).ready(init);
    $(window).resize(resize);

})(window);