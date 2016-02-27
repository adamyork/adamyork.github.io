/*!
 * physics
 * Copyright(c) 2016 Adam York
 * MIT Licensed
 */

'use strict';

(function(scope) {

    var canvas;
    var context;
    var engine;

    var init = function() {
        canvas = document.getElementById('display');
        context = canvas.getContext('2d');
        resize();
        context.font = '8em Impact';

        var hCenter = $(window).width() / 2;
        var vCenter = $(window).height() / 4;
        var titles = $('span.title');
        var padding = titles.first().height();
        var textTopX = hCenter - (titles.first().width() / 2);
        var textTopY = vCenter - (titles.first().height() / 4);
        var textBottomX = hCenter - (titles.last().width() / 2);
        var textBottomY = vCenter - (titles.last().height() / 4) + padding;

        context.fillStyle = generateColor();
        context.fillText('ADAM', textTopX, textTopY);
        context.fillStyle = generateColor();
        context.fillText('YORK', textBottomX, textBottomY);
        engine = new window.Physics(canvas, context);
        engine.start();
    };

    var resize = function() {
        canvas.width = $(window).width();
        canvas.height = $(window).height() / 2;
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