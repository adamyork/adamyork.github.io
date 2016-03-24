 /*!
  * physics-pixel
  * Copyright(c) 2016 Adam York
  * MIT Licensed
  */

 'use strict';

 (function(scope) {
     function PhysicsPixel(x, y, r, g, b, a, row, col, size) {
         this.x = x;
         this.y = y;
         this.ax = 0;
         this.ay = 0;
         this.vx = (col - (size / 2)) * 0.5;
         this.vy = (row - (size / 2)) * 0.5;
         this.r = r;
         this.g = g;
         this.b = b;
         this.a = a;
         this.delay = (row * 1) - (col * 1) + Math.round(Math.random() * (size * 10));
         this.bounce = -(Math.round(Math.random() * 10) * 0.1) + 0.4;
     }
     PhysicsPixel.prototype.time = 0;
     scope.PhysicsPixel = PhysicsPixel;
 })(window);