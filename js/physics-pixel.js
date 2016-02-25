 /*!
  * physics-pixel
  * Copyright(c) 2016 Adam York
  * MIT Licensed
  */

 'use strict';

 (function(scope) {
     function PhysicsPixel(x, y, ax, ay, vx, vy, oldX, oldY, r, g, b, a) {
         this.x = x;
         this.y = y;
         this.ax = ax;
         this.ay = ay;
         this.vx = vx;
         this.vy = vy;
         this.oldX = oldX;
         this.oldY = oldY;
         this.r = r;
         this.g = g;
         this.b = b;
         this.a = a;
         this.delay = Math.round(x * Math.random());
         this.bounce = -(Math.round(Math.random() * 10) * 0.1) + 0.4;
     }
     scope.PhysicsPixel = PhysicsPixel;
 })(window);